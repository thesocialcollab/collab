import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import './index.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the username from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUser({
          email: user.email,
          uid: user.uid,
          username: userDoc.data().username
        });
      } else {
        console.error('No such document for the user!');
      }

      navigate('/'); // or wherever you want to redirect after successful login
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in. Please check your credentials.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  }

  return (
    <div className='login-form-container'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <div className='login-container'>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Login</button>
        </div>
      </form>
      <div className="register-option">
          <p>Don't have an account?</p>
          <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default Login;
