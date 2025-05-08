import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  console.log('Current location:', location.pathname); // Debug log

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-content">
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', minHeight: 'calc(100vh - 40px)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 