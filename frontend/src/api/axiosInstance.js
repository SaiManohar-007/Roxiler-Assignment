import axios from 'axios';

const API = axios.create({
  baseURL: 'https://roxiler-assignment-dr1u.onrender.com',
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
