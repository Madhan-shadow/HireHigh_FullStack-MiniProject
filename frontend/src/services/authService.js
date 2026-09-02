import api from './api';

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  // Handle both a real axios response ({ data: ... }) and a mock/test
  // setup that already resolves with the unwrapped payload directly.
  return response?.data ?? response;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response?.data ?? response;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  return Promise.resolve();
};

const authService = { login, register, logout };

export default authService;