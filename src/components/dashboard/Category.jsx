import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch('http://localhost:9090/api/categories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setCategories([]);
        setError('Erreur lors du chargement des catégories');
        setLoading(false);
      });
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:9090/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la catégorie');
      }

      setSuccess('Catégorie supprimée avec succès !');
      // Mettre à jour la liste des catégories
      setCategories(categories.filter(cat => cat.id !== categoryId));
      
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
        Home / Category
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Categories
      </div>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search category"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2e3a4d', background: '#222b3a', color: '#f5f6fa' }}
        />
        <button style={{ background: '#1abc9c', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
        <button
          style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard/category/add')}
        >
          + Add New Category
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>NAME</th>
            <th style={thStyle}>DESCRIPTION</th>
            <th style={thStyle}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td style={tdStyle} colSpan={3} align="center">Chargement...</td></tr>
          ) : error ? (
            <tr><td style={tdStyle} colSpan={3} align="center">{error}</td></tr>
          ) : filteredCategories.length === 0 ? (
            <tr><td style={tdStyle} colSpan={3} align="center">No categories to display.</td></tr>
          ) : (
            filteredCategories.map(cat => (
              <tr key={cat.id}>
                <td style={tdStyle}>{cat.name}</td>
                <td style={tdStyle}>{cat.description}</td>
                <td style={tdStyle}>
                  <button
                    style={{ marginRight: 8, background: '#f39c12', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => navigate(`/dashboard/category/edit/${cat.id}`)}
                  >
                    Modification
                  </button>
                  <button 
                    style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => handleDelete(cat.id)}
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

export default Category; 