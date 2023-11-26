import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';
import './index.css';

const Profiles = () => {
  const [userData, setUserData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const db = getFirestore(); // Initialize Firestore instance
  let { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchData = async () => {
      if (userId) {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No such user!');
        }
      } else {
        console.log('UserId is undefined');
      }
    };

    fetchData();
  }, [userId, db]); // Include db in the dependency array

  useEffect(() => {
    const auth = getAuth(); // Initialize Auth instance inside useEffect
    // Check if the current user is the owner of the profile
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user && user.uid === userId) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userId]); // auth is initialized inside useEffect, so it's not a dependency

  if (!userData) {
    return <div>Loading...</div>;
  }


  const handleDashboard = () => {
    navigate("/dashboard");
  }

  return (
    <div className="user-profile-container">
        <h1 className="user-profile-header">Profile</h1>
        <div className="user-profile-info">
            <p>Name: {userData.username}</p>
            <p>Email: {userData.email}</p>
        </div>
        {isOwner && (
            <div className="user-profile-actions">
            <button className="user-profile-button">Edit Profile</button>
            <button className="user-profile-button" onClick={handleDashboard}>Dashboard</button>
            </div>
        )}
    </div>

  );
};

export default Profiles;
