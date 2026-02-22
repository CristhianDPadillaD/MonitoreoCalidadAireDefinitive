import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/googleLogin.css';

export default function GoogleLogin() {
  const backend = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleLogin = () => {
    window.location.href = `${backend}/api/auth/google`;
  };

  return (
    <div className="googleLoginPage">
      <div className="googleLoginCard">
        <h2 className="googleLoginTitle">Acceso para investigadores</h2>
        <p className="googleLoginText">
          Para ingresar al sistema debes iniciar sesión con un correo especial autorizado por el administrador.
        </p>
        <p className="googleLoginHint">
          Si tu cuenta no está habilitada, no podrás acceder a las funciones de investigador.
        </p>

        <button className="googleLoginButton" onClick={handleLogin}>
          Iniciar sesión con Google
        </button>

        <Link to="/" className="googleLoginBackLink">Volver al inicio</Link>
      </div>
    </div>
  );
}
