import React, { useState } from "react";
import "../styles/pages/compararDatos.css"

const CompararDatos = () => {
  const fechaActual = new Date();

  // fecha inicio
  const [startYear, setStartYear] = useState(fechaActual.getFullYear());
  const [startMonth, setStartMonth] = useState(fechaActual.getMonth() + 1);
  const [startDay, setStartDay] = useState(fechaActual.getDate());

  // fecha fin
  const [endYear, setEndYear] = useState(fechaActual.getFullYear());
  const [endMonth, setEndMonth] = useState(fechaActual.getMonth() + 1);
  const [endDay, setEndDay] = useState(fechaActual.getDate());

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const construirFecha = (year, month, day) => {
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDescargar = () => {
    const fecha1 = construirFecha(startYear, startMonth, startDay);
    const fecha2 = construirFecha(endYear, endMonth, endDay);

    const url = `http://localhost:3000/api/historial/comparacion-dias-pdf?fecha1=${fecha1}&fecha2=${fecha2}`;
    window.open(url, "_blank");
  };

  return (
    <div className="compararDatosContainer">
      <div className="backButton">← Volver</div>

      <h1 className="titulo">
        COMPARA LOS DATOS DE DOS FECHAS
      </h1>

      <p className="descripcion">
       ¿Alguna vez quisiste saber la diferencia entre contaminantes entre 
       dos días específicos? Lo puedes hacer; selecciona las dos fechas que 
       necesitas comparar y dale al botón descargar para que obtengas un 
       reporte del promedio de cada contaminante en esos días.
      </p>

      <div className="rangeDatesWrapper">
        {/* inicio */}
        <div className="dateRangeGroup">
          <h3>Fecha inicio</h3>

          <div className="dateInputs">
            <select
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => fechaActual.getFullYear() - i).map(
                (y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                )
              )}
            </select>

            <select
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>

            <select
              value={startDay}
              onChange={(e) => setStartDay(Number(e.target.value))}
            >
              {Array.from(
                { length: getDaysInMonth(startYear, startMonth) },
                (_, i) => i + 1
              ).map((d) => (
                <option key={d} value={d}>
                  {d.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* fin */}
        <div className="dateRangeGroup">
          <h3>Fecha fin</h3>

          <div className="dateInputs">
            <select
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => fechaActual.getFullYear() - i).map(
                (y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                )
              )}
            </select>

            <select
              value={endMonth}
              onChange={(e) => setEndMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>

            <select
              value={endDay}
              onChange={(e) => setEndDay(Number(e.target.value))}
            >
              {Array.from(
                { length: getDaysInMonth(endYear, endMonth) },
                (_, i) => i + 1
              ).map((d) => (
                <option key={d} value={d}>
                  {d.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button className="botonDescargar" onClick={handleDescargar}>
        Descargar
      </button>
    </div>
  );
};

export default CompararDatos;
