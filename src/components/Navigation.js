import React from 'react';
import { Link } from 'react-router-dom';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import { Button } from 'react-bootstrap';
import { Web3Button } from '@web3modal/react';
import { Web3NetworkSwitch } from '@web3modal/react'

const projectId = process.env.REACT_APP_WC_API_KEY;
const chains = [arbitrum, mainnet, polygon];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="UniKits_Logo.png" // Replace with the actual image path
            alt="Your Logo"
            height="50px"
            width="auto"
          />
        </Link>

        <div className="navbar-nav float-left-div flex-row flex-md-row flex-lg-row">
          <Button className="buttons-nav" as={Link} to="/" variant="primary">
            Home
          </Button>
          <Button className="buttons-nav"  as={Link} to="/dashboard" variant="primary">
            Dashboard
          </Button>
        </div>

        <div className="wc-buttons">
            <div className="wc-btn float-right-div flex-row flex-md-row flex-lg-row">
            <Web3Button />
            <WagmiConfig config={wagmiConfig}></WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
            </div>
            <div className="network-btn float-right-div flex-row flex-md-row flex-lg-row" > 
            <Web3NetworkSwitch />
            </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
