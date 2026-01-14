import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import nivelesPorVariable from "../../config/nivelesPorVariable";
import "../../styles/components/anilloDiario.css"

export default function AnilloDiario({ data, variable, desviacion }) {
  console.log("data recibida en AnilloDiario:", data, "Variable:", variable);

  if (!data || data.promedio === undefined) {
    return <p>Cargando datos del día...</p>;
  }

  const valor = data.promedio;

  // obtener los niveles correspondientes a la variable actual
  const niveles = nivelesPorVariable[variable] || [];

  // buscar el color según el rango
  const nivel = niveles.find(
    (n) => valor >= n.rango[0] && valor <= n.rango[1]
  );
  const colorVariable = nivel ? nivel.color : "#47a2b9";

  const obtenerMaximo = (variable) => {
    switch (variable) {
      case "pm1":
        return 50;
      case "pm2_5":
        return 250;
      case "pm10":
        return 500;
      case "co":
        return 30;
      case "temperatura":
        return 40;
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

  const COLORS = [colorVariable, "#e0e0e0"];

  return (
    <div className="anilloContainer">
      <h3>Promedio diario</h3>
      <h4 className="subtituloPromedio">
        Este anillo muestra qué tan cerca está el promedio diario de alcanzar su
        límite según la Resolución 2254 de 2017.
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
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          {/* texto central */}
          <text
            x="49.5%"
            y="47%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="valorCentralAnillo"
          >
            {valor.toFixed(2)}
          </text>

          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="nivelDesviacionContainer">
        {nivel && (
          <p className="nivelEtiqueta">
            Nivel: <strong>{nivel.label}</strong>
          </p>

        )}

        {desviacion && (
          <p className="nivelEtiqueta">
            Desviación estándar: <strong>{desviacion.desviacionEstandar}</strong>
          </p>
        )}
      </div>

    </div>
  );
}