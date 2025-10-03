import React, { useState, useEffect } from 'react';
import API from '../api/axios';

export default function AdminStats() {
  const [stats, setStats] = useState({});
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Error fetching stats');
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Admin Dashboard Stats</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <ul style={{ listStyle: 'none', padding: 0, fontSize: '18px' }}>
        <li>Total Users: {stats.totalUsers}</li>
        <li>Total Stores: {stats.totalStores}</li>
        <li>Total Ratings: {stats.totalRatings}</li>
        <li>Average Store Rating: {stats.averageRating}</li>
      </ul>
    </div>
  );
}
