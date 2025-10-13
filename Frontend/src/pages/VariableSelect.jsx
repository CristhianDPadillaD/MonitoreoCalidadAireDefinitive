import React, { useEffect, useState } from "react";
import SimpleAreaChart from "../components/graficos/SimpleAreaChart";
import { useNavigate } from "react-router-dom";
import "../styles/pages/variableSelect.css";

const VariableSelect = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    pm1: [],
    pm25: [],
    pm10: [],
    co: [],
    temperatura: [],
    presion: [],
  });

  const colorGlobal = "#47a2b9ff";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = {
          pm1: "http://localhost:3000/api/historial/ultimos/pm1",
          pm25: "http://localhost:3000/api/historial/ultimos/pm25",
          pm10: "http://localhost:3000/api/historial/ultimos/pm10",
          co: "http://localhost:3000/api/historial/ultimos/co",
          temperatura: "http://localhost:3000/api/historial/ultimas/temperaturas",
          presion: "http://localhost:3000/api/historial/ultimas/presiones",
        };

        const responses = await Promise.all(
          Object.entries(endpoints).map(async ([key, url]) => {
            const res = await fetch(url);
            const json = await res.json();
            return [key, Object.values(json)[0]];
          })
        );

        setData(Object.fromEntries(responses));
      } catch (error) {
        console.error("Error cargando los datos:", error);
      }
    };

    fetchData();
  }, []);

  const variables = [
    { key: "pm1", label: "PM1" },
    { key: "pm25", label: "PM2.5" },
    { key: "pm10", label: "PM10" },
    { key: "co", label: "CO (Monóxido de Carbono)" },
    { key: "temperatura", label: "Temperatura (°C)" },
    { key: "presion", label: "Presión (hPa)" },
  ];

  return (
    <div className="paginaVariablesContainer">
      <h1 className="titulo">Conoce las variables que afectan la calidad del aire</h1>

      <div className="variableCardContainer">
        {variables.map(({ key, label }) => (
          <div key={key} className="variableCard">
            <h2 className="variableTitulo">{label}</h2>
            <div className="variableGraficoContainer">
              <SimpleAreaChart data={data[key]} color={colorGlobal} />
            </div>
            <button
              className="verDetalleButton"
              onClick={() => navigate(`/variable/${key}`)}
            >
              Ver a detalle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariableSelect;
