import React, { useState } from 'react';
import Web3 from 'web3';
import { init, useQuery } from "@airstack/airstack-react";

// Retrieve the API key from the environment variable
const apiKey = process.env.REACT_APP_AIRSTACK_API_KEY;

init(apiKey);


function MetaMaskLoginButton({ onConnected }) {
  const [loading, setLoading] = useState(false);

  // This is a mockup. Replace this with the actual function that retrieves the mapped name.
  const mappedNames = {
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

  const getNameForAddress = (address) => {
  
    if (mappedNames[address] && mappedNames[address].Socials && mappedNames[address].Socials.Social && mappedNames[address].Socials.Social.length > 0) {
      // For simplicity, returning the first profileName. You can modify as needed.
      console.log("Profile Found :)")
      return mappedNames[address].Socials.Social[0].profileName;
    }
    console.log("Returned nothing");
    console.log(mappedNames[address])
    return null;  // or return an empty string, or throw an error, based on your requirements.
  };
  

  const connectMetaMask = async () => {
    setLoading(true);

    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const test_account = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" 

        const variables = {
          identity: test_account, //Wallet Passthrough for query.
        }
        const { data, loading, error } = useAirstackQuery(variables);
        console.log(JSON.stringify(data, null, 2));
        console.log("Attempted to run airstack query")
        console.log(accounts.length)
        if (accounts.length > 0) {
          const name = getNameForAddress(test_account); //accounts[0]

          if (name.endsWith('.eth') || name.endsWith('.lens')) {
            onConnected();
            console.log(accounts);
          } else {
            console.error("Name does not end with .eth or .lens");
          }
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
    <button onClick={connectMetaMask} disabled={loading}>
      {loading ? 'Connecting...' : 'Connect with MetaMask'}
    </button>
  );
}

  const query = `
 
  `;

  const useAirstackQuery = (variables) => {
    const { data, loading, error } = useQuery(query, variables, { cache: false });
    return { data, loading, error };
  };
  

export default MetaMaskLoginButton;


import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { init, useQuery } from "@airstack/airstack-react";

const apiKey = process.env.REACT_APP_AIRSTACK_API_KEY;
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
  },
  Wallet(input: {identity: "vitalik.eth", blockchain: ethereum}) {
    domains(input: {limit: 50}) {
      name
      owner
      resolvedAddress
      resolverAddress
      expiryTimestamp
      isPrimary
      labelName
      labelHash
      name
      paymentToken {
        name
        symbol
      }
      paymentTokenCostInNativeToken
      paymentTokenCostInUSDC
      registrationCost
      registrationCostInNativeToken
      registrationCostInUSDC
      formattedRegistrationCost
      formattedRegistrationCostInNativeToken
      formattedRegistrationCostInUSDC
      subDomains(input: {limit: 50}) {
        name
        owner
        resolvedAddress
        resolverAddress
        expiryTimestamp
        isPrimary
        labelName
        labelHash
        name
        paymentToken {
          name
          symbol
        }
        paymentTokenCostInNativeToken
        paymentTokenCostInUSDC
        registrationCost
        registrationCostInNativeToken
        registrationCostInUSDC
        formattedRegistrationCost
        formattedRegistrationCostInNativeToken
        formattedRegistrationCostInUSDC
      }
      subDomainCount
      tokenId
      ttl
      chainId
      blockchain
      createdAtBlockNumber
      createdAtBlockTimestamp
      lastUpdatedBlockNumber
      lastUpdatedBlockTimestamp
    }
  }
}
`;

function MetaMaskLoginButton({ onConnected }) {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);

  const { data, loading: airstackLoading, error } = useAirstackQuery({ identity: account });

  useEffect(() => {
    if (data) {
      console.log(JSON.stringify(data, null, 2));
      // Place any additional logic you'd want to run upon getting the data here
      const name = getNameForAddress(account);
      if (name && (name.endsWith('.eth') || name.endsWith('.lens'))) {
        onConnected();
        console.log(account);
      } else {
        console.error("Name does not end with .eth or .lens");
      }
    }
  }, [data, account, onConnected]);

  // ... rest of your code ...

  const connectMetaMask = async () => {
    setLoading(true);

    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]); // This sets the account and triggers the useEffect hook
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


