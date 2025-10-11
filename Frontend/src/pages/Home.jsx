import React, { useEffect, useState } from "react";
import Termometro from "../components/graficos/Termometro";
import VariableDetail from "./VariableDetail";
import { VARIABLES } from "../config/variables";
import { subscribeSSE, fetchLatest, startMockRealtime } from "../services/api";
import "../styles/pages/home.css"

export default function Home() {
  const [readings, setReadings] = useState({});
  useEffect(() => {
    let stop;
    if (import.meta.env.VITE_USE_SSE === "true") {
      stop = subscribeSSE((msg) => {
        if (msg.payload) setReadings(prev => ({ ...prev, ...msg.payload }));
        if (msg.variable && msg.value !== undefined) setReadings(prev => ({ ...prev, [msg.variable]: msg.value }));
      });
    } else {

      fetchLatest().then(setReadings).catch(() => {/*ignore*/ });
      stop = startMockRealtime((p) => setReadings(prev => ({ ...prev, [p.variable]: p.value })));
    }
    return () => stop && stop();
  }, []);

  return (


    <div className="containerGeneral">
      <div className="calidadAireContainer">
        <h2 className="calidadAireTitulo">
          Calidad del aire de la universidad Mariana
        </h2>

        <div className="graficaTermometroContainer">
          {VARIABLES.map(v => (
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
              <p className="estadoCalidad">Buena / Regular / Mala</p>
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
              <div className="excelenteContainer">
                Calidad de aire excelente 
              </div>
              <div className="buenaContainer">
                Calidad de aire buena 
              </div>
              <div className="regularContainer">
                Calidad de aire regular 
              </div>
              <div className="malaContainer">
                Calidad de aire mala 
              </div>
          </div>
        </div>
      </aside>
    </div>
  );
}