import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    // Redirect to home or desired page
    navigate('/');
  }, [navigate]);

  return <div>Autenticando...</div>;
}
