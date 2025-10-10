import React, { useEffect, useState } from "react";
import Termometro from "../components/graficos/Termometro";
import VariableDetail from "./VariableDetail";
import { VARIABLES } from "../config/variables";
import { subscribeSSE, fetchLatest, startMockRealtime } from "../services/api";

export default function Home() {
  const [readings, setReadings] = useState({});
  useEffect(() => {
    let stop;
    // si tienes SSE en backend:
    if (import.meta.env.VITE_USE_SSE === "true") {
      stop = subscribeSSE((msg) => {
        if (msg.payload) setReadings(prev => ({...prev, ...msg.payload}));
        if (msg.variable && msg.value !== undefined) setReadings(prev => ({...prev, [msg.variable]: msg.value}));
      });
    } else {
      // fallback: fetch latest once and usar mock realtime
      fetchLatest().then(setReadings).catch(()=>{/*ignore*/});
      stop = startMockRealtime((p) => setReadings(prev => ({...prev, [p.variable]: p.value})));
    }
    return () => stop && stop();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Calidad del aire de la universidad Mariana</h2>
        <div className="grid grid-cols-3 gap-4">
          {VARIABLES.map(v => (
            <Termometro
              key={v.key}
              label={v.label}
              value={Number(readings[v.key] ?? 0)}
              unit={v.unit}
              min={v.min}
              max={v.max}
              thresholds={v.thresholds}
            />
          ))}
        </div>
        <div className="mt-4 text-sm">¿Quieres ver más a detalle? <button className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">Conoce más</button></div>
      </div>

      <aside className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-3">¿Cómo se mide?</h3>
        <div className="flex flex-col items-start gap-2">
          {/* una representación simple del termómetro de color */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-20 bg-gradient-to-b from-red-400 via-yellow-300 to-green-400 rounded" />
            <div className="text-sm">Explicación de rangos: Muy bueno → Malo</div>
          </div>
        </div>
      </aside>
    </div>
  );
}