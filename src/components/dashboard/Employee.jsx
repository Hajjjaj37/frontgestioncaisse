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

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch('http://localhost:9090/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const employees = Array.isArray(data) ? data.filter(user => user.role === 'EMPLOYEE') : [];
        setEmployees(employees);
        setLoading(false);
      })
      .catch(() => {
        setEmployees([]);
        setError('Erreur lors du chargement des employés');
        setLoading(false);
      });
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    employee.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    employee.email?.toLowerCase().includes(search.toLowerCase()) ||
    employee.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:9090/api/users/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'employé');
      }

      setSuccess('Employé supprimé avec succès !');
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      
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

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#222b3a' }}>
        Home / Employee
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Employees
      </div>
      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search employee"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #2e3a4d', background: '#222b3a', color: '#f5f6fa' }}
        />
        <button style={{ background: '#1abc9c', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
        <button
          style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard/employees/add')}
        >
          + Add New Employee
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>FIRST NAME</th>
            <th style={thStyle}>LAST NAME</th>
            <th style={thStyle}>EMAIL</th>
            <th style={thStyle}>USERNAME</th>
            <th style={thStyle}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td style={tdStyle} colSpan={5} align="center">Chargement...</td></tr>
          ) : error ? (
            <tr><td style={tdStyle} colSpan={5} align="center">{error}</td></tr>
          ) : filteredEmployees.length === 0 ? (
            <tr><td style={tdStyle} colSpan={5} align="center">No employees to display.</td></tr>
          ) : (
            filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td style={tdStyle}>{employee.firstName}</td>
                <td style={tdStyle}>{employee.lastName}</td>
                <td style={tdStyle}>{employee.email}</td>
                <td style={tdStyle}>{employee.username}</td>
                <td style={tdStyle}>
                  <button
                    style={{ marginRight: 8, background: '#f39c12', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => navigate(`/dashboard/employees/edit/${employee.id}`)}
                  >
                    Modification
                  </button>
                  <button 
                    style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => handleDelete(employee.id)}
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

export default Employee; 