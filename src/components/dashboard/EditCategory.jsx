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

const labelStyle = { 
  display: 'block', 
  marginBottom: 6, 
  fontWeight: 'bold' 
};

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

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:9090/api/categories/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement de la catégorie');
        }

        const data = await response.json();
        setForm({
          name: data.name || '',
          description: data.description || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setError('');
    setSuccess('');
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la modification de la catégorie");
      }

      setSuccess('Catégorie modifiée avec succès !');
      setTimeout(() => {
        navigate('/dashboard/category');
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
      <h2 style={{ marginBottom: 24 }}>Modifier la catégorie</h2>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Nom</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
          placeholder="Entrez le nom de la catégorie"
        />
        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ ...inputStyle, minHeight: 60 }}
          placeholder="Entrez la description de la catégorie"
        />
        <button type="submit" style={buttonStyle}>
          Modifier
        </button>
      </form>
    </div>
  );
};

export default EditCategory; 