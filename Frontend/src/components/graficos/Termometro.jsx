import React from "react";
import "../../styles/components/termometro.css";
import { obtenerLimiteMaximo } from "../../config/nivelesPorVariable";

export default function Termometro({ label, value, unit, thresholds, variableKey }) {
  // Determinar umbral activo según el valor
  const currentThreshold =
    thresholds.find((t) => value <= t.max) || thresholds[thresholds.length - 1];

  const limiteMaximo = obtenerLimiteMaximo(variableKey);

  // Escala visual para que el límite de referencia sea visible incluso con picos altos.
  const escalaMaxima = Math.max(
    thresholds[thresholds.length - 1].max,
    limiteMaximo || 0,
    value || 0,
    1
  );
  const percent = Math.min(100, Math.max(0, (value / escalaMaxima) * 100));
  const limitePercent =
    limiteMaximo === null
      ? null
      : Math.min(98, Math.max(2, (limiteMaximo / escalaMaxima) * 100));

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
          {limitePercent !== null && (
            <div
              className="termometroLineaLimite"
              style={{ bottom: `${limitePercent}%` }}
            />
          )}
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
      {limiteMaximo !== null && (
        <p className="termometroLimiteValor">
          Límite: {limiteMaximo} {unit}
        </p>
      )}

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
