import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user.service';

const Register = () => {
  const [rut, setRut] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const formatRut = (value) => {
    const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (cleaned.length <= 8) return cleaned;
    const rutPart = cleaned.slice(0, -1); 
    const dv = cleaned.slice(-1);
    const formattedRut = rutPart + '-' + dv;  
    return formattedRut;
  };


  const handleRutChange = (e) => {
    const inputRut = e.target.value;
    const formattedInput = formatRut(inputRut);
    setRut(formattedInput); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const user = {
      rut, 
      name,
      password,
      solicitude_state: true,
      id_rol: 2,
    };

    try {
        await userService.create(user);
        setSuccess('User registered successfully.');
        setTimeout(() => navigate('/'), 200);
    }catch (err) {
        setError('The RUT is already registered.');
        console.error('Error:', err);
    }
  };

  return (
    <div>
      <h2>User Registration, please enter your information:</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="RUT - e.g., 12345678-9"
          value={rut}
          onChange={handleRutChange} 
          maxLength={10}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <button onClick={() => navigate('/')}>Log in</button>
      </p>
    </div>
  );
};

export default Register;
