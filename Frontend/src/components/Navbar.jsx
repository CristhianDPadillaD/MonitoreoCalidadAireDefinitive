import { Link } from "react-router-dom";
import "../styles/navBar.css";

export default function Navbar() {
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

      <div className="navBarLinks">
        <Link to="/" className="">Inicio</Link>
        <Link to="/invitado" className="">Contaminantes</Link>
        <Link to="/invitado" className="IniciarSesionButton">Iniciar sesión</Link>
      </div>
    </nav>
  );
}
