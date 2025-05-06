import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductImage from './ProductImage';

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  background: '#222b3a',
  borderRadius: '10px',
  overflow: 'hidden',
  color: '#f5f6fa',
  marginTop: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
};

const thStyle = {
  padding: '16px',
  background: '#2e3a4d',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1.05rem',
  borderBottom: '1px solid #31405a',
};

const tdStyle = {
  padding: '14px',
  textAlign: 'left',
  borderBottom: '1px solid #31405a',
  color: '#f5f6fa',
};

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch('http://localhost:9090/api/products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setError('Erreur lors du chargement des produits');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#222b3a' }}>
        Home / Products
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Products
      </div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input type="text" placeholder="Search product" style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2e3a4d', background: '#222b3a', color: '#f5f6fa' }} />
        <button style={{ background: '#1abc9c', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
        <button style={{ background: '#31405a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Advanced filter</button>
        <button
          style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard/products/add')}
        >
          + Add Product
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>PRODUCT</th>
            <th style={thStyle}>IMAGE</th>
            <th style={thStyle}>BAR CODE</th>
            <th style={thStyle}>PRICE</th>
            <th style={thStyle}>QUANTITY</th>
            <th style={thStyle}>STOCK</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td style={tdStyle} colSpan={6} align="center">Chargement...</td></tr>
          ) : error ? (
            <tr><td style={tdStyle} colSpan={6} align="center">{error}</td></tr>
          ) : products.length === 0 ? (
            <tr><td style={tdStyle} colSpan={6} align="center">No products to display.</td></tr>
          ) : (
            products.map(product => (
              <tr key={product.id}>
                <td style={tdStyle}>{product.name}</td>
                <td style={tdStyle}>
                  {product.id ? (
                    <ProductImage productId={product.id} alt={product.name} />
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td style={tdStyle}>{product.barcode || product.codeBarre || '-'}</td>
                <td style={tdStyle}>{product.price}</td>
                <td style={tdStyle}>{product.quantity || product.stock}</td>
                <td style={tdStyle}>{product.stock}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products; 