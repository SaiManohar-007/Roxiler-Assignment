// components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px', 
      backgroundColor: '#222', 
      color: 'white' 
    }}>
      <h1 style={{ margin: 0 }}>Roxiler App</h1>
      <nav>
        {!user && (
          <>
            <Link to="/" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/signup" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/dashboard" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/stores" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Stores</Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin-stats" style={{ margin: '0 15px', color: 'white', textDecoration: 'none' }}>Admin Stats</Link>
            )}
            <button 
              onClick={handleLogout} 
              style={{ marginLeft: '15px', padding: '5px 10px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
