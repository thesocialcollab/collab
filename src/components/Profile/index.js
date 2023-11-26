import React from 'react';
import './index.css';

function Profile({ image, onProfileClick }) {

  return (
    <div className="profile-container" onClick={onProfileClick}>
      <img src={image} alt="User Profile"/>
    </div>
  );
}

export default Profile;
