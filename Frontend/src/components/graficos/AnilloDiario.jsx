import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import nivelesPorVariable, { obtenerLimiteMaximo } from "../../config/nivelesPorVariable";
import { VARIABLES_ALL } from "../../config/variablesAll";
import "../../styles/components/anilloDiario.css"

export default function AnilloDiario({ data, variable, desviacion }) {
  console.log("data recibida en AnilloDiario:", data, "Variable:", variable);

  // Validación defensiva de datos
  if (!data || data.promedio === undefined || data.promedio === null) {
    return (
      <div className="anilloContainer">
        <h3>Promedio diario</h3>
        <p className="sinDatos">No hay datos disponibles para el día de hoy.</p>
      </div>
    );
  }

  const valor = typeof data.promedio === 'number' ? data.promedio : 0;

  // obtener los niveles correspondientes a la variable actual
  const niveles = nivelesPorVariable[variable] || [];

  // buscar el color según el rango
  const nivel = niveles.find(
    (n) => n && n.rango && Array.isArray(n.rango) && valor >= n.rango[0] && valor <= n.rango[1]
  );
  const colorVariable = nivel ? nivel.color : "#47a2b9";
  const unidad = VARIABLES_ALL.find((item) => item.key === variable)?.unidad || "";
  const maximo = obtenerLimiteMaximo(variable) ?? 100;
  const porcentaje = Math.min((valor / maximo) * 100, 100);
  const restante = Math.max(100 - porcentaje, 0);

  const chartData = [
    { name: "Promedio diario", value: porcentaje },
    { name: "Restante", value: restante },
  ];

  const COLORS = [colorVariable, "#e0e0e0"];

  // Validar desviación estándar
  const desviacionValor = desviacion?.desviacionEstandar;
  const desviacionTexto = (desviacionValor !== undefined && desviacionValor !== null) 
    ? (typeof desviacionValor === 'number' ? desviacionValor.toFixed(2) : String(desviacionValor))
    : null;

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
            {typeof valor === 'number' ? valor.toFixed(2) : '0.00'}
          </text>

          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="limiteReferenciaAnillo">
        <span className="lineaLimiteAnillo" />
        <p>
          Límite máximo: <strong>{maximo}{unidad ? ` ${unidad}` : ""}</strong>
        </p>
      </div>
      <div className="nivelDesviacionContainer">
        {nivel && nivel.label && (
          <p className="nivelEtiqueta">
            Nivel: <strong>{nivel.label}</strong>
          </p>

        )}

        {desviacionTexto !== null && (
          <p className="nivelEtiqueta">
            Desviación estándar: <strong>{desviacionTexto}</strong>
          </p>
        )}
      </div>

    </div>
  );
}