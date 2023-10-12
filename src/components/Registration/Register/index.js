import React, { useState } from 'react';
import { auth } from '../../../firebase'; // Import Firebase config & authentication
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase's function for user registration
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import './index.css';

function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const db = getFirestore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
        alert('Passwords do not match!');
        return;
    }
    try {
        // Register the user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store the username and email in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            email: email
        });

        setUser({ username, email });

        navigate('/');

        // TODO: Redirect user to dashboard or any other page
    } catch (error) {
        console.error("Error registering user:", error);
        alert("Failed to register. Please try again.");
    }
};


  return (
    <div className='registration-form-container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className='registration-form'>
        <div className='registration-container'>
            <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div>
            <label>Confirm Password:</label>
            <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required />
            </div>
            <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
