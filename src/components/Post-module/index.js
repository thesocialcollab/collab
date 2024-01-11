import React, { useState, useEffect } from "react";
import { getFirestore, query, collection, onSnapshot, where, getDocs, deleteDoc, addDoc, getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { auth } from '../../firebase';
import PostDropdown from "./dropdown";
import Comments from "./Comments";
import './index.css';
import { useNavigate } from "react-router-dom";

const Posts = ({ post, setPosts, likedPosts, setLikedPosts }) => {
    const db = getFirestore();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    const [showComments, setShowComments] = useState(false);

    const [likeCount, setLikeCount] = useState(0); // State to store the count of likes
    const [username, setUsername] = useState('');
    const [commentCount, setCommentCount] = useState(0);

    let navigate = useNavigate();


    // Retrieve comment count
    useEffect(() => {
        const commentsRef = collection(db, 'posts', post.id, 'comments');
        const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
          setCommentCount(snapshot.size);
        });
      
        // Cleanup function
        return () => unsubscribe();
      }, [db, post.id]);

    // Retrieve username
    useEffect(() => {
        const fetchUsername = async () => {
          const userDoc = await getDoc(doc(db, 'users', post.userId));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          } else {
            console.error("User not found");
          }
        };
      
        fetchUsername();
      }, [db, post.userId]);

    const handleDropdownToggle = (postId) => {
        setActiveDropdown(activeDropdown === postId ? null : postId);
    };

    // Delete post and associated file from Firebase Storage
    const handleDeletePost = async (postId) => {
        if (!auth.currentUser) {
            console.error("User not authenticated!");
            return;
        }
    
        try {
            // First, fetch the post data to check for a file
            const postRef = doc(db, "posts", postId);
            const postSnap = await getDoc(postRef);
            
            if (postSnap.exists()) {
                const postData = postSnap.data();
    
                // Check if there's a file associated with the post
                if (postData.fileUrl) {
                    const storage = getStorage();
                    const fileRef = ref(storage, postData.fileUrl); // Assuming fileUrl is the full path in storage
    
                    // Delete the file from Firebase Storage
                    await deleteObject(fileRef);
                    console.log("File successfully deleted!");
                }
    
                // Delete the post document from Firestore
                await deleteDoc(postRef);
                setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
                console.log("Post successfully deleted!");
            } else {
                console.error("Post not found!");
            }
        } catch (error) {
            console.error("Error deleting post or file:", error);
        }
    };
    
    // Like/unlike a post
    const toggleLike = async (postId) => {
        if (!auth.currentUser) {
            console.error("User not authenticated!");
            return;
        }
    
        const userId = auth.currentUser.uid; // Get current user's ID
    
        try {
            const userLikeRef = collection(db, "users", userId, "likes");
            const postLikeRef = collection(db, "posts", postId, "likes");
    
            if (likedPosts.includes(postId)) {
                // UNLIKE logic
                // Remove like from user's collection
                const q = query(userLikeRef, where("postId", "==", postId));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (docSnapshot) => {
                    await deleteDoc(docSnapshot.ref);
                });
    
                // Remove user from post's likes collection
                const qPostLikes = query(postLikeRef, where("userId", "==", userId));
                const querySnapshotPostLikes = await getDocs(qPostLikes);
                querySnapshotPostLikes.forEach(async (docSnapshot) => {
                    await deleteDoc(docSnapshot.ref);
                });
    
                setLikedPosts(prevLiked => prevLiked.filter(id => id !== postId));
            } else {
                // LIKE logic
                // Add like to user's collection
                await addDoc(userLikeRef, {
                    postId: postId,
                    timestamp: new Date()
                });
    
                // Add user to post's likes collection
                await addDoc(postLikeRef, {
                    userId: userId,
                    timestamp: new Date()
                });
    
                setLikedPosts(prevLiked => [...prevLiked, postId]);
            }
        } catch (error) {
            console.error("Error liking/unliking post:", error);
        }
    };
    

    // Toggle comments
    const toggleComments = () => {
        setShowComments(!showComments);
    };


    useEffect(() => {
        // Fetch the number of likes when the component mounts or post changes
        const fetchLikeCount = async () => {
            const postLikeRef = collection(db, "posts", post.id, "likes");
            const querySnapshot = await getDocs(postLikeRef);
            setLikeCount(querySnapshot.docs.length); // Set the number of likes
        };

        fetchLikeCount();
    }, [post.id, db]);

    const handleProfile = () => {
        // Use the userId from the post object
        const postUserId = post.userId;
    
        if (postUserId) {
            navigate(`/profile/${postUserId}`); // Navigate to the profile of the user who created the post
        } else {
            console.error("Post user ID not found");
            // Handle the case when the post's user ID is not available
        }
    }
    

    return (
        <div className="post-container-item">
            {/* Post content */}
            <div className='post-banner'>
                <h3 className="post-username" onClick={handleProfile}>{username}</h3>
                <div className="dropdown-container">
                    <img onClick={() => handleDropdownToggle(post.id)} src="./images/icons/3dots.png" className="post-options-icon" width="30px" alt="Dropdown" />
                    <div className={`dropdown-menu ${activeDropdown === post.id ? 'active' : ''}`}>
                        {userId === post.userId && (
                            <PostDropdown onDelete={() => handleDeletePost(post.id)} />
                        )}
                    </div>
                </div>
            </div>
            <p>{post.text}</p>
            <div className='post-content'>
                {
                    post.fileType === 'image' && post.fileUrl &&
                    <img className='post-image' src={post.fileUrl} alt="Post" />
                }
                {
                    post.fileType === 'audio' && post.fileUrl &&
                    <audio controls>
                        <source src={post.fileUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                }
            </div>

            <div className='post-footer'>
                <div className='likes'>
                    {likeCount >= 1 && <span>{likeCount}</span>} {/* Conditionally display like count */}
                    <img 
                    src={`${likedPosts.includes(post.id) ? './images/icons/pinfilled.png' : './images/icons/pin1.png'}`} 
                    alt="heart" 
                    onClick={() => toggleLike(post.id)} 
                    className={`like-button${likedPosts.includes(post.id) ? ' liked' : ''}`} 
                    />
                </div>
                    {/* View Comments Button */}
                    <button className="view-comments-btn" onClick={toggleComments}>
                        {showComments ? "Hide Comments" : `View Comments (${commentCount})`}
                    </button>

                <div className='comments-container'>
                    {/* Comments Component */}
                    {showComments && <Comments postId={post.id} />}
                </div>
                
            </div>
        </div>
    );
};

export default Posts;


