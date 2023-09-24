import React from 'react';
import {useAirstackQueryFollowers} from './airstack_dashboard_queries.js';

function Dashboard() {
  const { data, loading, error } = useAirstackQueryFollowers();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>You are now connected with MetaMask!</p>

      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Token Name</th>
            <th>Token Symbol</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.SocialFollowers.Follower.map((follower, index) => (
            <tr key={index}>
              <td>{follower.followerAddress.addresses}</td>
              {follower.followerAddress.tokenBalances.map((tokenBalance) => (
                <React.Fragment key={tokenBalance.token.name}>
                  <td>{tokenBalance.token.name}</td>
                  <td>{tokenBalance.token.symbol}</td>
                  <td>{tokenBalance.formattedAmount}</td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
