import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './index.css';

const EditProfile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');

    const [editUsername, setEditUsername] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editBio, setEditBio] = useState(false);

    const db = getFirestore();
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const userRef = doc(db, 'users', userId);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
              setUsername(docSnap.data().username || '');
              setEmail(docSnap.data().email || '');
              setBio(docSnap.data().bio || '');
            }
        };

        fetchData();
    }, [db, userId]);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
          username: username,
          email: email,
          bio: bio
      });
  
      // Navigate away with the navigate function
      navigate(`/profile/${userId}`);
      
  };


  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-header">Edit Profile</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>
          Username:
          {editUsername ? (
            <input type="text" value={username} onChange={handleUsernameChange} />
          ) : (
            <span>{username}</span>
          )}
          <button type="button" onClick={() => setEditUsername(!editUsername)}>
            {editUsername ? 'Done' : 'Edit'}
          </button>
        </label>
        <br />
        <label>
          Email:
          {editEmail ? (
            <input type="text" value={email} onChange={handleEmailChange} />
          ) : (
            <span>{email}</span>
          )}
          <button type="button" onClick={() => setEditEmail(!editEmail)}>
            {editEmail ? 'Done' : 'Edit'}
          </button>
        </label>
        <br />
        <label>
          Bio:
          {editBio ? (
            <input type="text" value={bio} onChange={handleBioChange} />
          ) : (
            <span>{bio}</span>
          )}
          <button type="button" onClick={() => setEditBio(!editBio)}>
            {editBio ? 'Done' : 'Edit'}
          </button>
        </label>
        <br />
        <input type="submit" value="Save Changes" />
      </form>
    </div>
  );
};

export default EditProfile;


