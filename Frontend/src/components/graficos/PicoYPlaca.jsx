import React, { useEffect, useState } from "react";
import { fetchAverages } from "../../services/api";
import { VARIABLES } from "../config/variables";

function colorForValue(value, thresholds) {
  const t = thresholds.find(x => value <= x.max) || thresholds[thresholds.length-1];
  // retorna clase tailwind o hex
  return t.color.replace("bg-",""); // si quieres clase
}

export default function MonthlyHeatmap({ variable }) {
  const v = VARIABLES.find(x => x.key === variable) || VARIABLES[0];
  const [days, setDays] = useState([]);
  useEffect(()=> {
    fetchAverages(variable, 28).then(setDays).catch(()=>setDays([]));
  }, [variable]);

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">Tarjeta mensual de niveles</h2>
      <p className="text-sm text-gray-600 mb-4">Observa los niveles de los últimos 28 días</p>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          // d: { date: '2025-10-01', avg: 12.3 }
          const cls = v.thresholds.find(t=>d.avg <= t.max)?.color || "bg-red-400";
          return (
            <div key={d.date} className={`h-16 rounded flex items-center justify-center ${cls} text-white`} title={`${d.date}: ${d.avg}`}>
              <div className="text-xs">{new Date(d.date).getDate()}</div>
            </div>
          )
        })}
      </div>

      <aside className="mt-4 p-4 border rounded">
        <h4 className="font-medium">Qué significa cada color</h4>
        <ul>
          {v.thresholds.map((t)=>(
            <li key={t.label} className="flex items-center gap-2 mt-2">
              <div className={`w-6 h-4 rounded ${t.color}`} />
              <div>{t.label}</div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}