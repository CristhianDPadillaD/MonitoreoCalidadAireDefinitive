import React, { useEffect, useState } from "react";
import Termometro from "../components/graficos/Termometro";
import { VARIABLES } from "../config/variables";
import "../styles/pages/home.css";

export default function Home() {
  const [readings, setReadings] = useState({
    co: 0,
    pm1: 0,
    pm2_5: 0,
    pm10: 0,
  });

  // Función para consultar la API
  const obtenerUltimoDato = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/historial/ultimo");
      if (!res.ok) throw new Error("Error al obtener los datos");
      const data = await res.json();

      // Actualizamos el estado con los valores recibidos
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

  // Llamar a la API al montar y cada 5 segundos
  useEffect(() => {
    obtenerUltimoDato(); // primera llamada inmediata

    const intervalo = setInterval(() => {
      obtenerUltimoDato();
    }, 5000); // 5 segundos

    // limpiar intervalo al desmontar
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="containerGeneral">
      <div className="calidadAireContainer">
        <h2 className="calidadAireTitulo">
          Calidad del aire de la universidad Mariana
        </h2>

        {/*  Aquí se renderizan los termómetros */}
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
          <button className="verMasButton">Conoce más</button>
        </div>
      </div>

      <aside className="comoSeMideContainer">
        <h3 className="comoSeMideTitulo">¿Cómo se mide?</h3>
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
