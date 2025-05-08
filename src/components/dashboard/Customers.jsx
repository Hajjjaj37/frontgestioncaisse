import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Non authentifié');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch('http://localhost:9090/api/customers', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur de chargement des données');
        return res.json();
      })
      .then(data => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setCustomers([]);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:9090/api/customers/${customerToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setCustomers(customers.filter(c => c.id !== customerToDelete.id));
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setCustomerToDelete(null);
  };

  return (
    <div className="customers-container" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Gestion des clients</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      <div className="customers-search" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Rechercher par nom, email ou téléphone"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button 
          onClick={() => navigate('/dashboard/customers/add')}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Nouveau client
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Chargement...</div>
      ) : filteredCustomers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Aucun client à afficher.</div>
      ) : (
        <table className="customers-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>CLIENT</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>EMAIL</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>TÉLÉPHONE</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>ADRESSE</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '10px'
                    }}>
                      {customer.firstName[0]}{customer.lastName[0]}
                    </div>
                    <div>
                      {`${customer.firstName} ${customer.lastName}`}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>{customer.email}</td>
                <td style={{ padding: '12px' }}>{customer.phone || 'Non renseigné'}</td>
                <td style={{ padding: '12px' }}>{customer.address || 'Non renseignée'}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => navigate(`/dashboard/customers/edit/${customer.id}`)}
                    style={{
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      marginRight: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteClick(customer)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && customerToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Confirmer la suppression</h3>
            <p style={{ marginBottom: '20px' }}>
              Êtes-vous sûr de vouloir supprimer le client <strong>{customerToDelete.firstName} {customerToDelete.lastName}</strong> ?
              Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={handleDeleteCancel}
                style={{
                  backgroundColor: '#9e9e9e',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers; 