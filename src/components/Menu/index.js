import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

function Menu() {
    const navigate = useNavigate();

    const handleLikedClick = () => {
        navigate("/liked");
    };

    const handleHomeClick = () => {
        navigate("/");
    };

    const handlePostClick = () => {
        navigate("/post");
    };

    return (
        <div className="menu-container">
            <div className="menu-item" onClick={handleLikedClick}>
                <img src="%PUBLIC_URL%/images/icons/heart.png" alt="Liked" className="icon"/>
                Liked
            </div>
            <div className="menu-item" onClick={handleHomeClick}>
                <img src="./images/icons/home.png" alt="Home" className="icon"/>
                Home
            </div>
            <div className="menu-item" onClick={handlePostClick}>
                <img src="./images/icons/plus.png" alt="Post" className="icon"/>
                Post
            </div>
        </div>
    );
}

export default Menu;
