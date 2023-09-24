import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { init, useQuery } from "@airstack/airstack-react";


const apiKey = process.env.REACT_APP_AIRSTACK_API_KEY;
init(apiKey);

function Dashboard() {
  const { address, isConnecting, isDisconnected } = useAccount()
  const addressTest = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
  console.log(address);
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
  Wallet(input: {identity: "${address}", blockchain: ethereum}) {
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
  //console.log(query);
  const useAirstackQuery = (variables) => {
    return useQuery(query, variables, { cache: false });
  };
  const { data, loading: airstackLoading, error } = useAirstackQuery({ identity: address });
  const AuthenticAccount = false;

  useEffect(() => {
    if (data) {
      //console.log("data exists");
      //console.log(JSON.stringify(data, null, 2));
      const jsonData = JSON.stringify(data, null, 2);
      const parsedData = JSON.parse(jsonData);
    
      try {
        if (parsedData.Wallet.domains == null && parsedData.Socials.Social == null){
          console.log("ENS account and Lens does not exist");
        }
        else if (parsedData.Wallet.domains[0].name != null || parsedData.Socials.Social[0].dappName == "lens") {
          console.log("ENS account or Lens account exists");
          const AuthenticAccount = true;
        }
      } catch (error) {
        console.error("An error occurred while accessing data:", error);
      }
    }
    
  }, [data, address]);

  if (AuthenticAccount == false){
    return <div className="important">You need an ENS account or Lens account to access Dashboard</div>
  }

  return <div>"Congrats!"</div>
  
  // if (isConnecting) return <div>Connecting…</div>
  // if (isDisconnected) return <div>Disconnected</div>

  // return <div>{address}</div>
}


export default Dashboard;
