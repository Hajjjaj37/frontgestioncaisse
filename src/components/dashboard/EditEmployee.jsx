import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const formStyle = {
  background: '#222b3a',
  padding: '24px',
  borderRadius: '10px',
  color: '#f5f6fa',
  maxWidth: '600px',
  margin: '0 auto'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '16px',
  borderRadius: '6px',
  border: '1px solid #2e3a4d',
  background: '#1a1f2b',
  color: '#f5f6fa'
};

const buttonStyle = {
  background: '#1abc9c',
  color: '#fff',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  width: '100%'
};

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:9090/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données de l\'employé');
        }

        const data = await response.json();
        setFormData({
          username: data.username || '',
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          password: ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Préparer les données pour la modification
    const employeeData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      // Le mot de passe est optionnel, on ne l'inclut que s'il est modifié
      ...(formData.password && { password: formData.password })
    };

    try {
      const response = await fetch(`http://localhost:9090/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(employeeData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de l\'employé');
      }

      setSuccess('Employé modifié avec succès !');
      setTimeout(() => {
        navigate('/dashboard/employees');
      }, 2000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#222b3a' }}>
        Home / Employee / Edit
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Edit Employee
      </div>

      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={inputStyle}
            required
            disabled
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>New Password (Optional)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Leave empty to keep current password"
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default EditEmployee; 