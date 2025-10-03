import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/stores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRatingChange = (storeId, value) => {
    setRatings({ ...ratings, [storeId]: value });
  };

  const submitRating = async (storeId) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/ratings/${storeId}`,
        { rating: ratings[storeId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Rating submitted for store: ${storeId}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting rating');
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto' }}>
      <h2>Stores</h2>
      {message && <p>{message}</p>}
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Your Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store._id}>
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={ratings[store._id] || ''}
                  onChange={e => handleRatingChange(store._id, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => submitRating(store._id)}>Submit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
