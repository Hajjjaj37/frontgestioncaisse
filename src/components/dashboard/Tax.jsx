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

const Tax = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch('http://localhost:9090/api/taxes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTaxes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setTaxes([]);
        setError('Erreur lors du chargement des taxes');
        setLoading(false);
      });
  }, []);

  const filteredTaxes = taxes.filter(tax =>
    tax.name.toLowerCase().includes(search.toLowerCase()) ||
    (tax.description && tax.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (taxId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette taxe ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:9090/api/taxes/${taxId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la taxe');
      }

      setSuccess('Taxe supprimée avec succès !');
      // Mettre à jour la liste des taxes
      setTaxes(taxes.filter(tax => tax.id !== taxId));
      
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
        Home / Tax
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Taxes
      </div>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search tax"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2e3a4d', background: '#222b3a', color: '#f5f6fa' }}
        />
        <button style={{ background: '#1abc9c', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
        <button
          style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard/tax/add')}
        >
          + Add New Tax
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>NAME</th>
            <th style={thStyle}>DESCRIPTION</th>
            <th style={thStyle}>RATE (%)</th>
            <th style={thStyle}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td style={tdStyle} colSpan={4} align="center">Chargement...</td></tr>
          ) : error ? (
            <tr><td style={tdStyle} colSpan={4} align="center">{error}</td></tr>
          ) : filteredTaxes.length === 0 ? (
            <tr><td style={tdStyle} colSpan={4} align="center">No taxes to display.</td></tr>
          ) : (
            filteredTaxes.map(tax => (
              <tr key={tax.id}>
                <td style={tdStyle}>{tax.name}</td>
                <td style={tdStyle}>{tax.description}</td>
                <td style={tdStyle}>{tax.rate}%</td>
                <td style={tdStyle}>
                  <button
                    style={{ marginRight: 8, background: '#f39c12', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => navigate(`/dashboard/tax/edit/${tax.id}`)}
                  >
                    Modification
                  </button>
                  <button 
                    style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => handleDelete(tax.id)}
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

export default Tax; 