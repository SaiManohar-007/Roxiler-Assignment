// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://roxiler-assignment-dr1u.onrender.com/api',
});

// Automatically attach token if it exists
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
