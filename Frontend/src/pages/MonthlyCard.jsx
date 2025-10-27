import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import nivelesPorVariable from "../config/nivelesPorVariable"; 
import "../styles/pages/monthlyCard.css";

export default function MonthlyCard() {
  const hoy = new Date();
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [variable, setVariable] = useState("pm25"); 
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState("");

  const niveles = nivelesPorVariable[variable] || []; 

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const handleVariableChange = (e) => setVariable(e.target.value);

  const handleMesChange = (e) => {
    const mesSeleccionado = parseInt(e.target.value);
    if (anio === hoy.getFullYear() && mesSeleccionado > hoy.getMonth() + 1) {
      setError("No puedes seleccionar meses del futuro");
    } else {
      setMes(mesSeleccionado);
      setError("");
    }
  };

  const handleAnioChange = (e) => {
    const anioSeleccionado = parseInt(e.target.value);
    if (anioSeleccionado > hoy.getFullYear()) {
      setError("No puedes seleccionar años del futuro");
    } else {
      setAnio(anioSeleccionado);
      setError("");
    }
  };

  const diasEnMes = new Date(anio, mes, 0).getDate();

  useEffect(() => {
    async function obtenerDatos() {
      try {
        const mesStr = `${anio}-${String(mes).padStart(2, "0")}`;
        const res = await fetch(
          `http://localhost:3000/api/historial/promedio-mes?variable=${variable}&mes=${mesStr}`
        );

        if (!res.ok) {
          if (res.status === 404) {
            setDatos(Array.from({ length: diasEnMes }, () => null));
            return;
          } else {
            throw new Error("Error al obtener los datos");
          }
        }

        const data = await res.json();

        // crear matriz con los días del mes
        const matriz = Array.from({ length: diasEnMes }, () => null);
        data.forEach((d) => {
          const diaNum = new Date(d.dia).getDate();
          matriz[diaNum - 1] = d.promedio;
        });

        setDatos(matriz);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos");
      }
    }

    obtenerDatos();
  }, [anio, mes, variable]);

  // funcion para obtener color según promedio
  const getColorPorPromedio = (promedio) => {
    if (promedio == null) return "#d9d9d9"; // gris para sin datos
    const nivel = niveles.find(
      (n) => promedio >= n.rango[0] && promedio < n.rango[1]
    );
    return nivel ? nivel.color : "#d9d9d9";
  };

  return (
    <div className="monthlyContainer">
      <Link to="/" className="volverButton">
        ← Volver
      </Link>

      <div className="monthlyHeader">
        <h1>TARJETA MENSUAL DE LOS NIVELES DE CONTAMINACIÓN</h1>
      </div>

      <p className="monthlySubtitulo">
        Observa los niveles diarios de contaminación del mes seleccionado.
      </p>

      {/* 🔹 Selectores de año, mes y variable */}
      <div className="selectsContainer">
        <select value={anio} onChange={handleAnioChange}>
          {Array.from({ length: 5 }, (_, i) => hoy.getFullYear() - i).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select value={mes} onChange={handleMesChange}>
          {meses.map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
        </select>

        <select value={variable} onChange={handleVariableChange}>
          <option value="pm1">PM1</option>
          <option value="pm25">PM2.5</option>
          <option value="pm10">PM10</option>
          <option value="co">CO</option>
          <option value="presion">Presión</option>
          <option value="temperatura">Temperatura</option>
        </select>
      </div>

      {error && <p className="monthly-error">{error}</p>}

      <div className="monthlyMatriz">
        <div className="color-grid">
          {datos.map((promedio, i) => (
            <div
              key={i}
              className="color-cell"
              title={`Día ${i + 1}: ${promedio ?? "Sin datos"}`}
              style={{ backgroundColor: getColorPorPromedio(promedio) }}
            >
              <span className="cell-day">{i + 1}</span>
            </div>
          ))}
        </div>

        {/* 🔹 Leyenda dinámica según la variable seleccionada */}
        <div className="queSignificaContainer">
          <h2>¿Qué significa cada color?</h2>
          <ul>
            {niveles.map((n, i) => (
              <li key={i}>
                <span
                  className="legend-color"
                  style={{ backgroundColor: n.color }}
                ></span>
                {n.label} ({n.rango[0]} - {n.rango[1]})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
