import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Histograma10Dias({ data }) {
  if (!data || data.length === 0) return <p>Cargando histograma...</p>;

  const diasOrden = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const dataOrdenada = [...data].sort(
    (a, b) => diasOrden.indexOf(a.diaSemana) - diasOrden.indexOf(b.diaSemana)
  );

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Promedio semanal</h3>
      <h4 className="subtituloPromedioSemana">
        Mira cuáles han sido los promedios de este factor contaminante durante
        la última semana.
      </h4>
      <ResponsiveContainer width="100%" height="100%" className="histogramaSemana">
        <BarChart data={dataOrdenada}>
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
