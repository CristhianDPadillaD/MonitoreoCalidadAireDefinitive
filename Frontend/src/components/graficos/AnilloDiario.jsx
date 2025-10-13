import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../../styles/components/anilloDiario.css"

export default function AnilloDiario({ data, variable }) {
  console.log("📊 Data recibida en AnilloDiario:", data, "Variable:", variable);

  if (!data || data.promedio === undefined) {
    return <p>Cargando datos del día...</p>;
  }

  const valor = data.promedio;

  const obtenerMaximo = (variable) => {
    switch (variable) {
      case "pm1":
        return 50; 
      case "pm25":
        return 37; 
      case "pm10":
        return 75; 
      case "co":
        return 30; 
      case "temperatura":
        return 35; 
      case "presion":
        return 1100; 
      default:
        return 100;
    }
  };

  const maximo = obtenerMaximo(variable);
  const porcentaje = Math.min((valor / maximo) * 100, 100);
  const restante = 100 - porcentaje;

  const chartData = [
    { name: "Promedio diario", value: porcentaje },
    { name: "Restante", value: restante },
  ];

  const COLORS = ["#47a2b9ff", "#e0e0e0"];

  return (
    <div className="anilloContainer">
      <h3>Promedio diario</h3>
      <h4 className="subtituloPromedio">En esta grafica veras que tan cerca esta cada variable de llegar
        a su limite diario permitido segun la resolucion 2254 de 2017.
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="valorPromedio">
        <strong>{valor.toFixed(2)}</strong> promedio
      </p>
    </div>
  );
}
