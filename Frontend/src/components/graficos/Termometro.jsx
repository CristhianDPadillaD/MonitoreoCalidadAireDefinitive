import React from "react";
import "../../styles/components/termometro.css";

export default function Termometro({ label, value, unit, min, max, thresholds, size = "medium", color = "#3498db" }) {
  // Limitar valor al rango [min, max]
  const clampedValue = Math.min(Math.max(value, min), max);
  const porcentaje = ((clampedValue - min) / (max - min)) * 100;

  // Tamaño dinámico
  const sizeStyles = {
    small: { height: "150px", width: "40px" },
    medium: { height: "200px", width: "50px" },
    large: { height: "250px", width: "60px" }
  };

  return (
    <div className="termometroWrapper">
      

      <div className="termometroContainer">
        {/* Flecha que indica el nivel */}
        <div className="termometroFlecha" style={{ bottom: `${porcentaje}%` }}>
          ▲
        </div>

        {/* Tubo del termómetro */}
        <div className="termometroTubo">
          <div
            className="termometroMercurio"
            style={{ height: `${porcentaje}%` }}
          />
        </div>
      </div>

      <p className="termometroValor">{value} {unit}</p>
    </div>
  );
}
