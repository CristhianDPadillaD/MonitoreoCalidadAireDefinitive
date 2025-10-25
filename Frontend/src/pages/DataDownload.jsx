import React, { useState } from "react";
import "../styles/pages/dataDownload.css";

const DataDownload = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [day, setDay] = useState(new Date().getDate());
    const [errorMensaje, setErrorMensaje] = useState("");

    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

    const handleDownload = async () => {
        const fecha = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const url = `http://localhost:3000/api/historial/descargar-csv?fecha=${fecha}`;
        setErrorMensaje(""); 

        try {
            const response = await fetch(url);

            if (response.status === 404) {
                setErrorMensaje("La fecha seleccionada no tiene registros disponibles.");
                return;
            }

            if (!response.ok) {
                throw new Error("Error al descargar los datos");
            }

            const blob = await response.blob();

            if (blob.size === 0) {
                setErrorMensaje("La fecha seleccionada no tiene registros disponibles.");
                return;
            }

            const enlace = document.createElement("a");
            enlace.href = window.URL.createObjectURL(blob);
            enlace.download = `datos_ambientales_${fecha}.csv`;
            enlace.click();
            window.URL.revokeObjectURL(enlace.href);

        } catch (error) {
            setErrorMensaje("No se pudo conectar con el servidor. Verifica la conexión.");
            console.error(error);
        }
    };

    return (
        <div>
            <div className="volverContainer">
                <button onClick={() => window.history.back()} className="btnVolver">
                    ← Volver
                </button>
            </div>

            <div className="dataDownloadContainer">
                <h1 className="tituloPrincipal">DESCARGA LOS DATOS AMBIENTALES</h1>

                <div className="contenidoPrincipal">
                    <div className="seccionDescarga">
                        <p className="descripcion">
                            Selecciona una fecha para descargar todos los datos registrados de calidad del aire en formato CSV.
                        </p>

                        <div className="fechaSection">
                            <label className="etiqueta">Fecha</label>
                            <div className="fechaSelectores">
                                <select
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="selectFecha"
                                >
                                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    className="selectFecha"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                        <option key={m} value={m}>
                                            {m.toString().padStart(2, "0")}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={day}
                                    onChange={(e) => setDay(Number(e.target.value))}
                                    className="selectFecha"
                                >
                                    {Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1).map((d) => (
                                        <option key={d} value={d}>
                                            {d.toString().padStart(2, "0")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* mensaje de error */}
                        {errorMensaje && (
                            <p className="mensajeError">{errorMensaje}</p>
                        )}

                        <button onClick={handleDownload} className="btnDescargar">
                            Descargar CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataDownload;
