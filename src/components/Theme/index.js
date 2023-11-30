import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // or whatever your default theme is

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--primary-color', theme === 'dark' ? '#4c4c4c' : '#cdcdcd');
    root.style.setProperty('--secondary-color', theme === 'dark' ? '#2e2e31' : '#d4d4d4');
    root.style.setProperty('--tertiary-color', theme === 'dark' ? '#1f1f22' : '#ffffff');
    root.style.setProperty('--background-color', theme === 'dark' ? '#151515' : '#ffffff');
    root.style.setProperty('--font-color', theme === 'dark' ? '#ffffff' : '#000000');
    // Add more CSS variables as needed
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};