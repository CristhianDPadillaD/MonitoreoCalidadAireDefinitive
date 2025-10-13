import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Histograma10Dias({ data }) {
  if (!data || data.length === 0) return <p>Cargando histograma...</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Promedio semanal</h3>
      <h4 className="subtituloPromedioSemana">Mira cuales han sido los 
        promedios de este factor contaminante durante la ultima semana.
      </h4>
      <ResponsiveContainer width="100%" height="100%" className="histogramaSemana">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="diaSemana" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="promedio" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
