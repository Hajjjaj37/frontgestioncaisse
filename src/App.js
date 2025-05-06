import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Products from './components/dashboard/Products';
import Navbar from './components/Navbar';
import AddProduct from './components/dashboard/AddProduct';
import './App.css';

// Pages components
const Employees = () => <div className="content">Employees Page</div>;
const Customers = () => <div className="content">Customers Page</div>;
const Orders = () => <div className="content">Orders Page</div>;

// Composant pour vérifier l'authentification
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" />;
  }

  if (userRole !== 'ADMIN') {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <div className="app">
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="page-content">
                    <Routes>
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/add" element={<AddProduct />} />
                      <Route path="/employees" element={<Employees />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/" element={<Products />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
