import React, { useEffect, useState } from "react";
import Termometro from "../components/graficos/Termometro";
import { VARIABLES } from "../config/variablesHome";
import "../styles/pages/home.css";
import { useNavigate } from "react-router-dom"; 

export default function Home() {
  const navigate = useNavigate();

  const [readings, setReadings] = useState({
    co: 0,
    pm1: 0,
    pm2_5: 0,
    pm10: 0,
  });

  // funcion que consulta la api
  const obtenerUltimoDato = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/historial/ultimo");
      if (!res.ok) throw new Error("Error al obtener los datos");
      const data = await res.json();

      //actualizar datos
      setReadings({
        co: data.co,
        pm1: data.pm1,
        pm2_5: data.pm2_5,
        pm10: data.pm10,
      });
    } catch (error) {
      console.error("Error al consultar la API:", error);
    }
  };

  // llamar a la api cada 5 segundos
  useEffect(() => {
    obtenerUltimoDato(); 

    const intervalo = setInterval(() => {
      obtenerUltimoDato();
    }, 5000); 

    
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="containerGeneral">
      <div className="calidadAireContainer">
        <h2 className="calidadAireTitulo">
          CALIDAD DE AIRE DE LA UNIVERSIDAD MARIANA
        </h2>

        {/*  termometros */}
        <div className="graficaTermometroContainer">
          {VARIABLES.map((v) => (
            <div key={v.key} className={`termometroCard ${v.key}`}>
              
              <h3 className="termometroTitulo">{v.label}</h3>
              <Termometro
                label={v.label}
                value={Number(readings[v.key] ?? 0)}
                unit={v.unit}
                min={v.min}
                max={v.max}
                thresholds={v.thresholds}
              />
              
            </div>
          ))}
        </div>

        <div className="verMas">
          ¿Quieres ver más a detalle cómo se comporta la calidad del aire?
          <button
            className="verMasButton"
            onClick={() => navigate("/VariableSelect")} 
          >
            Conoce más
          </button>
        </div>
      </div>

      <aside className="comoSeMideContainer">
        <h3 className="comoSeMideTitulo">¿Cómo se mide?</h3>
        <h2 className="comoSeMideSubtitulo">
          La calidad del aire se mide a través de sensores que detectan la
          concentración de contaminantes en el aire, segun en el nivel donde 
          se encuentren, han sido clasificadas en estos 6 colores para que 
          puedas distinguir la calidad del aire de un vistazo.
        </h2>
        <div className="comoSeMideContenido">
          <div className="flex items-center gap-3">
            <div className="medidasContainer" />
            <div className="buenaContainer">Calidad de aire buena</div>
            <div className="aceptableContainer">Calidad de aire aceptable</div>
            <div className="dañinaSensiblesContainer">Calidad de aire dañina para grupos sensibles</div>
            <div className="dañinaContainer">Calidad de aire dañina para la salud</div>
            <div className="muyDañinaContainer">Calidad de aire muy dañina</div>
            <div className="peligrosaContainer">Calidad de aire peligrosa</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
