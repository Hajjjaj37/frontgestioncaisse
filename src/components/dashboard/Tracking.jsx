import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  background: '#222b3a',
  borderRadius: '10px',
  overflow: 'hidden',
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

const Tracking = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch('http://localhost:9090/api/employees/with-schedules', {
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
    employee.schedules.some(schedule => 
      schedule.notes?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:9090/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Mettre à jour la liste des employés
      setEmployees(employees.map(emp => ({
        ...emp,
        schedules: emp.schedules.filter(s => s.id !== scheduleId)
      })));
    } catch (err) {
      setError(err.message);
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
        Home / Tracking
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Suivi des horaires
      </div>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Rechercher par nom d'employé ou notes"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2e3a4d', background: '#222b3a', color: '#f5f6fa' }}
        />
        <button style={{ background: '#1abc9c', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Rechercher</button>
        <button
          style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard/tracking/add')}
        >
          + Ajouter un horaire
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>EMPLOYÉ</th>
            <th style={thStyle}>HORAIRES</th>
            <th style={thStyle}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td style={tdStyle} colSpan={3} align="center">Chargement...</td></tr>
          ) : error ? (
            <tr><td style={tdStyle} colSpan={3} align="center">{error}</td></tr>
          ) : filteredEmployees.length === 0 ? (
            <tr><td style={tdStyle} colSpan={3} align="center">Aucun employé à afficher.</td></tr>
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
                  {employee.schedules.length === 0 ? (
                    <div style={{ color: '#95a5a6' }}>Aucun horaire</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {employee.schedules.map(schedule => (
                        <div key={schedule.id} style={{ 
                          padding: '12px',
                          borderLeft: '4px solid #3498db',
                          background: '#2c3e50'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#3498db', fontWeight: 'bold' }}>
                              {formatDate(schedule.workDate)}
                            </span>
                            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                          </div>
                          {schedule.notes && (
                            <div style={{ color: '#95a5a6', fontSize: '0.9rem' }}>
                              {schedule.notes}
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
                      onClick={() => navigate(`/dashboard/tracking/add/${employee.id}`)}
                    >
                      + Nouvel horaire
                    </button>
                    {employee.schedules.map(schedule => (
                      <div key={schedule.id} style={{ display: 'flex', gap: '8px' }}>
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
                          onClick={() => navigate(`/dashboard/tracking/edit/${schedule.id}`)}
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
                          onClick={() => handleDelete(schedule.id)}
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

export default Tracking; 