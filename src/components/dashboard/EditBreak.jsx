import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditBreak = () => {
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { breakId } = useParams();

  const breakTypes = [
    'PAUSE_PERSONNELLE',
    'PAUSE_DEJEUNER',
    'PAUSE_CAFE',
    'PAUSE_SANTE'
  ];

  useEffect(() => {
    const fetchBreak = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:9090/api/employees/with-breaks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des pauses');
        }

        const employees = await response.json();
        const breakData = employees
          .flatMap(employee => employee.breaks)
          .find(breakItem => breakItem.id === parseInt(breakId));

        if (!breakData) {
          throw new Error('Pause non trouvée');
        }

        setType(breakData.type || '');
        setStatus(breakData.status || 'EN_COURS');
        setStartTime(breakData.startTime ? new Date(breakData.startTime).toISOString().slice(0, 16) : '');
        setEndTime(breakData.endTime ? new Date(breakData.endTime).toISOString().slice(0, 16) : '');
        setDurationMinutes(breakData.durationMinutes || '');
        setComment(breakData.comment || '');
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement de la pause');
        setLoading(false);
      }
    };

    if (breakId) {
      fetchBreak();
    } else {
      setError('ID de pause non trouvé');
      setLoading(false);
    }
  }, [breakId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !startTime) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:9090/api/breaks/${breakId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: parseInt(breakId),
          type,
          status,
          startTime,
          endTime: endTime || null,
          durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
          comment: comment || null
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de la pause');
      }

      setSuccess('Pause modifiée avec succès !');
      setTimeout(() => {
        navigate('/dashboard/pause');
      }, 2000);
    } catch (err) {
      setError(err.message);
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
        Home / Pause / Modifier
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#222b3a' }}>
        Modifier la pause
      </div>

      {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: '#1abc9c', marginBottom: 12 }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#222b3a', fontWeight: 'bold' }}>
            Type de pause *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            <option value="">Sélectionner un type</option>
            {breakTypes.map((breakType) => (
              <option key={breakType} value={breakType}>
                {breakType.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#222b3a', fontWeight: 'bold' }}>
            Statut
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            <option value="EN_COURS">En cours</option>
            <option value="TERMINEE">Terminée</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#222b3a', fontWeight: 'bold' }}>
            Heure de début *
          </label>
          <input
            type="datetime-local"
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
            Heure de fin
          </label>
          <input
            type="datetime-local"
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
            Durée (minutes)
          </label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #2e3a4d',
              background: '#222b3a',
              color: '#f5f6fa',
              fontSize: '1rem'
            }}
            placeholder="Durée en minutes"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#222b3a', fontWeight: 'bold' }}>
            Commentaire
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
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
            placeholder="Ajouter un commentaire..."
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            style={{
              background: '#1abc9c',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Modifier la pause
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/pause')}
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

export default EditBreak; 