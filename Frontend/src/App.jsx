import Navbar from "./components/Navbar"
import Home from "./pages/Home"

import { Routes, Route } from "react-router-dom"
import VariableDetail from "./pages/VariableDetail"
import VariableSelect from "./pages/VariableSelect"
import MonthlyCard from "./pages/MonthlyCard"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6" style={{ paddingTop: '5rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/variableSelect" element={<VariableSelect />} />
          <Route path="/variable/:key" element={<VariableDetail />} />
          <Route path="/monthlyCard" element={<MonthlyCard />} />
        </Routes>
      </main>
    </div>
  )
}
