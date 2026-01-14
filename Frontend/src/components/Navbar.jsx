import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/navBar.css";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

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
        <Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link>
        <Link to="/variableSelect" onClick={() => setMenuAbierto(false)}>Contaminantes</Link>
        <Link to="/monthlyCard" onClick={() => setMenuAbierto(false)}>Niveles mensuales</Link>
        <Link to="/dataDownload" onClick={() => setMenuAbierto(false)}>Descargar datos</Link>
        <Link to="/generarReporte" onClick={() => setMenuAbierto(false)}>Generar reporte</Link>
        <Link to="/compararDatos" onClick={() => setMenuAbierto(false)}>Comparar datos</Link>
        <Link
          to="/iniciarSesion"
          className="IniciarSesionButton"
          onClick={() => setMenuAbierto(false)}
        >
          Iniciar sesión
        </Link>
      </div>
    </nav>
  );
}
