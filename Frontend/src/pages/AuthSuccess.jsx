import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      login(token);
      // Redirigir a la página de inicio después de autenticar
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      // Si no hay token, redirigir al inicio
      navigate('/');
    }
  }, [navigate, login]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh',
      fontSize: '1.2rem'
    }}>
      Autenticando...
    </div>
  );
}
