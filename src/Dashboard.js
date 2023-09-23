// Dashboard.js
import React from 'react';
import {useAirstackQueryFollowers} from './airstack_dashboard_queries.js';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>You are now connected with MetaMask!</p>
    </div>
  );
}

export default Dashboard;