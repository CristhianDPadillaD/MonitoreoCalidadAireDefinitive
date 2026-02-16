import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/navBar.css";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogin = () => {
    // Redirigir a la API de Google OAuth 
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleLogout = () => {
    logout();
    setMenuAbierto(false);
    // Opcional: Redirigir al inicio después de cerrar sesión
    window.location.href = "/";
  };

  // Enlaces básicos para invitados (no autenticados)
  const enlacesInvitado = (
    <>
      <Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link>
      <Link to="/variableSelect" onClick={() => setMenuAbierto(false)}>Contaminantes</Link>
    </>
  );

  // Enlaces completos para investigadores
  const enlacesInvestigador = (
    <>
      <Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link>
      <Link to="/variableSelect" onClick={() => setMenuAbierto(false)}>Contaminantes</Link>
      <Link to="/monthlyCard" onClick={() => setMenuAbierto(false)}>Niveles mensuales</Link>
      <Link to="/dataDownload" onClick={() => setMenuAbierto(false)}>Descargar datos</Link>
      <Link to="/generarReporte" onClick={() => setMenuAbierto(false)}>Generar reporte</Link>
      <Link to="/compararDatos" onClick={() => setMenuAbierto(false)}>Comparar datos</Link>
    </>
  );

  return (
    <nav className="navBarContainer">
      <div className="navBarLogoTitulo">
        <img
          src="https://umariana.edu.co/images2022/portada/Logo-UniversidadMariana2022.png"
          alt="Logo Universidad Mariana"
          className="navBarLogo"
        />
        <h1 className="navBarTitulo">AQuMaS</h1>
      </div>

      {/* Botón hamburguesa */}
      <button
        className="menuToggle"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>

      <div className={`navBarLinks ${menuAbierto ? "active" : ""}`}>
        {/* Mostrar enlaces según el rol del usuario */}
        {isAuthenticated() && (user?.role === 'investigador' || user?.role === 'investigator')
          ? enlacesInvestigador
          : enlacesInvitado
        }

        {/* Botón de inicio/cierre de sesión */}
        {isAuthenticated() ? (
          <div className="userInfo">
            {user?.name && <span className="userName">Hola, {user.name}</span>}
            <button
              className="CerrarSesionButton"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button
            className="IniciarSesionButton"
            onClick={handleLogin}
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
