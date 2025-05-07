import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const formStyle = {
  maxWidth: 400,
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

const AddTax = () => {
  const [form, setForm] = useState({ name: '', rate: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setError('');
    setSuccess('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:9090/api/taxes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          rate: parseFloat(form.rate),
          description: form.description
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de l'ajout de la taxe");
      }
      setSuccess('Taxe ajoutée avec succès !');
      setTimeout(() => {
        navigate('/dashboard/tax');
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={formStyle}>
      <h2 style={{ marginBottom: 24 }}>Add Tax</h2>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>Rate (%)</label>
        <input name="rate" type="number" step="0.01" value={form.rate} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: 60 }} />
        <button type="submit" style={buttonStyle}>Add Tax</button>
      </form>
    </div>
  );
};

export default AddTax; 