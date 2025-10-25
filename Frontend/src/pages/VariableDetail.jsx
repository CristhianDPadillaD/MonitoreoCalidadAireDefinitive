import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SimpleAreaChart from "../components/graficos/SimpleAreaChart";
import Histograma10Dias from "../components/graficos/Histograma7Dias";
import AnilloDiario from "../components/graficos/AnilloDiario";
import { VARIABLES_ALL } from "../config/variablesAll";
import nivelesPorVariable from "../config/nivelesPorVariable";
import importanciasPorVariable from "../config/importanciasPorVariable";
import "../styles/pages/variableDetail.css";

export default function VariableDetail() {
  const { key } = useParams();
  const v = VARIABLES_ALL.find((x) => x.key === key) || VARIABLES_ALL[0];

  const [dataLive, setDataLive] = useState([]); 
  const [dataSemana, setDataSemana] = useState([]);
  const [dataDia, setDataDia] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpointLive =
          v.key === "temperatura" || v.key === "presion"
            ? `http://localhost:3000/api/historial/ultimas/${
                v.key === "temperatura" ? "temperaturas" : "presiones"
              }`
            : `http://localhost:3000/api/historial/ultimos/${v.key}`;

        const resLive = await fetch(endpointLive);
        const jsonLive = await resLive.json();
        setDataLive(Object.values(jsonLive)[0] || []);

        const resSemana = await fetch(
          `http://localhost:3000/api/historial/promedio-semana?variable=${v.key}`
        );
        const semanaJson = await resSemana.json();
        setDataSemana(Array.isArray(semanaJson) ? semanaJson : []);

        const resDia = await fetch(
          `http://localhost:3000/api/historial/promedio-dia?variable=${v.key}`
        );
        const diaJson = await resDia.json();
        setDataDia(diaJson);
      } catch (error) {
        console.error("Error cargando los datos:", error);
        setDataLive([]);
        setDataSemana([]);
        setDataDia(null);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [v.key]);

  const colorGlobal = "#47a2b9ff";
  const niveles = nivelesPorVariable[v.key] || [];
  const importanciaTexto = importanciasPorVariable[v.key] || "";

  return (
    <div className="variableDetailContainer">
      <Link to="/variableSelect" className="volverButton">
        ← Volver
      </Link>

      <h1 className="variableDetailTitulo">{v.label}</h1>
      <p className="variableSubtitulo">
        Nivel de {v.label} en estos momentos
      </p>

      <div className="graficoTiempoReal">
        <SimpleAreaChart data={dataLive} color={colorGlobal} />
      </div>

      <div className="variablePromediosContainer">
        <Histograma10Dias data={dataSemana} variable={v.key} />
        <AnilloDiario data={dataDia} variable={v.key} />
      </div>


      <div className="importanciaContainer">
        <h2>¿Por qué es importante?</h2>
        <p>{importanciaTexto}</p>
      </div>

      <div className="tablaNivelesContainer">
        <div className="tablaNivelesTitulo"><h2>Rangos de {v.label}</h2></div>
        
        <table className="tablaNiveles">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Rango</th>
            </tr>
          </thead>
          <tbody>
            {niveles.map((nivel, index) => (
              <tr key={index} style={{ backgroundColor: nivel.color }}>
                <td>{nivel.label}</td>
                <td>
                  {nivel.rango[0]} – {nivel.rango[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
