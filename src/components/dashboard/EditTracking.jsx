import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditTracking = () => {
  const [employee, setEmployee] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Charger les détails de l'horaire
    fetch(`http://localhost:9090/api/schedules/employee/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Schedule not found');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const schedule = data[0];
          setEmployeeId(schedule.employeeId.toString());
          setWorkDate(schedule.workDate);
          setStartTime(schedule.startTime.substring(0, 5));
          setEndTime(schedule.endTime.substring(0, 5));
          setNotes(schedule.notes || '');

          // Charger les détails de l'employé
          return fetch(`http://localhost:9090/api/users/${schedule.employeeId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } else {
          throw new Error('Aucun horaire trouvé pour cet employé');
        }
      })
      .then(res => res.json())
      .then(employeeData => {
        setEmployee(employeeData);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !workDate || !startTime || !endTime) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:9090/api/schedules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          employeeId: parseInt(employeeId),
          workDate: workDate,
          startTime: `${startTime}:00`,
          endTime: `${endTime}:00`,
          notes: notes || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification de l\'horaire');
      }

      setSuccess('Horaire modifié avec succès !');
      setTimeout(() => {
        navigate('/dashboard/tracking');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#222b3a' }}>
        Home / Tracking / Modifier
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Modifier l'horaire
      </div>

      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#222b3a', fontWeight: 'bold' }}>
            Employé
          </label>
          <div
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #2e3a4d',
              background: '#222b3a',
              color: '#f5f6fa',
              fontSize: '1rem'
            }}
          >
            {employee ? `${employee.firstName} ${employee.lastName} (${employee.email})` : 'Chargement...'}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#222b3a', fontWeight: 'bold' }}>
            Date de travail *
          </label>
          <input
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #2e3a4d',
              background: '#222b3a',
              color: '#f5f6fa',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#222b3a', fontWeight: 'bold' }}>
            Heure de début *
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #2e3a4d',
              background: '#222b3a',
              color: '#f5f6fa',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#222b3a', fontWeight: 'bold' }}>
            Heure de fin *
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #2e3a4d',
              background: '#222b3a',
              color: '#f5f6fa',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#222b3a', fontWeight: 'bold' }}>
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #2e3a4d',
              background: '#222b3a',
              color: '#f5f6fa',
              fontSize: '1rem',
              minHeight: '100px',
              resize: 'vertical'
            }}
            placeholder="Ajouter des notes..."
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#1abc9c',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Modification en cours...' : 'Modifier l\'horaire'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/tracking')}
            style={{
              background: '#95a5a6',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTracking; 