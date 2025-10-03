import React, { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const [message, setMessage] = useState('');
  const [averageRatings, setAverageRatings] = useState({});

  const token = localStorage.getItem('token');

  const fetchStores = async () => {
    try {
      const res = await API.get('/stores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);

      // fetch ratings for each store
      const ratingsData = {};
      for (const store of res.data) {
        const ratingRes = await API.get(`/ratings/average/${store._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        ratingsData[store._id] = ratingRes.data.average || 0;
      }
      setAverageRatings(ratingsData);

    } catch (err) {
      console.error(err);
    }
  };

  const handleRatingChange = (storeId, value) => {
    setRatings({ ...ratings, [storeId]: value });
  };

  const submitRating = async (storeId) => {
    try {
      await API.post(
        `/ratings/${storeId}`,
        { rating: Number(ratings[storeId]) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Rating submitted for store: ${storeId}`);
      fetchStores(); // refresh average ratings
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
            <th>Average Rating</th>
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
              <td>{averageRatings[store._id]?.toFixed(1) || 'N/A'}</td>
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
