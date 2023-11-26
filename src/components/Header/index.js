import React, { useState } from 'react';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './index.css';
import Logo from '../Logo';
import Profile from '../Profile';

function Header({ user }) {
  const navigate = useNavigate();
  const [image] = useState('./images/profile.jpg');


  const handleProfileClick = () => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (userId) {
      navigate(`/profile/${userId}`); // Navigate to profile with userId
      // Or, if using state: navigate('/profile', { state: { userId } });
    } else {
      console.error("User not authenticated");
      // Handle the case when user is not authenticated
    }
  }

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="header">
      <Logo onLogoClick={handleLogoClick}/>
      {user && <p>{user.username}</p>}
      <Profile image={image} onProfileClick={handleProfileClick} />
    </div>
  );
}

export default Header;
