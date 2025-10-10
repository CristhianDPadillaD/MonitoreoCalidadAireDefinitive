import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Monitoreo Calidad del Aire</h1>
      <div className="flex gap-4">
        <Link to="/" className="hover:underline">Inicio</Link>
        <Link to="/invitado" className="hover:underline">Invitado</Link>
      </div>
    </nav>
  )
}
