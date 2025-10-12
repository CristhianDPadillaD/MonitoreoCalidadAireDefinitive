import React from "react";
import "../../styles/components/termometro.css";

export default function Termometro({ label, value, unit, thresholds }) {
  // Determinar umbral activo según el valor
  const currentThreshold =
    thresholds.find((t) => value <= t.max) || thresholds[thresholds.length - 1];

  // Calcular el porcentaje de llenado (0–100%)
  const maxValue = thresholds[thresholds.length - 1].max;
  const percent = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div className="termometroWrapper">
      <div className="termometroContainer">
        {/* Tubo del termómetro */}
        <div className="termometroTubo">
          <div
            className="termometroMercurio"
            style={{
              height: `${percent}%`,
              backgroundColor: currentThreshold.color,
            }}
          />
        </div>

        {/* Flecha que marca el valor actual */}
        <div
          className="termometroFlecha"
          style={{
            bottom: `${percent}%`,
            color: currentThreshold.color,
          }}
        >
          ▲
        </div>
      </div>

      {/* Valor numérico */}
      <p className="termometroValor">
        {value?.toFixed(1)} {unit}
      </p>

      {/* Nivel de calidad (Buena, Aceptable, etc.) */}
      <p
        className="termometroLabel"
        style={{
          backgroundColor: currentThreshold.color, // el fondo cambia
          color: "#000000", // texto siempre negro
          fontWeight: "bold",
        }}
      >
        {currentThreshold.label}
      </p>

    </div>
  );
}
