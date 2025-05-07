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

const Pause = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch('http://localhost:9090/api/employees/with-breaks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Format de données invalide');
        }
        setEmployees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur:', err);
        setEmployees([]);
        setError('Erreur lors du chargement des données');
        setLoading(false);
      });
  }, []);

  const filteredEmployees = employees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    employee.breaks.some(breakItem => 
      breakItem.type?.toLowerCase().includes(search.toLowerCase()) ||
      breakItem.status?.toLowerCase().includes(search.toLowerCase()) ||
      breakItem.comment?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleDelete = async (breakId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette pause ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:9090/api/breaks/${breakId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la pause');
      }

      setSuccess('Pause supprimée avec succès !');
      // Mettre à jour la liste des employés après la suppression
      setEmployees(employees.map(employee => ({
        ...employee,
        breaks: employee.breaks.filter(b => b.id !== breakId)
      })));
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'En cours';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#222b3a' }}>
        Home / Pause
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Pauses
      </div>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search by employee name, type, status or comment"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2e3a4d', background: '#222b3a', color: '#f5f6fa' }}
        />
        <button style={{ background: '#1abc9c', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
        <button
          style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard/pause/add')}
        >
          + Add New Pause
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>EMPLOYEE</th>
            <th style={thStyle}>PAUSES</th>
            <th style={thStyle}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td style={tdStyle} colSpan={3} align="center">Chargement...</td></tr>
          ) : error ? (
            <tr><td style={tdStyle} colSpan={3} align="center">{error}</td></tr>
          ) : filteredEmployees.length === 0 ? (
            <tr><td style={tdStyle} colSpan={3} align="center">No employees to display.</td></tr>
          ) : (
            filteredEmployees.map(employee => (
              <tr key={employee.id}>
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
                      {employee.firstName[0]}{employee.lastName[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{`${employee.firstName} ${employee.lastName}`}</div>
                      <div style={{ color: '#95a5a6', fontSize: '0.9rem' }}>{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>
                  {employee.breaks.length === 0 ? (
                    <div style={{ color: '#95a5a6' }}>Aucune pause</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {employee.breaks.map(breakItem => (
                        <div key={breakItem.id} style={{ 
                          padding: '12px',
                          borderLeft: '4px solid #3498db',
                          background: '#2c3e50'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ 
                              color: breakItem.status === 'ACTIVE' ? '#2ecc71' : '#e74c3c',
                              fontWeight: 'bold'
                            }}>
                              {breakItem.status}
                            </span>
                            <span style={{ color: '#3498db', fontWeight: 'bold' }}>
                              {breakItem.type}
                            </span>
                          </div>
                          <div style={{ color: '#ecf0f1', marginBottom: '4px' }}>
                            {formatDate(breakItem.startTime)} - {formatDate(breakItem.endTime)}
                          </div>
                          {breakItem.comment && (
                            <div style={{ color: '#95a5a6', fontSize: '0.9rem' }}>
                              {breakItem.comment}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      style={{ 
                        background: '#3498db', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '8px 16px', 
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                      onClick={() => navigate(`/dashboard/pause/add/${employee.id}`)}
                    >
                      + Nouvelle pause
                    </button>
                    {employee.breaks.map(breakItem => (
                      <div key={breakItem.id} style={{ display: 'flex', gap: '8px' }}>
                        <button
                          style={{ 
                            flex: 1,
                            background: '#f39c12', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '6px', 
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                          onClick={() => navigate(`/dashboard/pause/edit/${breakItem.id}`)}
                        >
                          Modifier
                        </button>
                        <button 
                          style={{ 
                            flex: 1,
                            background: '#e74c3c', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '6px', 
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                          onClick={() => handleDelete(breakItem.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
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

export default Pause; 