import React, { useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

function Menu() {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("/"); // Default active item

    const handleMenuClick = (path) => {
        navigate(path);
        setActiveItem(path);
    };

    const isActive = (path) => {
        return activeItem === path ? 'active' : '';
    };

    return (
        <div className="menu-container">
            <div className={`menu-item ${isActive("/liked")}`} onClick={() => handleMenuClick("/liked")}>
                <img src="./images/icons/homeheart.png" alt="Liked" className="icon"/>
            </div>
            <div className={`menu-item ${isActive("/")}`} onClick={() => handleMenuClick("/")}>
                <img src="./images/icons/homehouse.png" alt="Home" className="icon"/>
            </div>
            <div className={`menu-item ${isActive("/post")}`} onClick={() => handleMenuClick("/post")}>
                <img src="./images/icons/homeplus.png" alt="Post" className="icon"/>
            </div>
        </div>
    );
}

export default Menu;
