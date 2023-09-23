import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { init, useQuery } from "@airstack/airstack-react";

const apiKey = "732bc95b58134279a2269ab7ee854e2e";
init(apiKey);

const query = `
query MyQuery($identity: Identity) {
  Socials(
    input: {
      filter: {
        identity: { _eq: $identity }
        dappSlug: { _eq: lens_polygon }
      }
      blockchain: ethereum
    }
  ) {
    Social {
      dappName
      dappSlug
      profileName
    }
  }
}
`;

function MetaMaskLoginButton({ onConnected }) {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);

  const { data, loading: airstackLoading, error } = useAirstackQuery({ identity: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" }); //account

  useEffect(() => {
    if (data && account) {
      const response = JSON.stringify(data, null, 2);
      const parsedData = JSON.parse(response);
      console.log(parsedData);
      console.log("Current Wallet ID:", account);
      // Place any additional logic you'd want to run upon getting the data here
      const name = getNameForAddress(parsedData);
      if (name && (name.endsWith('.eth') || name.endsWith('.lens'))) {
        onConnected();
      } else {
        console.error("Name does not end with .eth or .lens");
      }
    }
  }, [data, account, onConnected]);

  const getNameForAddress = (parsedData) => {
    if (parsedData && parsedData.Socials && parsedData.Socials.Social && parsedData.Socials.Social.length > 0) {
        const profileName = parsedData.Socials.Social[0].profileName;
        if (profileName.endsWith('.lens') || profileName.endsWith('.eth')) {
            console.log("Profile Found :)");
            return profileName;
        }
    }
    console.log("Profile name not found or doesn't end with .lens or .eth");

    const data = {
      "Socials": {
        "Social": [
          {
            "dappName": "lens",
            "dappSlug": "lens_polygon",
            "profileName": "vitalik.lens"
          }
        ]
      }
    };
    
    console.log(data.Socials.Social[0].profileName);

    return null;
};

  const connectMetaMask = async () => {
    setLoading(true);

    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAccount("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"); // This sets the account and triggers the useEffect hook use accounts[0]
        }
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.error("MetaMask not detected");
    }

    setLoading(false);
  };

  return (
    <button onClick={connectMetaMask} disabled={loading || airstackLoading}>
      {loading || airstackLoading ? 'Connecting...' : 'Connect with MetaMask'}
    </button>
  );
}

const useAirstackQuery = (variables) => {
  return useQuery(query, variables, { cache: false });
};

export default MetaMaskLoginButton;
