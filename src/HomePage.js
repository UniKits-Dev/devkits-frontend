// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetaMaskLoginButton from './MetaMaskLoginButton';

function HomePage() {
  const navigate = useNavigate();

  const handleConnected = () => {
    // Navigate to dashboard after successful connection
    navigate("/dashboard");
  };

  return (
    <div>
      <h1>Welcome</h1>
      <MetaMaskLoginButton onConnected={handleConnected} />
    </div>
  );
}

export default HomePage;