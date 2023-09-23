// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetaMaskLoginButton from './MetaMaskLoginButton';
import './LoginPage.css'; // Importing the CSS

function HomePage() {
  const navigate = useNavigate();

  const handleConnected = () => {
    // Navigate to dashboard after successful connection
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
        <div className="logo">
            <img src="devkits.png" alt="Company Logo" />
        </div>

        <h1>Welcome to the DevKits Dashboard</h1>

        <div className="button">
          <img src="MetaMask_Fox.svg.png" alt="Logo" className="button-logo" />
          <MetaMaskLoginButton onConnected={handleConnected} />
        </div>
    </div>
);
}

export default HomePage;