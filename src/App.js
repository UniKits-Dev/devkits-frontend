// App.js for DevKits Frontend

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css'; 


function App() {
  return (
    <>
        <Router>
        <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
 
    </>
  );
}

export default App;
