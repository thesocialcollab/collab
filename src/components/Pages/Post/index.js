import React from 'react';
import './index.css';
import { Routes, Route, useNavigate } from 'react-router-dom';


function Post() {
    const navigate = useNavigate();

    const handleImageClick = () => {
        navigate("/post/textpost");
    }

  return (
    <div className="post-container">
      <div className="post-item">
        <img src="./images/icons/tree.png" alt="tree" className="post-icon" />
        <p>Image</p>
      </div>
      <div className="post-item">
        <img src="./images/icons/music.png" alt="Audio" className="post-icon" />
        <p>Audio</p>
      </div>
      <div className="post-item" onClick={handleImageClick}>
        <img src="./images/icons/text.png" alt="Text" className="post-icon" />
        <p>Text</p>
      </div>
    </div>
  );
}

export default Post;
