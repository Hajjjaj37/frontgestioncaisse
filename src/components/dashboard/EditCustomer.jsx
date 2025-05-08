import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Customers.css';

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    customerCardNumber: '',
    tax: null
  });
  const [taxes, setTaxes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch customer data
        const customerResponse = await fetch(`http://localhost:9090/api/customers/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!customerResponse.ok) {
          throw new Error('Erreur lors du chargement des données du client');
        }
        const customerData = await customerResponse.json();
        setFormData({
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone || '',
          address: customerData.address || '',
          customerCardNumber: customerData.customerCardNumber || '',
          tax: customerData.tax
        });

        // Fetch taxes
        const taxesResponse = await fetch('http://localhost:9090/api/taxes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!taxesResponse.ok) {
          throw new Error('Erreur lors du chargement des taxes');
        }
        const taxesData = await taxesResponse.json();
        setTaxes(taxesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tax') {
      const selectedTax = taxes.find(tax => tax.id === parseInt(value));
      setFormData(prevState => ({
        ...prevState,
        tax: selectedTax
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    try {
      // Préparer les données dans le format attendu par l'API
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        customerCardNumber: formData.customerCardNumber,
        tax: formData.tax
      };

      const response = await fetch(`http://localhost:9090/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification du client');
      }

      navigate('/dashboard/customers');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="customers-container" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="customers-container" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Modifier le client</h1>

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

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Prénom</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nom</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Numéro de carte client</label>
          <input
            type="text"
            name="customerCardNumber"
            value={formData.customerCardNumber}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Taxe</label>
          <select
            name="tax"
            value={formData.tax?.id || ''}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="">Sélectionner une taxe</option>
            {taxes.map(tax => (
              <option key={tax.id} value={tax.id}>
                {tax.name} ({tax.rate}%)
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Adresse</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              minHeight: '100px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Modification en cours...' : 'Enregistrer les modifications'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/customers')}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer; 