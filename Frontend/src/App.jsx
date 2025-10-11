import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Invitado from "./pages/Invitado"
import { Routes, Route } from "react-router-dom"
import VariableDetail from "./pages/VariableDetail"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/variableDetail" element={<VariableDetail />} />
        </Routes>
      </main>
    </div>
  )
}