import React, { useState } from "react";
import { getFirestore, query, collection, where, getDocs, deleteDoc, addDoc, getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { auth } from '../../firebase';
import PostDropdown from "./dropdown";
import Comments from "./Comments";
import './index.css';

const Posts = ({ post, setPosts, likedPosts, setLikedPosts }) => {
    const db = getFirestore();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    const [showComments, setShowComments] = useState(false);

    const handleDropdownToggle = (postId) => {
        setActiveDropdown(activeDropdown === postId ? null : postId);
    };

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
    

    const toggleLike = async (postId) => {
        if (!auth.currentUser) {
            console.error("User not authenticated!");
            return;
        }

        if (likedPosts.includes(postId)) {
            // UNLIKE logic
            try {
                const q = query(collection(db, "users", userId, "likes"), where("postId", "==", postId));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (docSnapshot) => {
                    await deleteDoc(docSnapshot.ref);
                });
                setLikedPosts(prevLiked => prevLiked.filter(id => id !== postId));
            } catch (error) {
                console.error("Error unliking post:", error);
            }
        } else {
            // LIKE logic
            try {
                await addDoc(collection(db, "users", userId, "likes"), {
                    postId: postId,
                    timestamp: new Date()
                });
                setLikedPosts(prevLiked => [...prevLiked, postId]);
            } catch (error) {
                console.error("Error liking post:", error);
            }
        }
    };


    const toggleComments = () => {
        setShowComments(!showComments);
    };

    return (
        <div className="post-container-item">
            {/* Post content */}
            <div className='post-banner'>
                <h3>{post.username}</h3>
                <div className="dropdown-container">
                    <button onClick={() => handleDropdownToggle(post.id)}>...</button>
                    <div className="dropdown-menu">
                        {activeDropdown === post.id && userId === post.userId && (
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
                <img 
                    src={`${likedPosts.includes(post.id) ? './images/icons/heartfilled.png' : './images/icons/heart.png'}`} 
                    alt="heart" 
                    onClick={() => toggleLike(post.id)} 
                    className={`like-button${likedPosts.includes(post.id) ? ' liked' : ''}`} 
                />
                    {/* View Comments Button */}
                    <button className="view-comments-btn" onClick={toggleComments}>
                        {showComments ? "Hide Comments" : "View Comments"}
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


