import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import Logo from '../Logo';
import Profile from '../Profile';

function Header({ user }) {
  const navigate = useNavigate();
  const [image] = useState('./images/profile.jpg');


  const handleProfileClick = () => {
    // For now, I'm redirecting to /login regardless of authentication state.
    // You can later introduce a check to determine whether the user is already logged in.
    navigate("/dashboard");
  };

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
