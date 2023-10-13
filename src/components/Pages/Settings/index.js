import React from "react";
import { useTheme } from "../../Theme";
import './index.css';

const SettingsComponent = () => {
    const { theme, setTheme } = useTheme();

    const handleThemeToggle = (event) => {
        // Using the checked property of the checkbox to determine the next theme
        const newTheme = event.target.checked ? "dark" : "light";
        setTheme(newTheme);
    };

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
        </div>
    );
};

export default SettingsComponent;
