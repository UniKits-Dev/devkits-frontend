// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetaMaskLoginButton from './MetaMaskLoginButton';
import './LoginPage.css'; // Importing the CSS

import { Web3Button } from '@web3modal/react'

function HomePage() {
  return <Web3Button />
}
// function HomePage() {
//   const navigate = useNavigate();

//   const handleConnected = () => {
//     // Navigate to dashboard after successful connection
//     navigate("/dashboard");
//   };

//   return (
//     <div className="login-container">
//         <div className="logo">
//             <img src="public/logo192.png" alt="Company Logo" />
//         </div>

//         <h1>Welcome to the DevKits Dashboard</h1>

//         <h2><MetaMaskLoginButton onConnected={handleConnected} /></h2>

//     </div>
// );
// }

export default HomePage;