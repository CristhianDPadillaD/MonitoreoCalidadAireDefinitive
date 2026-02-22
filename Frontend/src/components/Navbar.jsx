import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/navBar.css";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalLoginAbierto, setModalLoginAbierto] = useState(false);
  const [modalLogoutAbierto, setModalLogoutAbierto] = useState(false);
  const [mensajeModal, setMensajeModal] = useState("");
  const [tituloModal, setTituloModal] = useState("Acceso para investigadores");
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogin = () => {
    setMenuAbierto(false);
    setTituloModal("Acceso para investigadores");
    setMensajeModal("Para ingresar al sistema debes iniciar sesión con un correo especial autorizado por el administrador.");
    setModalLoginAbierto(true);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const closeModal = () => {
    setModalLoginAbierto(false);
    setTituloModal("Acceso para investigadores");
    setMensajeModal("");

    const params = new URLSearchParams(location.search);
    if (params.has("loginError")) {
      params.delete("loginError");
      const nextSearch = params.toString();
      navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ""}`, { replace: true });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const loginError = params.get("loginError");

    if (loginError === "not-allowed") {
      setTituloModal("Acceso denegado");
      setMensajeModal("Ingresaste con un correo no permitido. Debes iniciar sesión con un correo institucional de la Universidad Mariana.");
      setModalLoginAbierto(true);
      setMenuAbierto(false);
    }
  }, [location.search]);

  const handleLogout = () => {
    setMenuAbierto(false);
    setModalLogoutAbierto(true);
  };

  const confirmarLogout = () => {
    logout();
    setModalLogoutAbierto(false);
    window.location.href = "/";
  };

  const cancelarLogout = () => {
    setModalLogoutAbierto(false);
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
    <>
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

      {modalLoginAbierto && (
        <div className="loginModalOverlay" onClick={closeModal}>
          <div className="loginModalCard" onClick={(e) => e.stopPropagation()}>
            <h2 className="loginModalTitle">{tituloModal}</h2>
            <p className="loginModalText">{mensajeModal || "Para ingresar al sistema debes iniciar sesión con un correo especial autorizado por el administrador."}</p>
            <p className="loginModalHint">
              Si tu cuenta no está habilitada, no podrás acceder a las funciones de investigador.
            </p>

            <div className="loginModalActions">
              <button className="loginModalPrimaryButton" onClick={handleGoogleLogin}>
                Iniciar sesión con Google
              </button>
              <button className="loginModalSecondaryButton" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalLogoutAbierto && (
        <div className="loginModalOverlay" onClick={cancelarLogout}>
          <div className="loginModalCard" onClick={(e) => e.stopPropagation()}>
            <h2 className="loginModalTitle">Cerrar sesión</h2>
            <p className="loginModalText">
              ¿Estás seguro de que deseas cerrar tu sesión?
            </p>
            <p className="loginModalHint">
              Tendrás que volver a iniciar sesión para acceder a las funciones de investigador.
            </p>

            <div className="loginModalActions">
              <button className="loginModalPrimaryButton" onClick={confirmarLogout}>
                Sí, cerrar sesión
              </button>
              <button className="loginModalSecondaryButton" onClick={cancelarLogout}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
