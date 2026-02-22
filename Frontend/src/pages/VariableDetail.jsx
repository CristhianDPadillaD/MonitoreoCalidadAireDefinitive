import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SimpleAreaChart from "../components/graficos/SimpleAreaChart";
import Histograma10Dias from "../components/graficos/Histograma7Dias";
import AnilloDiario from "../components/graficos/AnilloDiario";
import Boxplot from "../components/graficos/Bloxpot";
import Linea24Horas from "../components/graficos/Linea24Horas";
import { VARIABLES_ALL } from "../config/variablesAll";
import nivelesPorVariable from "../config/nivelesPorVariable";
import importanciasPorVariable from "../config/importanciasPorVariable";
import "../styles/pages/variableDetail.css";

export default function VariableDetail() {
  const { key } = useParams();
  const v = VARIABLES_ALL.find((x) => x.key === key) || VARIABLES_ALL[0];

  const [dataLive, setDataLive] = useState([]);
  const [dataSemana, setDataSemana] = useState([]);
  const [dataDia, setDataDia] = useState(null);
  const [desviacionDia, setDesviacionDia] = useState(null);
  const [data24Horas, setData24Horas] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpointLive =
          v.key === "temperatura" || v.key === "presion"
            ? `http://localhost:3000/api/historial/ultimas/${v.key === "temperatura" ? "temperaturas" : "presiones"}`
            : `http://localhost:3000/api/historial/ultimos/${v.key}`;

        const resLive = await fetch(endpointLive);
        const jsonLive = await resLive.json();
        setDataLive(Object.values(jsonLive)[0] || []);

        const resSemana = await fetch(
          `http://localhost:3000/api/historial/promedio-semana?variable=${v.key}`
        );
        const semanaJson = await resSemana.json();
        setDataSemana(Array.isArray(semanaJson) ? semanaJson : []);

        const resDia = await fetch(
          `http://localhost:3000/api/historial/promedio-dia?variable=${v.key}`
        );
        const diaJson = await resDia.json();
        setDataDia(diaJson);

        const resDesviacion = await fetch(
          `http://localhost:3000/api/historial/desviacion-estandar-dia?variable=${v.key}`
        );
        const desvJson = await resDesviacion.json();
        setDesviacionDia(desvJson);

        // Obtener datos de 24 horas para la fecha seleccionada
        const res24Horas = await fetch(
          `http://localhost:3000/api/historial/promedio-hora?variable=${v.key}&fecha=${fechaSeleccionada}`
        );
        const horas24Json = await res24Horas.json();
        setData24Horas(horas24Json);

      } catch (error) {
        console.error("Error cargando los datos:", error);
        setDataLive([]);
        setDataSemana([]);
        setDataDia(null);
        setDesviacionDia(null);
        setData24Horas(null);
      }
    };


    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [v.key, fechaSeleccionada]);

  const handleDayClick = (dia) => {
    setFechaSeleccionada(dia);
  };

  const colorGlobal = "#47a2b9ff";
  const niveles = nivelesPorVariable[v.key] || [];
  const importanciaTexto = importanciasPorVariable[v.key] || "";

  return (
    <div className="variableDetailContainer">
      <Link to="/variableSelect" className="volverButton">
        ← Volver
      </Link>

      <h1 className="variableDetailTitulo">{v.label}</h1>
      <p className="variableSubtitulo">
        Nivel de {v.label} en estos momentos
      </p>

      <div className="graficoTiempoReal">
        <SimpleAreaChart data={dataLive} color={colorGlobal} />
      </div>

      <div className="variablePromediosContainer">
        <Histograma10Dias 
          data={dataSemana} 
          variable={v.key} 
          onDayClick={handleDayClick}
          selectedDay={fechaSeleccionada}
        />
        <AnilloDiario data={dataDia} variable={v.key} desviacion={desviacionDia} />
      </div>

      <div className="graficaHoras24Wrapper">
        <Linea24Horas data={data24Horas} variable={v.key} fecha={fechaSeleccionada} />
      </div>

      <div className="boxplotWrapper">
        <Boxplot variable={v.key} />
      </div>


      <div className="importanciaContainer">
        <h2>¿Por qué es importante?</h2>
        <p>{importanciaTexto}</p>
      </div>

      <div className="tablaNivelesContainer">
        <div className="tablaNivelesTitulo"><h2>Rangos de {v.label}</h2></div>

        <table className="tablaNiveles">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Rango</th>
            </tr>
          </thead>
          <tbody>
            {niveles.map((nivel, index) => (
              <tr key={index} style={{ backgroundColor: nivel.color }}>
                <td>{nivel.label}</td>
                <td>
                  {nivel.rango[0]} – {nivel.rango[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
