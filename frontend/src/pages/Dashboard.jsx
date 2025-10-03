import React, { useState, useEffect } from 'react';
import API from '../api/axios'; // your axios instance that can include baseURL

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [dateOfSale, setDateOfSale] = useState('');
  const [sold, setSold] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error fetching transactions');
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await API.post(
        '/transactions',
        { title, description, price: Number(price), category, dateOfSale, sold },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Transaction added successfully!');
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setDateOfSale('');
      setSold(false);
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error adding transaction');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto' }}>
      <h2>Transactions Dashboard</h2>

      <form onSubmit={handleAddTransaction} style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
        <input type="date" value={dateOfSale} onChange={e => setDateOfSale(e.target.value)} required />
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          Sold:
          <input type="checkbox" checked={sold} onChange={e => setSold(e.target.checked)} />
        </label>
        <button type="submit">Add Transaction</button>
      </form>

      {message && <p style={{ color: message.toLowerCase().includes('error') ? 'red' : 'green' }}>{message}</p>}

      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No transactions found</td></tr>
          ) : (
            transactions.map(tx => (
              <tr key={tx._id}>
                <td>{tx.title}</td>
                <td>{tx.description}</td>
                <td>{tx.price}</td>
                <td>{tx.category}</td>
                <td>{new Date(tx.dateOfSale).toLocaleDateString()}</td>
                <td>{tx.sold ? 'Yes' : 'No'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
