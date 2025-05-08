import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const AddFournisseurs = () => {
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    taxNumber: '',
    bankAccount: '',
    paymentTerms: '',
  });
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
      const response = await fetch('http://localhost:9090/api/suppliers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de l'ajout du fournisseur");
      }
      setSuccess('Fournisseur ajouté avec succès !');
      setTimeout(() => {
        navigate('/dashboard/suppliers');
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={formStyle}>
      <h2 style={{ marginBottom: 24 }}>Ajouter un fournisseur</h2>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Nom</label>
        <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>Entreprise</label>
        <input name="companyName" value={form.companyName} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>Téléphone</label>
        <input name="phone" value={form.phone} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>Adresse</label>
        <textarea name="address" value={form.address} onChange={handleChange} required style={{ ...inputStyle, minHeight: 60 }} />
        <label style={labelStyle}>Numéro de TVA</label>
        <input name="taxNumber" value={form.taxNumber} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>Compte bancaire</label>
        <input name="bankAccount" value={form.bankAccount} onChange={handleChange} required style={inputStyle} />
        <label style={labelStyle}>Modalités de paiement</label>
        <input name="paymentTerms" value={form.paymentTerms} onChange={handleChange} required style={inputStyle} />
        <button type="submit" style={buttonStyle}>Ajouter</button>
      </form>
    </div>
  );
};

export default AddFournisseurs; 