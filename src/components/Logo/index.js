import React from 'react';
import './index.css';

function Logo( {onLogoClick}) {
  return (
    <div className="logo-container" onClick={onLogoClick}>
      <img src="./images/collablogo1.png" alt="App Logo" />
      <div className="logo-text">
        Beta 1
      </div>
    </div>
  );
}

export default Logo;
