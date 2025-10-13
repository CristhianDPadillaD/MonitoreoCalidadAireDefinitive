import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SimpleAreaChart from "../components/graficos/SimpleAreaChart";
import Histograma10Dias from "../components/graficos/Histograma10Dias";
import AnilloDiario from "../components/graficos/AnilloDiario";
import { VARIABLES_ALL } from "../config/variablesAll";
import "../styles/pages/variableDetail.css";

export default function VariableDetail() {
  const { key } = useParams();
  const v = VARIABLES_ALL.find((x) => x.key === key) || VARIABLES_ALL[0];

  const [dataLive, setDataLive] = useState([]); // 🔹 Nuevo estado para el área
  const [dataSemana, setDataSemana] = useState([]);
  const [dataDia, setDataDia] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Datos para el área (reemplaza el gráfico de dispersión)
        const resLive = await fetch(
          `http://localhost:3000/api/historial/ultimos/${v.key}`
        );
        const jsonLive = await resLive.json();
        setDataLive(Object.values(jsonLive)[0] || []);

        // 🔹 Promedios de la semana
        const resSemana = await fetch(
          `http://localhost:3000/api/historial/promedio-semana?variable=${v.key}`
        );
        const semanaJson = await resSemana.json();
        setDataSemana(semanaJson);

        // 🔹 Promedio del día
        const resDia = await fetch(
          `http://localhost:3000/api/historial/promedio-dia?variable=${v.key}`
        );
        const diaJson = await resDia.json();
        setDataDia(diaJson);
      } catch (error) {
        console.error("Error cargando los datos:", error);
      }
    };

    fetchData();
  }, [v.key]);

  const colorGlobal = "#47a2b9ff";

  return (
    <div className="variableDetailContainer">
      <Link to="/variableSelect" className="volverButton">
        ← Volver
      </Link>

      <h1 className="variableDetailTitulo">{v.label}</h1>
      <p className="variableSubtitulo">
        Nivel de {v.label} durante las últimas horas
      </p>

      <div className="graficoTiempoReal">
        <SimpleAreaChart data={dataLive} color={colorGlobal} />
      </div>

      <div className="variablePromediosContainer">
        <Histograma10Dias data={dataSemana} variable={v.key} />
        <AnilloDiario data={dataDia} variable={v.key} />
      </div>
    </div>
  );
}
