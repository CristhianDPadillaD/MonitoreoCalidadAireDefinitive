// src/components/graficos/Boxplot.jsx
import React, { useEffect, useState } from "react";

export default function Boxplot({ variable }) {
  const [box, setBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!variable) return;
    setLoading(true);
    fetch(`http://localhost:3000/api/historial/cuartiles-dia?variable=${variable}`)
      .then((r) => r.json())
      .then((json) => {
        // API que enviaste devuelve { dia, boxplot: {...} }
        if (json && json.boxplot) {
          setBox(json.boxplot);
        } else {
          setBox(null);
        }
      })
      .catch((err) => {
        console.error("Error cargando cuartiles:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [variable]);

  if (loading) return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "200px"}}>
      Cargando diagrama...
    </div>
  );
  if (error) return <div>Error cargando diagrama de cajas</div>;
  if (!box) return <div>No hay datos del boxplot para este día.</div>;

  // Valores de la API
  const { q1, q2, q3, limite_inferior, limite_superior, valoresAtipicos = [] } = box;

  // Ajuste por si limites son iguales (evita división por cero y pinta algo visible)
  let min = limite_inferior;
  let max = limite_superior;
  if (min === max) {
    const padding = Math.max(1, Math.abs(min) * 0.1);
    min = min - padding;
    max = max + padding;
  }

  // SVG drawing params
  const viewHeight = 160;
  const viewWidth = 1000; // usamos viewBox para que sea responsive
  const paddingLeft = 80;
  const paddingRight = 40;
  const innerWidth = viewWidth - paddingLeft - paddingRight;
  const centerY = viewHeight / 2;

  const scaleX = (val) => {
    const ratio = (val - min) / (max - min);
    return paddingLeft + ratio * innerWidth;
  };

  // posiciones
  const xMin = scaleX(limite_inferior);
  const xQ1 = scaleX(q1);
  const xMed = scaleX(q2);
  const xQ3 = scaleX(q3);
  const xMax = scaleX(limite_superior);

  // small styling values
  const boxHeight = 36;
  const boxTop = centerY - boxHeight / 2;
  const whiskerY = centerY;
  const outlierRadius = 5;

  // ticks to mostrar (min, Q1, Q2, Q3, max)
  const ticks = [
    { label: String(limite_inferior), x: xMin },
    { label: `Q1: ${q1}`, x: xQ1 },
    { label: `Med: ${q2}`, x: xMed },
    { label: `Q3: ${q3}`, x: xQ3 },
    { label: String(limite_superior), x: xMax },
  ];

  return (
    <div style={{ width: "100%", background: "#f9fafb", border: "2px solid #e5e7eb", borderRadius: 16, padding: 16, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
      <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#374151", textAlign: "center" }}>
        Diagrama de cajas y bigotes ({box && box.dia ? box.dia : "día"})
      </h3>

      <div style={{ width: "100%", overflow: "hidden" }}>
        <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} width="100%" height={viewHeight}>
          {/* línea de whiskers */}
          <line x1={xMin} x2={xMax} y1={whiskerY} y2={whiskerY} stroke="#94a3b8" strokeWidth={2} />

          {/* extremos (cap lines) */}
          <line x1={xMin} x2={xMin} y1={whiskerY - 18} y2={whiskerY + 18} stroke="#94a3b8" strokeWidth={2} />
          <line x1={xMax} x2={xMax} y1={whiskerY - 18} y2={whiskerY + 18} stroke="#94a3b8" strokeWidth={2} />

          {/* caja Q1 - Q3 */}
          <rect x={xQ1} y={boxTop} width={Math.max(1, xQ3 - xQ1)} height={boxHeight} fill="#60a5fa22" stroke="#3b82f6" strokeWidth={1.5} rx={6} />

          {/* mediana */}
          <line x1={xMed} x2={xMed} y1={boxTop - 6} y2={boxTop + boxHeight + 6} stroke="#1e40af" strokeWidth={2.5} />

          {/* outliers */}
          {valoresAtipicos.map((val, idx) => {
            // si algún outlier está fuera de min/max, lo limitamos visualmente
            let vx = scaleX(val);
            // small jitter vertical para que no se sobrepongan
            const jitter = ((idx % 3) - 1) * 8;
            return <circle key={idx} cx={vx} cy={centerY + boxHeight / 2 + 18 + jitter} r={outlierRadius} fill="#ef4444" stroke="#7f1d1d" strokeWidth={1} />;
          })}

          {/* tick labels */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line x1={t.x} x2={t.x} y1={centerY + 34} y2={centerY + 28} stroke="#cbd5e1" strokeWidth={1} />
              <text x={t.x} y={centerY + 54} fontSize="12" fill="#334155" textAnchor="middle">{t.label}</text>
            </g>
          ))}

          {/* domain numbers abajo (también mostramos una leyenda pequeña) */}
          <text x={paddingLeft} y={16} fontSize="12" fill="#334155">Valor</text>
        </svg>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, background: "#60a5fa22", border: "2px solid #3b82f6", borderRadius: 3 }} />
          <small style={{ color: "#374151" }}>Caja (Q1 - Q3)</small>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, background: "#ef4444", borderRadius: 12 }} />
          <small style={{ color: "#374151" }}>Valores atípicos</small>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 4, background: "#1e40af" }} />
          <small style={{ color: "#374151" }}>Mediana</small>
        </div>
      </div>
    </div>
  );
}
