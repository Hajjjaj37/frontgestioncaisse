import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Products from './components/dashboard/Products';
import Navbar from './components/Navbar';
import AddProduct from './components/dashboard/AddProduct';
import Category from './components/dashboard/Category';
import AddCategory from './components/dashboard/AddCategory';
import EditCategory from './components/dashboard/EditCategory';
import Tax from './components/dashboard/Tax';
import AddTax from './components/dashboard/AddTax';
import EditTax from './components/dashboard/EditTax';
import EditProduct from './components/dashboard/EditProduct';
import ProductDetail from './components/dashboard/ProductDetail';
import Employee from './components/dashboard/Employee';
import AddEmployee from './components/dashboard/AddEmployee';
import EditEmployee from './components/dashboard/EditEmployee';
import Pause from './components/dashboard/Pause';
import AddBreak from './components/dashboard/AddBreak';
import EditBreak from './components/dashboard/EditBreak';
import Vacation from './components/dashboard/Vacation';
import AddVacation from './components/dashboard/AddVacation';
import EditVacation from './components/dashboard/EditVacation';
import Tracking from './components/dashboard/Tracking';
import AddTracking from './components/dashboard/AddTracking';
import EditTracking from './components/dashboard/EditTracking';
import Customers from './components/dashboard/Customers';
import AddCustomer from './components/dashboard/AddCustomer';
import EditCustomer from './components/dashboard/EditCustomer';
import Suppliers from './components/dashboard/Suppliers';
import AddFournisseurs from './components/dashboard/AddFournisseurs';
import EditSuppliers from './components/dashboard/EditSuppliers';
import './App.css';

// Pages components
const Employees = () => <div className="content">Employees Page</div>;

const Orders = () => <div className="content">Orders Page</div>;

// Composant pour vérifier l'authentification
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:9090/api/customers/${customerToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Handle success
    } catch (error) {
      console.error('Error deleting customer:', error);
      // Handle error
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

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
                      <Route path="/employees" element={<Employee />} />
                      <Route path="/employees/add" element={<AddEmployee />} />
                      <Route path="/employees/edit/:id" element={<EditEmployee />} />
                      <Route path="/pause" element={<Pause />} />
                      <Route path="/pause/add/:employeeId" element={<AddBreak />} />
                      <Route path="/pause/edit/:breakId" element={<EditBreak />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/category" element={<Category />} />
                      <Route path="/category/add" element={<AddCategory />} />
                      <Route path="/category/edit/:id" element={<EditCategory />} />
                      <Route path="/tax" element={<Tax />} />
                      <Route path="/tax/add" element={<AddTax />} />
                      <Route path="/tax/edit/:id" element={<EditTax />} />
                      <Route path="/products/edit/:id" element={<EditProduct />} />
                      <Route path="/products/detail/:id" element={<ProductDetail />} />
                      <Route path="/vacation" element={<Vacation />} />
                      <Route path="/vacation/add" element={<AddVacation />} />
                      <Route path="/vacation/edit/:id" element={<EditVacation />} />
                      <Route path="/tracking" element={<Tracking />} />
                      <Route path="/tracking/add" element={<AddTracking />} />
                      <Route path="/tracking/add/:id" element={<AddTracking />} />
                      <Route path="/tracking/edit/:id" element={<EditTracking />} />
                      <Route path="/customers/add" element={<AddCustomer />} />
                      <Route path="/customers/edit/:id" element={<EditCustomer />} />
                      <Route path="/suppliers" element={<Suppliers />} />
                      <Route path="/suppliers/add" element={<AddFournisseurs />} />
                      <Route path="/suppliers/edit/:id" element={<EditSuppliers />} />
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
