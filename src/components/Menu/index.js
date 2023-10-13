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
                <img src="./images/icons/heart.png" alt="Liked" className="icon"/>
            </div>
            <div className="menu-item" onClick={handleHomeClick}>
                <img src="./images/icons/home.png" alt="Home" className="icon"/>
            </div>
            <div className="menu-item" onClick={handlePostClick}>
                <img src="./images/icons/plus.png" alt="Post" className="icon"/>
            </div>
        </div>
    );
}

export default Menu;
