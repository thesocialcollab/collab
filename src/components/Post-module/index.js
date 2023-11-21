import React from 'react';
import PostDropdown from "./dropdown";

const Posts = ({ post, handleDropdownToggle, activeDropdown, handleDeletePost, toggleLike, likedPosts, userId }) => {
    return (
        <div key={post.id} className="post-container-item">
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
