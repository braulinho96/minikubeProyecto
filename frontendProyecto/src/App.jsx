import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import LoanSimulation from './components/LoanSimulation';
import LoanSolicitude from './components/LoanSolicitude';
import LoanEvaluation from './components/LoanEvaluation';
import LoanSolicitudeFollowUp from './components/LoanSolicitudeFollowUp';
import LoanTotalCost from './components/LoanTotalCost';
import NotFound from './components/NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {isAuthenticated && user && (
          <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} user={user} />
        )}

        <div style={{ marginLeft: isAuthenticated ? '200px' : '0', padding: '20px', flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/home"
              element={isAuthenticated ? <Home user={user} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/loan-simulation"
              element={isAuthenticated ? <LoanSimulation /> : <Navigate to="/" replace />}
            />
            <Route
              path="/loan-solicitude"
              element={isAuthenticated ? <LoanSolicitude user={user} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/loan-evaluation"
              element={
                isAuthenticated && Number(user?.id_rol) === 1 ? <LoanEvaluation /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/loan-solicitude-follow-up"
              element={isAuthenticated ? <LoanSolicitudeFollowUp user={user} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/loan-total-cost"
              element={isAuthenticated ? <LoanTotalCost /> : <Navigate to="/" replace />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
