import React, { useState } from "react";
import { getFirestore, query, collection, where, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { auth } from '../../firebase';
import PostDropdown from "./dropdown";
import './index.css';

const Posts = ({ post, setPosts, likedPosts, setLikedPosts }) => {
    const db = getFirestore();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const handleDropdownToggle = (postId) => {
        setActiveDropdown(activeDropdown === postId ? null : postId);
    };

    const handleDeletePost = async (postId) => {
        if (!auth.currentUser) {
            console.error("User not authenticated!");
            return;
        }

        try {
            await deleteDoc(doc(db, "posts", postId));
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
            console.log("Post successfully deleted!");
        } catch (error) {
            console.error("Error deleting post:", error);
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

            <img 
                src={`${likedPosts.includes(post.id) ? './images/icons/heartfilled.png' : './images/icons/heart.png'}`} 
                alt="heart" 
                onClick={() => toggleLike(post.id)} 
                className={`like-button${likedPosts.includes(post.id) ? ' liked' : ''}`} 
            />
        </div>
    );
};

export default Posts;


