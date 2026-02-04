import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEXT_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Interceptador de resposta para mostrar mensagem de sucesso ou erro (exceto para GET)
// Se der erro 401, redireciona para o login
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
