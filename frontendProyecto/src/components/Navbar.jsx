import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, handleLogout, user }) => (
  <nav style={{
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    width: '200px',
    height: '100%',
    padding: '20px',
    background: '#f1f1f1',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
  }}>
    <Link to="/home" style={{ marginBottom: '10px' }}>Home</Link>
    <Link to="/loan-solicitude-follow-up" style={{ marginBottom: '10px' }}>My loans</Link>
    <Link to="/loan-simulation" style={{ marginBottom: '10px' }}>Loan Simulation</Link>
    <Link to="/loan-solicitude" style={{ marginBottom: '10px' }}>Loan Solicitude</Link>
    
    {user && Number(user.id_rol) == 1 && (
      <Link to="/loan-evaluation" style={{ marginBottom: '10px' }}>Loan Evaluation</Link>
    )}

    {isAuthenticated && (
      <button onClick={handleLogout} style={{ marginTop: 'auto' }}>
        Log out
      </button>
    )}
  </nav>
);

export default Navbar;
