import React from 'react';
import './index.css';

function Logo( {onLogoClick}) {
  return (
    <div className="logo-container" onClick={onLogoClick}>
      <img src="./images/collablogo2.png" alt="App Logo" />
      <div className="logo-text">
        Beta
      </div>
    </div>
  );
}

export default Logo;
