import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import SetupPassword from './SetupPassword'; // <--- Import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* THIS IS THE ROUTE FOR THE INVITE LINK */}
        <Route path="/setup-password/:token" element={<SetupPassword />} />
        
      </Routes>
    </Router>
  );
};

export default App;