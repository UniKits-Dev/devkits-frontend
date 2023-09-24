// HomePage.js
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import MetaMaskLoginButton from './MetaMaskLoginButton';
// import './LoginPage.css'; // Importing the CSS

// function HomePage() {
//   const navigate = useNavigate();

//   const handleConnected = () => {
//     // Navigate to dashboard after successful connection
//     navigate("/dashboard");
//   };

//   return (
//     <div className="login-container">
//         <div className="logo">
//             <img src="devkits.png" alt="Company Logo" />
//         </div>

//         <h1>Welcome to the DevKits Dashboard</h1>

//         <div className="button">
//           <img src="MetaMask_Fox.svg.png" alt="Logo" className="button-logo" />
//           <MetaMaskLoginButton onConnected={handleConnected} />
//         </div>
//     </div>
// );
// }

// export default HomePage;

import React from 'react';
import { Web3Button } from '@web3modal/react';

function HomePage({ setIsLoggedIn, isLoggedIn }) {
  const handleConnect = async () => {
    try {
      // Perform your authentication logic here
      // Set the isLoggedIn state to true upon successful authentication
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome to the DevKits Dashboard</h1>

      {isLoggedIn ? (
        <p>You are logged in!</p>
      ) : (
        <h2>
          <Web3Button onClick={handleConnect}>Connect with WalletConnect</Web3Button>
        </h2>
      )}
    </div>
  );
}

export default HomePage;