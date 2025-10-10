import React from "react";
import { useParams, Link } from "react-router-dom";
import GraficoDispersionLive from "../components/graficos/GraficoDispersionLive";
import Histograma10Dias from "../components/graficos/Histograma10Dias";
import AnilloDiario from "../components/graficos/AnilloDiario";
import { VARIABLES } from "../config/variables";

export default function VariableDetail() {
  const { key } = useParams();
  const v = VARIABLES.find(x => x.key === key) || VARIABLES[0];
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/" className="text-sm mb-4 inline-block">← Volver</Link>
      <h1 className="text-3xl font-bold mb-4">{v.label}</h1>
      <p className="text-sm text-gray-600 mb-4">Nivel de {v.label} visto en tiempo real</p>

      <GraficoDispersionLive variable={v.key} />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Histograma10Dias variable={v.key} />
        <AnilloDiario variable={v.key} />
      </div>
    </div>
  );
}