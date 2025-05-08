import React, { useState, useEffect } from 'react';
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

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Fetch suppliers data
  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9090/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des fournisseurs');
      }

      const data = await response.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete supplier
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/api/suppliers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        let errorMsg = 'Erreur lors de la suppression du fournisseur';
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) errorMsg = errorData.message;
        } catch {}
        throw new Error(errorMsg);
      }

      setSuccess('Fournisseur supprimé avec succès !');
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter suppliers based on search term
  const getFilteredSuppliers = () => {
    return suppliers.filter(supplier =>
      supplier.name?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Load suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Render table header
  const renderTableHeader = () => (
    <thead>
      <tr>
        <th style={thStyle}>NOM</th>
        <th style={thStyle}>ENTREPRISE</th>
        <th style={thStyle}>EMAIL</th>
        <th style={thStyle}>TÉLÉPHONE</th>
        <th style={thStyle}>ADRESSE</th>
        <th style={thStyle}>ACTIONS</th>
      </tr>
    </thead>
  );

  // Render table body
  const renderTableBody = () => {
    const filteredSuppliers = getFilteredSuppliers();

    if (loading) {
      return (
        <tr>
          <td style={tdStyle} colSpan={6} align="center">
            Chargement...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td style={tdStyle} colSpan={6} align="center">
            {error}
          </td>
        </tr>
      );
    }

    if (filteredSuppliers.length === 0) {
      return (
        <tr>
          <td style={tdStyle} colSpan={6} align="center">
            Aucun fournisseur à afficher.
          </td>
        </tr>
      );
    }

    return filteredSuppliers.map(supplier => (
      <tr key={supplier.id}>
        <td style={tdStyle}>{supplier.name}</td>
        <td style={tdStyle}>{supplier.companyName}</td>
        <td style={tdStyle}>{supplier.email}</td>
        <td style={tdStyle}>{supplier.phone}</td>
        <td style={tdStyle}>{supplier.address}</td>
        <td style={{
          ...tdStyle,
          textAlign: 'center',
          verticalAlign: 'middle',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <button
              style={{
                background: '#f39c12',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '6px 16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'background 0.2s',
              }}
              onClick={() => navigate(`/dashboard/suppliers/edit/${supplier.id}`)}
            >
              Modification
            </button>
            <button 
              style={{
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '6px 16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'background 0.2s',
              }}
              onClick={() => handleDelete(supplier.id)}
            >
              Suppression
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#222b3a' }}>
        Home / Fournisseurs
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Fournisseurs
      </div>

      {/* Messages */}
      {error && (
        <div style={{ color: '#e74c3c', marginBottom: 12 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ color: '#1abc9c', marginBottom: 12 }}>
          {success}
        </div>
      )}

      {/* Search and Add */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Rechercher un fournisseur"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #2e3a4d',
            background: '#222b3a',
            color: '#f5f6fa'
          }}
        />
        <button
          style={{
            background: '#1abc9c',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Rechercher
        </button>
        <button
          style={{
            background: '#e67e22',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/dashboard/suppliers/add')}
        >
          + Ajouter un fournisseur
        </button>
      </div>

      {/* Table */}
      <table style={tableStyle}>
        {renderTableHeader()}
        <tbody>
          {renderTableBody()}
        </tbody>
      </table>
    </div>
  );
};

export default Suppliers; 