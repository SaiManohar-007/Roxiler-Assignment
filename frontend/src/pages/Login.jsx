import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '15px' };
  const buttonStyle = { padding: '10px 20px', cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>

      {message && (
        <p style={{ marginTop: '20px', color: message.toLowerCase().includes('failed') ? 'red' : 'green' }}>
          {message}
        </p>
      )}

      <p style={{ marginTop: '20px' }}>
        Don’t have an account?{' '}
        <Link to="/signup" style={{ color: 'blue', textDecoration: 'underline' }}>
          Sign up here
        </Link>
      </p>
    </div>
  );
}
