import React, { useState, useEffect, useRef } from 'react';
import { init, useQuery } from "@airstack/airstack-react";
import { useAccount } from 'wagmi';
import './Dashboard.css';

const apiKey = process.env.REACT_APP_AIRSTACK_API_KEY;
init(apiKey);

    // Using the queries you'd define
    

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

function CombinedComponent() {
  const { address } = useAccount();
  const [authenticAccount, setAuthenticAccount] = useState(false);
  const [socialQueryOptions, setSocialQueryOptions] = useState(null);

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

  const { data } = useQuery(
    query,  
    { identity: address },  
    { cache: false, skip: !address }
  );

  const { data: socialData } = useQuery(
    query_follow_token,
    {},
    { cache: false, fetchPolicy: 'no-cache', timeout: 10000 }
  );


useEffect(() => {
    if (data && address) {
        const jsonData = JSON.stringify(data, null, 2);
        const parsedData = JSON.parse(jsonData);

        try {
            if (parsedData.Wallet.domains == null && parsedData.Socials.Social == null) {
                console.log("ENS account and Lens does not exist");
                console.log(socialData)
            } else if (parsedData.Wallet.domains[0]?.name || parsedData.Socials.Social[0]?.dappName === "lens") {
                console.log("ENS account or Lens account exists");
                setAuthenticAccount(true);
            }
        } catch (error) {
            console.error("An error occurred while accessing data:", error);
        }
    }
}, [data, address]);

useEffect(() => {
    if (authenticAccount) {
        setSocialQueryOptions({ cache: false, fetchPolicy: 'no-cache', timeout: 10000 });
    }
}, [authenticAccount]);

return (
  <div className="login-container">
      {!authenticAccount ? (
          <div className="important">
              You need an ENS account or Lens account to access the full Dashboard.
          </div>
      ) : null}

      <h1>Your Most Recent Follower</h1>
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
              {socialData?.SocialFollowers?.Follower?.map((follower, index) => (
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

      <h1>Your Most Recent Token Swap</h1>
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
              {socialData?.TokenTransfers?.TokenTransfer?.map((transfer, index) => (
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

