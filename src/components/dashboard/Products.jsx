import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductImage from './ProductImage';
import BarcodeImage from './BarcodeImage';

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
  const [success, setSuccess] = useState('');

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

  const handleDelete = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:9090/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du produit');
      }

      setSuccess('Produit supprimé avec succès !');
      // Mettre à jour la liste des produits
      setProducts(products.filter(product => product.id !== productId));
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message);
      // Effacer le message d'erreur après 3 secondes
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#222b3a' }}>
        Home / Products
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Products
      </div>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}
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
            <th style={thStyle}>ACTIONS</th>
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
                <td style={tdStyle}>
                  {product.stock > 1 ? (
                    <span style={{ color: '#1abc9c', fontWeight: 'bold' }}>In stock</span>
                  ) : (
                    <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Out stock</span>
                  )}
                </td>
                <td style={tdStyle}>
                  <button
                    style={{ marginRight: 8, background: '#31405a', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => navigate(`/dashboard/products/detail/${product.id}`)}
                  >
                    Detail
                  </button>
                  <button
                    style={{ marginRight: 8, background: '#f39c12', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}
                  >
                    Modification
                  </button>
                  <button 
                    style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => handleDelete(product.id)}
                  >
                    Suppression
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products; 