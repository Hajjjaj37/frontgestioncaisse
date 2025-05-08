import React, { useState, useEffect } from 'react';
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

const EditSuppliers = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:9090/api/suppliers/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Erreur lors du chargement du fournisseur");
        }
        const data = await response.json();
        setForm({
          name: data.name || '',
          companyName: data.companyName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          taxNumber: data.taxNumber || '',
          bankAccount: data.bankAccount || '',
          paymentTerms: data.paymentTerms || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

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
      const response = await fetch(`http://localhost:9090/api/suppliers/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la modification du fournisseur");
      }
      setSuccess('Fournisseur modifié avec succès !');
      setTimeout(() => {
        navigate('/dashboard/suppliers');
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div style={formStyle}>Chargement...</div>;
  }

  return (
    <div style={formStyle}>
      <h2 style={{ marginBottom: 24 }}>Modifier le fournisseur</h2>
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
        <button type="submit" style={buttonStyle}>Modifier</button>
      </form>
    </div>
  );
};

export default EditSuppliers; 