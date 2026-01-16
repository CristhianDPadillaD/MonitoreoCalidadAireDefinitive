import React from 'react';

export default function GoogleLogin() {
  const backend = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleLogin = () => {
    window.location.href = `${backend}/api/auth/google`;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
      <button onClick={handleLogin}>Iniciar sesión con Google</button>
    </div>
  );
}
