import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Tableau de bord Employé</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Déconnexion
        </button>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Bienvenue, Employé</h2>
          <p>Vous avez accès aux fonctionnalités de base du système.</p>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard; 