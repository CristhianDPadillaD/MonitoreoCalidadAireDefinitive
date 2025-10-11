import React from "react";
import { useParams, Link } from "react-router-dom";
import GraficoDispersionLive from "../components/graficos/GraficoDispersionLive";
import Histograma10Dias from "../components/graficos/Histograma10Dias";
import AnilloDiario from "../components/graficos/AnilloDiario";
import { VARIABLES } from "../config/variables";
import "../styles/pages/variableDetail.css";

export default function VariableDetail() {
  const { key } = useParams();
  const v = VARIABLES.find(x => x.key === key) || VARIABLES[0];
  return (
    <div className="variableDetailContainer">
      <Link to="/" className="volverButton">
        ← Volver
      </Link>
      <h1 className="variableTitulo">{v.label}</h1>
      <p className="variableSubtitulo">Nivel de {v.label} visto en tiempo real</p>

      <GraficoDispersionLive variable={v.key} className="graficoTiempoReal" />

      <div className="variablePromediosContainer">
        <Histograma10Dias variable={v.key} />
        <AnilloDiario variable={v.key} />
      </div>
    </div>
  );
}