import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBoxOpen, FaUser, FaUsers, FaTruck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState({
    products: false,
    employees: false,
  });

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Principal</h2>
      </div>
      <nav className="sidebar-nav">
        {/* Products menu */}
        <div className="sidebar-menu">
          <div className="sidebar-link" onClick={() => toggleMenu('products')}>
            <FaBoxOpen className="sidebar-icon" />
            <span>Products</span>
            {openMenu.products ? <FaChevronUp className="chevron" /> : <FaChevronDown className="chevron" />}
          </div>
          {openMenu.products && (
            <div className="sidebar-sublinks">
              <Link to="/dashboard/products" className={location.pathname === '/dashboard/products' ? 'sublink active' : 'sublink'}>Product</Link>
              <Link to="/dashboard/category" className={location.pathname === '/dashboard/category' ? 'sublink active' : 'sublink'}>Category</Link>
              <Link to="/dashboard/tax" className={location.pathname === '/dashboard/tax' ? 'sublink active' : 'sublink'}>TAX</Link>
              <Link to="/dashboard/suppliers" className={location.pathname === '/dashboard/suppliers' ? 'sublink active' : 'sublink'}>Fournisseurs</Link>
            </div>
          )}
        </div>
        {/* Employees menu */}
        <div className="sidebar-menu">
          <div className="sidebar-link" onClick={() => toggleMenu('employees')}>
            <FaUser className="sidebar-icon" />
            <span>Employees</span>
            {openMenu.employees ? <FaChevronUp className="chevron" /> : <FaChevronDown className="chevron" />}
          </div>
          {openMenu.employees && (
            <div className="sidebar-sublinks">
              <Link to="/dashboard/employees" className={location.pathname === '/dashboard/employees' ? 'sublink active' : 'sublink'}>Employee</Link>
              <Link to="/dashboard/tracking" className={location.pathname === '/dashboard/tracking' ? 'sublink active' : 'sublink'}>Tracking</Link>
              <Link to="/dashboard/pause" className={location.pathname === '/dashboard/pause' ? 'sublink active' : 'sublink'}>Pause</Link>
              <Link to="/dashboard/vacation" className={location.pathname === '/dashboard/vacation' ? 'sublink active' : 'sublink'}>Vacation</Link>
            </div>
          )}
        </div>
        {/* Customers */}
        <Link 
          to="/dashboard/customers" 
          className={`sidebar-link${location.pathname === '/dashboard/customers' ? ' active' : ''}`}
        >
          <FaUsers className="sidebar-icon" />
          <span>Customers</span>
        </Link>
        {/* Orders */}
        <Link to="/dashboard/orders" className={`sidebar-link${location.pathname === '/dashboard/orders' ? ' active' : ''}`}>
          <FaTruck className="sidebar-icon" />
          <span>Orders</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 