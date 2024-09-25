import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';// Import the useAuth hook
import './LogoutPage.css'; // Importing the CSS file

const LogoutPage: React.FC = () => {
  const { logout } = useAuth(); // Get the logout function from AuthContext
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="logout-page">
      <div className="message-container">
        <div className="goodbye-icon">👋</div>
        <h1 className="logout-message">Thanks for using our services!</h1>
        <h2 className="bye-message">See you soon! Visit again!</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default LogoutPage;
