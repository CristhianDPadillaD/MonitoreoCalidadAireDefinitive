import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SimpleAreaChart from "../components/graficos/SimpleAreaChart";
import { obtenerColorPorValor } from "../config/nivelesPorVariable";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";
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

  const colorFallback = "#47a2b9";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = {
          pm1: `${API_URL}/api/historial/ultimos/pm1`,
          pm25: `${API_URL}/api/historial/ultimos/pm25`,
          pm10: `${API_URL}/api/historial/ultimos/pm10`,
          co: `${API_URL}/api/historial/ultimos/co`,
          temperatura: `${API_URL}/api/historial/ultimas/temperaturas`,
          presion: `${API_URL}/api/historial/ultimas/presiones`,
        };

        const responses = await Promise.all(
          Object.entries(endpoints).map(async ([key, url]) => {
            const res = await fetch(url);
            const json = await res.json();
            return [key, Object.values(json)[0]];
          })
        );

        setData(Object.fromEntries(responses));
        console.log("Datos actualizados:", new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Error cargando los datos:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000); // actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, []);


  const variables = [
    { key: "pm1", label: "PM1 (μg/m³)" },
    { key: "pm25", label: "PM2.5 (μg/m³)" },
    { key: "pm10", label: "PM10 (μg/m³)" },
    { key: "co", label: "CO (Monóxido de Carbono) (mg/m³)" },
    { key: "temperatura", label: "Temperatura (°C)" },
    { key: "presion", label: "Presión (hPa)" },
  ];

  return (
    <div>
      <div className="paginaVariablesContainer">
        <h1 className="titulo">CONOCE LAS VARIABLES QUE AFECTAN LA CALIDAD DEL AIRE</h1>

        <div className="variableCardContainer">
          {variables.map(({ key, label }) => (
            <div key={key} className="variableCard">
              <h2 className="variableTitulo">{label}</h2>
              <div className="variableGraficoContainer">
                {(() => {
                  const arr = data[key];
                  let ultimo = null;
                  if (Array.isArray(arr) && arr.length) {
                    for (let i = arr.length - 1; i >= 0; i--) {
                      const it = arr[i];
                      const val = Number(it?.valor ?? it?.value ?? it ?? NaN);
                      if (Number.isFinite(val)) {
                        ultimo = val;
                        break;
                      }
                    }
                  }
                  const color = obtenerColorPorValor(key, ultimo) || colorFallback;
                  return <SimpleAreaChart data={data[key]} variable={key} color={color} />;
                })()}
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
    </div>

  );
};

export default VariableSelect;
