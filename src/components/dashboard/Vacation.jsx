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

const Vacation = () => {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch('http://localhost:9090/api/vacations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Format de données invalide');
        }
        setVacations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur:', err);
        setVacations([]);
        setError('Erreur lors du chargement des données');
        setLoading(false);
      });
  }, []);

  const filteredVacations = vacations.filter(vacation =>
    `${vacation.employee.firstName} ${vacation.employee.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    vacation.status?.toLowerCase().includes(search.toLowerCase()) ||
    vacation.comment?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (vacationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vacance ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:9090/api/vacations/${vacationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression de la vacance');
      }

      setSuccess('Vacance supprimée avec succès !');
      setVacations(vacations.filter(v => v.id !== vacationId));
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Erreur de suppression:', err);
      setError('Erreur lors de la suppression de la vacance');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#222b3a' }}>
        Home / Vacance
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Vacances
      </div>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Rechercher par nom d'employé, statut ou commentaire"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2e3a4d', background: '#222b3a', color: '#f5f6fa' }}
        />
        <button style={{ background: '#1abc9c', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Rechercher</button>
        <button
          style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard/vacation/add')}
        >
          + Ajouter une vacance
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>EMPLOYÉ</th>
            <th style={thStyle}>DATE DE DÉBUT</th>
            <th style={thStyle}>DATE DE FIN</th>
            <th style={thStyle}>DURÉE</th>
            <th style={thStyle}>STATUT</th>
            <th style={thStyle}>COMMENTAIRE</th>
            <th style={thStyle}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td style={tdStyle} colSpan={7} align="center">Chargement...</td></tr>
          ) : error ? (
            <tr><td style={tdStyle} colSpan={7} align="center">{error}</td></tr>
          ) : filteredVacations.length === 0 ? (
            <tr><td style={tdStyle} colSpan={7} align="center">Aucune vacance à afficher.</td></tr>
          ) : (
            filteredVacations.map(vacation => (
              <tr key={vacation.id}>
                <td style={tdStyle}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      background: '#3498db',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold'
                    }}>
                      {vacation.employee.firstName[0]}{vacation.employee.lastName[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{`${vacation.employee.firstName} ${vacation.employee.lastName}`}</div>
                      <div style={{ color: '#95a5a6', fontSize: '0.9rem' }}>{vacation.employee.email}</div>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>{formatDate(vacation.startDate)}</td>
                <td style={tdStyle}>{formatDate(vacation.endDate)}</td>
                <td style={tdStyle}>{vacation.duration} jours</td>
                <td style={tdStyle}>
                  <span style={{ 
                    color: vacation.status === 'APPROVED' ? '#2ecc71' : 
                           vacation.status === 'PENDING' ? '#f1c40f' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {vacation.status}
                  </span>
                </td>
                <td style={tdStyle}>{vacation.comment || '-'}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{ 
                        background: '#f39c12', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '6px 12px', 
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                      onClick={() => navigate(`/dashboard/vacation/edit/${vacation.id}`)}
                    >
                      Modifier
                    </button>
                    <button 
                      style={{ 
                        background: '#e74c3c', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '6px 12px', 
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                      onClick={() => handleDelete(vacation.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vacation;