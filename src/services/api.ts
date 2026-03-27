import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

// "Interceptor": Antes de qualquer requisição sair do React para o NestJS, ele faz isso:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@BioSchedule:token');
  
  if (token) {
    // Coloca o crachá JWT no formato "Bearer token..."
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});