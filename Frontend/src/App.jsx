import Navbar from "./components/Navbar"
import Home from "./pages/Home"

import { Routes, Route } from "react-router-dom"
import VariableDetail from "./pages/VariableDetail"
import VariableSelect from "./pages/VariableSelect"
import MonthlyCard from "./pages/MonthlyCard"
import DataDownload from "./pages/DataDownload"
import GenerarReporte from "./pages/GenerarReporte"
import CompararDatos from "./pages/CompararDatos"
import AuthSuccess from "./pages/AuthSuccess"
import { AuthProvider } from "./context/AuthContext"

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-6" style={{ paddingTop: '5rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/variableSelect" element={<VariableSelect />} />
            <Route path="/variable/:key" element={<VariableDetail />} />
            <Route path="/monthlyCard" element={<MonthlyCard />} />
            <Route path="/dataDownload" element={<DataDownload />} />
            <Route path="/generarReporte" element={<GenerarReporte />} />
            <Route path="/compararDatos" element={<CompararDatos />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
