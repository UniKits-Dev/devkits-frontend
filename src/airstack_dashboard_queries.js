import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { init, useQuery } from "@airstack/airstack-react";

const apiKey = "732bc95b58134279a2269ab7ee854e2e";
init(apiKey);

const query = `
  query MyQuery {
    SocialFollowers(
      input: {
        filter: {dappName: {_eq: lens}},
        blockchain: ALL,
        limit: 10,
        order: {followerSince: DESC}
      }
    ) {
      Follower {
        followerAddress {
          addresses
          tokenBalances(input: {blockchain: ethereum, limit: 1, order: {formattedAmount: DESC}}) {
            token {
              name
              symbol
            }
            formattedAmount
          }
        }
      }
    }
  }
`;

export const useAirstackQueryFollowers = () => {
    return useQuery(query, { cache: false });
};
