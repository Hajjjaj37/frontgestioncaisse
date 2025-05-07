import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const formStyle = {
  maxWidth: 500,
  margin: '40px auto',
  background: '#222b3a',
  padding: 32,
  borderRadius: 12,
  color: '#f5f6fa',
};
const labelStyle = { display: 'block', marginBottom: 6, fontWeight: 'bold' };
const inputStyle = {
  width: '100%',
  padding: 8,
  borderRadius: 6,
  border: '1px solid #31405a',
  background: '#2e3a4d',
  color: '#fff',
  marginBottom: 16,
};
const buttonStyle = {
  background: '#1abc9c',
  color: '#fff',
  border: 'none',
  padding: '12px 32px',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  width: '100%',
  marginTop: 16,
};

const EditProduct = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    isVisible: false,
    categoryId: '',
    taxId: '',
    supplierId: '',
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Charger les listes
    fetch('http://localhost:9090/api/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
    fetch('http://localhost:9090/api/taxes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTaxes(Array.isArray(data) ? data : []))
      .catch(() => setTaxes([]));
    fetch('http://localhost:9090/api/suppliers', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSuppliers(Array.isArray(data) ? data : []))
      .catch(() => setSuppliers([]));
    // Charger le produit à modifier
    fetch(`http://localhost:9090/api/products/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name || '',
          description: data.description || '',
          price: data.price || '',
          stock: data.stock || '',
          isVisible: data.isVisible || false,
          categoryId: data.categoryId ? String(data.categoryId) : '',
          taxId: data.taxId ? String(data.taxId) : '',
          supplierId: data.supplierId ? String(data.supplierId) : '',
          image: null,
        });
      })
      .catch(() => setError('Erreur lors du chargement du produit'));
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    setError('');
    setSuccess('');
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      const response = await fetch(`http://localhost:9090/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la modification du produit");
      }
      setSuccess('Produit modifié avec succès !');
      setTimeout(() => {
        navigate('/dashboard/products');
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={formStyle}>
      <h2 style={{ marginBottom: 24 }}>Modifier le produit</h2>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label style={labelStyle}>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: 60 }} />
        <label style={labelStyle}>Price</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>Stock</label>
        <input name="stock" type="number" value={form.stock} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>
          <input name="isVisible" type="checkbox" checked={form.isVisible} onChange={handleChange} />
          {' '}Is Visible
        </label>
        <label style={labelStyle}>Category</label>
        <select name="categoryId" value={form.categoryId} onChange={handleChange} required style={inputStyle}>
          <option value="">Select category</option>
          {Array.isArray(categories) && categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <label style={labelStyle}>Tax</label>
        <select name="taxId" value={form.taxId} onChange={handleChange} required style={inputStyle}>
          <option value="">Select tax</option>
          {Array.isArray(taxes) && taxes.map(tax => (
            <option key={tax.id} value={tax.id}>{tax.name}</option>
          ))}
        </select>
        <label style={labelStyle}>Supplier</label>
        <select name="supplierId" value={form.supplierId} onChange={handleChange} required style={inputStyle}>
          <option value="">Select supplier</option>
          {Array.isArray(suppliers) && suppliers.map(sup => (
            <option key={sup.id} value={sup.id}>{sup.name}</option>
          ))}
        </select>
        <label style={labelStyle}>Image</label>
        <input name="image" type="file" accept="image/*" onChange={handleChange} style={inputStyle} />
        <button type="submit" style={buttonStyle}>Modifier</button>
      </form>
    </div>
  );
};

export default EditProduct; 