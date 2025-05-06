import axios from 'axios';

const API_URL = 'http://localhost:9090/api/auth/authenticate';

export const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    const { token, role } = response.data;
    
    if (!token || !role) {
      throw new Error('Token ou rôle manquant dans la réponse');
    }
    
    // Stocker le token et le rôle dans le localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    
    console.log('Connexion réussie:', { token, role });
    return { token, role };
  } catch (error) {
    console.error('Erreur de connexion:', error);
    if (error.response) {
      // Erreur du serveur
      throw new Error(error.response.data.message || 'Erreur de connexion');
    } else if (error.request) {
      // Erreur de réseau
      throw new Error('Erreur de réseau. Veuillez vérifier votre connexion.');
    } else {
      // Erreur de configuration
      throw new Error('Erreur de configuration');
    }
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  console.log('Déconnexion réussie');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return !!token && !!role;
};

export const getRole = () => {
  return localStorage.getItem('role');
};

export const getToken = () => {
  return localStorage.getItem('token');
}; 