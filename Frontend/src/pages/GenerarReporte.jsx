import React, { useState } from "react";
import "../styles/pages/generarReporte.css";

const GenerarReporte = () => {
  const fechaActual = new Date();

  // Fecha única
  const [year, setYear] = useState(fechaActual.getFullYear());
  const [month, setMonth] = useState(fechaActual.getMonth() + 1);
  const [day, setDay] = useState(fechaActual.getDate());

  // Fecha rango
  const [startYear, setStartYear] = useState(fechaActual.getFullYear());
  const [startMonth, setStartMonth] = useState(fechaActual.getMonth() + 1);
  const [startDay, setStartDay] = useState(fechaActual.getDate());

  const [endYear, setEndYear] = useState(fechaActual.getFullYear());
  const [endMonth, setEndMonth] = useState(fechaActual.getMonth() + 1);
  const [endDay, setEndDay] = useState(fechaActual.getDate());

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  const descargarPdf = async (fechaInicio, fechaFin = null) => {
    try {
      let url = `http://localhost:3000/api/historial/generar-pdf?fechaInicio=${fechaInicio}`;
      if (fechaFin) url += `&fechaFin=${fechaFin}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("No se pudo generar el PDF");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `reporte_calidad_aire.pdf`;
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("Error al generar el PDF");
    }
  };

  const handleSingleDownload = () => {
    const fecha = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    descargarPdf(fecha);
  };

  const handleRangeDownload = () => {
    const inicio = `${startYear}-${String(startMonth).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;
    const fin = `${endYear}-${String(endMonth).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;
    descargarPdf(inicio, fin);
  };

  return (
    <div className="reporteContainer">

      <button onClick={() => window.history.back()} className="backButton">
        ← Volver
      </button>

      <div className="reporteLayout">

        <div className="leftColumn">
          <h2 className="reporteTitle">GENERA UN REPORTE DE LA CALIDAD DEL AIRE</h2>

          <p className="reporteDescription">
            Quieres obtener un analisis de la calidad del aire de un dia en especifico?
            Puedes hacerlo seleccionando el dia que te interese, incluso puedes hacerlo durante un periodo de tiempo,
            selecciona el intervalo de los dias que necesites y generalo con un solo clic.
          </p>

          {/* FECHA ÚNICA */}
          <div className="singleDateSection">

            <p className="reporteDescriptionFecha">
              Si quieres obtener un reporte de un dia en especial
            </p>

            <h3>Fecha</h3>

            <div className="dateInputs">
              <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {Array.from({ length: 5 }, (_, i) => fechaActual.getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                ))}
              </select>

              <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
                {Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>

            <button className="downloadButton" onClick={handleSingleDownload}>
              Descargar
            </button>
          </div>

          <hr className="divider" />

          <div className="rangeSection">

            <p className="reporteDescriptionFecha">
             Si quieres obtener un reporte de un periodo de tiempo.
            </p>

            <div className="rangeDatesWrapper">

              {/* Inicio */}
              <div className="dateRangeGroup">
                <h3>Fecha inicio</h3>

                <div className="dateInputs">
                  <select value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}>
                    {Array.from({ length: 5 }, (_, i) => fechaActual.getFullYear() - i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>

                  <select value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                    ))}
                  </select>

                  <select value={startDay} onChange={(e) => setStartDay(Number(e.target.value))}>
                    {Array.from({ length: getDaysInMonth(startYear, startMonth) }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>{d.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fin */}
              <div className="dateRangeGroup">
                <h3>Fecha fin</h3>

                <div className="dateInputs">
                  <select value={endYear} onChange={(e) => setEndYear(Number(e.target.value))}>
                    {Array.from({ length: 5 }, (_, i) => fechaActual.getFullYear() - i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>

                  <select value={endMonth} onChange={(e) => setEndMonth(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                    ))}
                  </select>

                  <select value={endDay} onChange={(e) => setEndDay(Number(e.target.value))}>
                    {Array.from({ length: getDaysInMonth(endYear, endMonth) }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>{d.toString().padStart(2, "0")}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            <button className="downloadButton" onClick={handleRangeDownload}>
              Descargar
            </button>
          </div>
        </div>

        <div className="infoPanel">
          <h3>¿QUÉ DATOS OBTENDRÁS?</h3>
          <ul className="infoList">
            <li>Todas las variables que influyen en la calidad del aire.</li>
            <li>Su promedio durante el tiempo que hayas seleccionado.</li>
            <li>Los límites permitidos en la resolución 2254 por cada variable.</li>
            <li>Sabrás si están dentro de los límites o los superan.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default GenerarReporte;
