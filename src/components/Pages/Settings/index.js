import React from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import { useTheme } from "../../Theme";
import './index.css';

const SettingsComponent = () => {
    const { theme, setTheme } = useTheme();

    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const handleThemeToggle = (event) => {
        // Using the checked property of the checkbox to determine the next theme
        const newTheme = event.target.checked ? "dark" : "light";
        setTheme(newTheme);
    };

    /*
    const handleNotificationPermission = async () => {
        const messaging = getMessaging();
      
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            const token = await getToken(messaging);
            console.log('Token:', token);
      
            // Send the token to your server
            fetch('https://your-server.com/api/save-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: token,
                userId: userId, // the ID of the user, from your authentication system
              }),
            })
            .then(response => response.json())
            .then(data => console.log('Token saved on the server:', data))
            .catch((error) => {
              console.error('Error:', error);
            });
      
          } else {
            console.log('Unable to get permission to notify.');
          }
        } catch (err) {
          console.log('Unable to get permission to notify.', err);
        }
      };  */

    return (
        <div className="settings">
            <h2>Settings</h2>
            <div className="theme-toggle">
                <label>Dark Mode</label>
                <input 
                    type="checkbox" 
                    checked={theme === "dark"} 
                    onChange={handleThemeToggle} 
                />
            </div>
            <button>
                Enable Notifications
            </button>
        </div>
    );
};

export default SettingsComponent;
