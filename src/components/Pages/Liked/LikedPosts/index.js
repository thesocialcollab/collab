import React from 'react';
import './index.css';

const SingleLikedPost = React.memo(({ post }) => {
    console.log(`Rendered: ${post.id}`);  // For debugging re-renders

    return (
        <div className="post-container-item">
            <h3>{post.username}</h3>
            <p>{post.text}</p>
        </div>
    );
});

export default SingleLikedPost;
