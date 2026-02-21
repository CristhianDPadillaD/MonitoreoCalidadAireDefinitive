import React, { useState } from "react";
import "../styles/pages/generarReporte.css";

const GenerarReporte = () => {
  const fechaActual = new Date();

  // fecha única
  const [year, setYear] = useState(fechaActual.getFullYear());
  const [month, setMonth] = useState(fechaActual.getMonth() + 1);
  const [day, setDay] = useState(fechaActual.getDate());

  // fecha rango
  const [startYear, setStartYear] = useState(fechaActual.getFullYear());
  const [startMonth, setStartMonth] = useState(fechaActual.getMonth() + 1);
  const [startDay, setStartDay] = useState(fechaActual.getDate());

  const [endYear, setEndYear] = useState(fechaActual.getFullYear());
  const [endMonth, setEndMonth] = useState(fechaActual.getMonth() + 1);
  const [endDay, setEndDay] = useState(fechaActual.getDate());

  const [errorRango, setErrorRango] = useState("");

  const validarRangoFuturo = (y1, m1, d1, y2, m2, d2) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicio = new Date(y1, m1 - 1, d1);
    const fin = new Date(y2, m2 - 1, d2);
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);

    if (inicio > hoy || fin > hoy) {
      setErrorRango("No se puede generar reportes de días futuros");
      return true;
    }

    setErrorRango("");
    return false;
  };

  const [errorFecha, setErrorFecha] = useState("");

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  // validacion de fecha futura
  const validarFechaFutura = (y, m, d) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaSeleccionada = new Date(y, m - 1, d);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada > hoy) {
      setErrorFecha("No se puede generar reportes de días futuros");
      return true;
    }

    setErrorFecha("");
    return false;
  };

  const descargarPdf = async (fechaInicio, fechaFin = null) => {
    try {
      let url = `http://localhost:3000/api/historial/generar-pdf?fechaInicio=${fechaInicio}`;
      if (fechaFin) url += `&fechaFin=${fechaFin}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("No se pudo generar el PDF");

      window.open(url, "_blanck");
    } catch (error) {
      console.error(error);
      alert("Error al generar el PDF");
    }
  };

  const handleSingleDownload = () => {
    if (errorFecha) return;

    const fecha = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    descargarPdf(fecha);
  };

  const handleRangeDownload = () => {
    const inicio = `${startYear}-${String(startMonth).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;
    const fin = `${endYear}-${String(endMonth).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;

    if (
      validarFechaFutura(startYear, startMonth, startDay) ||
      validarFechaFutura(endYear, endMonth, endDay)
    ) {
      return;
    }

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
            ¿Quieres obtener un análisis de la calidad del aire de un día en específico?
            Puedes hacerlo seleccionando el día que te interese, incluso puedes hacerlo durante un periodo de tiempo.
          </p>

          {/* fecha unica */}
          <div className="singleDateSection">
            <p className="reporteDescriptionFecha">
              Si quieres obtener un reporte de un día en especial
            </p>

            <h3>Fecha</h3>

            <div className="dateInputs">
              <select
                value={year}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setYear(y);
                  validarFechaFutura(y, month, day);
                }}
              >
                {Array.from({ length: 5 }, (_, i) => fechaActual.getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <select
                value={month}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  setMonth(m);
                  validarFechaFutura(year, m, day);
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                ))}
              </select>

              <select
                value={day}
                onChange={(e) => {
                  const d = Number(e.target.value);
                  setDay(d);
                  validarFechaFutura(year, month, d);
                }}
              >
                {Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>

            {errorFecha && <p className="errorFecha">{errorFecha}</p>}

            <button
              className="downloadButton"
              onClick={handleSingleDownload}
              disabled={!!errorFecha}
            >
              Descargar
            </button>
          </div>

          <hr className="divider" />

          {/* rango */}
          <div className="rangeSection">
            <div className="rangeContent">
              <p className="reporteDescriptionFecha">
                Si quieres obtener un reporte de un periodo de tiempo
              </p>

              {/* contenedor de fechas */}
              <div className="rangeDatesWrapper">
                {/* Fecha inicio */}
                <div className="dateRangeGroup">
                  <h3>Fecha inicio</h3>
                  <div className="dateInputs">
                    <select
                      value={startYear}
                      onChange={(e) => {
                        const y = Number(e.target.value);
                        setStartYear(y);
                        validarRangoFuturo(
                          y,
                          startMonth,
                          startDay,
                          endYear,
                          endMonth,
                          endDay
                        );
                      }}
                    >
                      {Array.from({ length: 5 }, (_, i) => fechaActual.getFullYear() - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>

                    <select
                      value={startMonth}
                      onChange={(e) => {
                        const m = Number(e.target.value);
                        setStartMonth(m);
                        validarRangoFuturo(
                          startYear,
                          m,
                          startDay,
                          endYear,
                          endMonth,
                          endDay
                        );
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                      ))}
                    </select>

                    <select
                      value={startDay}
                      onChange={(e) => {
                        const d = Number(e.target.value);
                        setStartDay(d);
                        validarRangoFuturo(
                          startYear,
                          startMonth,
                          d,
                          endYear,
                          endMonth,
                          endDay
                        );
                      }}
                    >
                      {Array.from(
                        { length: getDaysInMonth(startYear, startMonth) },
                        (_, i) => i + 1
                      ).map((d) => (
                        <option key={d} value={d}>{d.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* fecha fin */}
                <div className="dateRangeGroup">
                  <h3>Fecha fin</h3>
                  <div className="dateInputs">
                    <select
                      value={endYear}
                      onChange={(e) => {
                        const y = Number(e.target.value);
                        setEndYear(y);
                        validarRangoFuturo(
                          startYear,
                          startMonth,
                          startDay,
                          y,
                          endMonth,
                          endDay
                        );
                      }}
                    >
                      {Array.from({ length: 5 }, (_, i) => fechaActual.getFullYear() - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>

                    <select
                      value={endMonth}
                      onChange={(e) => {
                        const m = Number(e.target.value);
                        setEndMonth(m);
                        validarRangoFuturo(
                          startYear,
                          startMonth,
                          startDay,
                          endYear,
                          m,
                          endDay
                        );
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>
                      ))}
                    </select>

                    <select
                      value={endDay}
                      onChange={(e) => {
                        const d = Number(e.target.value);
                        setEndDay(d);
                        validarRangoFuturo(
                          startYear,
                          startMonth,
                          startDay,
                          endYear,
                          endMonth,
                          d
                        );
                      }}
                    >
                      {Array.from(
                        { length: getDaysInMonth(endYear, endMonth) },
                        (_, i) => i + 1
                      ).map((d) => (
                        <option key={d} value={d}>{d.toString().padStart(2, "0")}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* alerta */}
              {errorRango && (
                <div className="errorContainer">
                  <p className="errorFecha">{errorRango}</p>
                </div>
              )}

              <button
                className="downloadButton"
                onClick={handleRangeDownload}
                disabled={!!errorRango}
              >
                Descargar
              </button>
            </div>
          </div>

        </div>

        <div className="infoPanel">
          <h3>¿QUÉ DATOS OBTENDRÁS?</h3>
          <ul className="infoList">
            <li>Todas las variables que influyen en la calidad del aire.</li>
            <li>Su promedio durante el tiempo seleccionado.</li>
            <li>Los límites permitidos en la resolución 2254.</li>
            <li>Indicadores claros de cumplimiento.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GenerarReporte;
