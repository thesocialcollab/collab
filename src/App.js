import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import { auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import Header from './components/Header';
import Menu from './components/Menu';
import Login from './components/Registration/Login';
import Register from './components/Registration/Register';
import Liked from './components/Pages/Liked';
import Post from './components/Pages/Post';
import Dash from './components/Pages/Dashboard';
import Home from './components/Pages/Home';

import NotFound from './components/Pages/404';

import { ThemeProvider, useTheme } from './components/Theme';
import SettingsComponent from './components/Pages/Settings';

function AppContent() {
  const [user, setUser] = useState(null);
  const { theme } = useTheme();

  function PrivateRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, currentUser => {
        setUser(currentUser);
        setLoading(false);
      });
  
      // Clean up the listener on unmount
      return () => unsubscribe();
    }, []);
  
    if (loading) {
      return <div>Loading...</div>;  // Adjust as needed
    }
  
    if (!user) {
      return <Navigate to="/login" />;
    }
  
    return children;
  }


  useEffect(() => {
    const fetchUserData = async (user) => {
      const uid = user.uid;
      const email = user.email;
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const username = userDoc.data().username;
        setUser({ uid, email, username });
      } else {
        console.error("No such document for the user!");
        setUser({ uid, email });
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setUser(null);
      }
    });
  
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);
  
  

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

  return (
    <Router>
      <div className="App">
        <Header user={user} />

        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login className='login' user={user} setUser={setUser} />} />
            <Route path="/register" element={<Register className='register' user={user} setUser={setUser} />} />

            {/*home module*/}
            <Route path="/" element={<Home />} />

            {/*menu modules*/}
            <Route path="/liked" element={
              <PrivateRoute user={user}>
                <Liked />
              </PrivateRoute>
            } />
            <Route path="/post" element={
              <PrivateRoute user={user}>
                  <Post />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute user={user}>
                <Dash setUser={setUser} />
              </PrivateRoute>
            } />


            <Route path="//Settings" element={
              <PrivateRoute user={user}>
                <SettingsComponent />
              </PrivateRoute>
            } />

            <Route component={NotFound} />
          </Routes>
        </div>
        <Menu />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
