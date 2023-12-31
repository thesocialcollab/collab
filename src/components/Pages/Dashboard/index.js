import React from 'react';
import { auth } from '../../../firebase'; // Assuming you've set up Firebase in a similar directory structure
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './index.css';


function Dash({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleSettings = () => {
    navigate("/settings");
  }

  const handleProfile = () => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (userId) {
      navigate(`/profile/${userId}`); // Navigate to profile with userId
      // Or, if using state: navigate('/profile', { state: { userId } });
    } else {
      console.error("User not authenticated");
      // Handle the case when user is not authenticated
    }
  }

  return (
    <div className='dashboard-form-container'>
      <h2>Dashboard</h2>
      <div className='dashboard-container'>
        <div className='dashboard-item' onClick={handleProfile}>Profile</div>
        <div className='dashboard-item' onClick={handleSettings}>Settings</div> {/* You can add onClick handlers for settings or navigate to settings page */}
        <div className='dashboard-item' onClick={handleLogout}>Logout</div>

      </div>
    </div>
  );
}

export default Dash;
