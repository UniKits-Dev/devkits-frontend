import React from 'react';

function HomePage() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="header-style">Welcome to UniKits</h1>
      <p className="paragraph-style important">Only authenticated users with Lens or ENS profiles may use this dapp</p>
      <p className="paragraph-style">Please authenticate and sign in with WalletConnect to start querying the blockchain and taking advantage of Uniswap V4.</p>
    </div>
  );
}

export default HomePage;
