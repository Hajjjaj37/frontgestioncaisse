import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Products from './components/dashboard/Products';
import Category from './components/dashboard/Category';
import Tax from './components/dashboard/Tax';
import Employees from './components/dashboard/Employees';
import Tracking from './components/dashboard/Tracking';
import Pause from './components/dashboard/Pause';
import Vacation from './components/dashboard/Vacation';
import Customers from './components/dashboard/Customers';
import Orders from './components/dashboard/Orders';
import AddProduct from './components/dashboard/AddProduct';
import EditProduct from './components/dashboard/EditProduct';
import AddCategory from './components/dashboard/AddCategory';
import EditCategory from './components/dashboard/EditCategory';
import AddTax from './components/dashboard/AddTax';
import EditTax from './components/dashboard/EditTax';
import AddEmployee from './components/dashboard/AddEmployee';
import EditEmployee from './components/dashboard/EditEmployee';
import AddTracking from './components/dashboard/AddTracking';
import EditTracking from './components/dashboard/EditTracking';
import AddPause from './components/dashboard/AddPause';
import EditPause from './components/dashboard/EditPause';
import AddVacation from './components/dashboard/AddVacation';
import EditVacation from './components/dashboard/EditVacation';
import AddCustomer from './components/dashboard/AddCustomer';
import EditCustomer from './components/dashboard/EditCustomer';
import AddOrder from './components/dashboard/AddOrder';
import EditOrder from './components/dashboard/EditOrder';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Products />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="category" element={<Category />} />
          <Route path="category/add" element={<AddCategory />} />
          <Route path="category/edit/:id" element={<EditCategory />} />
          <Route path="tax" element={<Tax />} />
          <Route path="tax/add" element={<AddTax />} />
          <Route path="tax/edit/:id" element={<EditTax />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="tracking/add" element={<AddTracking />} />
          <Route path="tracking/edit/:id" element={<EditTracking />} />
          <Route path="pause" element={<Pause />} />
          <Route path="pause/add" element={<AddPause />} />
          <Route path="pause/edit/:id" element={<EditPause />} />
          <Route path="vacation" element={<Vacation />} />
          <Route path="vacation/add" element={<AddVacation />} />
          <Route path="vacation/edit/:id" element={<EditVacation />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/edit/:id" element={<EditCustomer />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/add" element={<AddOrder />} />
          <Route path="orders/edit/:id" element={<EditOrder />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App; 