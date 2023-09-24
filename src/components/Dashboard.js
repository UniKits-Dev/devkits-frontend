import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { init, useQuery } from "@airstack/airstack-react";
import './Dashboard.css';


const apiKey = process.env.REACT_APP_AIRSTACK_API_KEY;
init(apiKey);

function Dashboard() {
  const { address, isConnecting, isDisconnected } = useAccount()
  const addressTest = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
  console.log(address);
  
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


import React, { useState, useEffect, useRef } from 'react';
import { init, useQuery } from "@airstack/airstack-react";
import { useAccount } from 'wagmi';
import './LoginPage.css';
import './Dashboard.css';

const apiKey = process.env.REACT_APP_AIRSTACK_API_KEY;
init(apiKey);

function CombinedComponent() {
    const { address, isConnecting, isDisconnected } = useAccount();
    const [authenticAccount, setAuthenticAccount] = useState(false);

    // Using the queries you'd define
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

const query_follow_token = `
  query MyQuery {
    SocialFollowers(
      input: {filter: {identity: {_eq: "vitalik.eth"}}, blockchain: ALL, limit: 1, order: {followerSince: DESC}}
    ) {
      Follower {
        followerProfileId
        followerSince
        followerAddress {
          addresses
          socials {
            profileName
            profileDisplayName
          }
        }
      }
    }
    TokenTransfers(
      input: {filter: {from: {_eq: "vitalik.eth"}}, blockchain: ethereum, order: [{blockTimestamp: DESC}], limit: 1}
    ) {
      TokenTransfer {
        amount
        tokenAddress
        tokenType
        blockchain
        token {
          name
          symbol
          totalSupply
          logo {
            original
          }
        }
      }
    }
  }
`;
  
    const { data: socialData, loading: socialLoading, error: socialError } = useQuery(query_follow_token, {}, { cache: false, fetchPolicy: 'no-cache', timeout: 10000 });
    const { data, loading: airstackLoading, error } = useQuery(query, { identity: address }, { cache: false });

    useEffect(() => {
        if (data) {
            const jsonData = JSON.stringify(data, null, 2);
            const parsedData = JSON.parse(jsonData);

            try {
                if (parsedData.Wallet.domains == null && parsedData.Socials.Social == null) {
                    console.log("ENS account and Lens does not exist");
                } else if (parsedData.Wallet.domains[0].name != null || parsedData.Socials.Social[0].dappName === "lens") {
                    console.log("ENS account or Lens account exists");
                    setAuthenticAccount(true);
                }
            } catch (error) {
                console.error("An error occurred while accessing data:", error);
            }
        }
    }, [data, address]);

    if (authenticAccount === false) {
        return <div className="important">You need an ENS account or Lens account to access Dashboard</div>
    }

      return (
        <div className="login-container">
            <h1>Social Followers</h1>
            <table>
                <thead>
                    <tr>
                        <th>Profile ID</th>
                        <th>Since</th>
                        <th>Address</th>
                        <th>Profile Name</th>
                        <th>Profile Display Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.SocialFollowers?.Follower?.map((follower, index) => (
                        <tr key={index}>
                            <td>{follower.followerProfileId}</td>
                            <td>{follower.followerSince}</td>
                            <td>{follower.followerAddress.addresses}</td>
                            <td>{follower.followerAddress.socials[0]?.profileName}</td>
                            <td>{follower.followerAddress.socials[0]?.profileDisplayName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            <h1>Token Transfers</h1>
            <table>
                <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Token Address</th>
                        <th>Token Type</th>
                        <th>Blockchain</th>
                        <th>Token Name</th>
                        <th>Symbol</th>
                        <th>Total Supply</th>
                    </tr>
                </thead>
                <tbody>
                    {data.TokenTransfers?.TokenTransfer?.map((transfer, index) => (
                        <tr key={index}>
                            <td>{transfer.amount}</td>
                            <td>{transfer.tokenAddress}</td>
                            <td>{transfer.tokenType}</td>
                            <td>{transfer.blockchain}</td>
                            <td>{transfer.token?.name}</td>
                            <td>{transfer.token?.symbol}</td>
                            <td>{transfer.token?.totalSupply}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CombinedComponent;

