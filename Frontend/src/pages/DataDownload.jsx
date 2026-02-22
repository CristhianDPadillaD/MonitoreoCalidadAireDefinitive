import React, { useState } from "react";
import "../styles/pages/dataDownload.css";

const DataDownload = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [day, setDay] = useState(new Date().getDate());
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [errorMensaje, setErrorMensaje] = useState("");

    // Estados para rango de fechas
    const [startYear, setStartYear] = useState(new Date().getFullYear());
    const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);
    const [startDay, setStartDay] = useState(new Date().getDate());
    const [endYear, setEndYear] = useState(new Date().getFullYear());
    const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1);
    const [endDay, setEndDay] = useState(new Date().getDate());
    const [errorMensajeRango, setErrorMensajeRango] = useState("");

    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

    const handleDownload = async () => {
        const fecha = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        
        // Construir URL base
        let url = `http://localhost:3000/api/historial/descargar-csv?fechaInicio=${fecha}`;
        
        // Agregar parámetros de hora si están presentes (formato HH:00)
        if (horaInicio) {
            url += `&horaInicio=${horaInicio}:00`;
        }
        if (horaFin) {
            url += `&horaFin=${horaFin}:00`;
        }
        
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

    const handleDownloadRange = async () => {
        const fechaInicio = `${startYear}-${String(startMonth).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;
        const fechaFin = `${endYear}-${String(endMonth).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;
        
        const url = `http://localhost:3000/api/historial/descargar-csv?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        setErrorMensajeRango("");

        try {
            const response = await fetch(url);

            if (response.status === 404) {
                setErrorMensajeRango("El rango de fechas seleccionado no tiene registros disponibles.");
                return;
            }

            if (!response.ok) {
                throw new Error("Error al descargar los datos");
            }

            const blob = await response.blob();

            if (blob.size === 0) {
                setErrorMensajeRango("El rango de fechas seleccionado no tiene registros disponibles.");
                return;
            }

            const enlace = document.createElement("a");
            enlace.href = window.URL.createObjectURL(blob);
            enlace.download = `datos_ambientales_${fechaInicio}_a_${fechaFin}.csv`;
            enlace.click();
            window.URL.revokeObjectURL(enlace.href);

        } catch (error) {
            setErrorMensajeRango("No se pudo conectar con el servidor. Verifica la conexión.");
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

                        <div className="horasSection">
                            <label className="etiqueta">Rango de horas (opcional)</label>
                            <div className="horasSelectores">
                                <div className="inputHoraContainer">
                                    <label className="horaLabel">Hora inicio</label>
                                    <select
                                        value={horaInicio}
                                        onChange={(e) => setHoraInicio(e.target.value)}
                                        className="selectHora"
                                    >
                                        <option value="">--</option>
                                        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                                            <option key={h} value={String(h).padStart(2, "0")}>
                                                {String(h).padStart(2, "0")}:00
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="inputHoraContainer">
                                    <label className="horaLabel">Hora fin</label>
                                    <select
                                        value={horaFin}
                                        onChange={(e) => setHoraFin(e.target.value)}
                                        className="selectHora"
                                    >
                                        <option value="">--</option>
                                        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                                            <option key={h} value={String(h).padStart(2, "0")}>
                                                {String(h).padStart(2, "0")}:00
                                            </option>
                                        ))}
                                    </select>
                                </div>
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

                <div className="contenidoPrincipal" style={{ marginTop: "2rem" }}>
                    <div className="seccionDescarga">
                        <p className="descripcion">
                            O selecciona un rango de fechas para descargar datos de múltiples días en formato CSV.
                        </p>

                        <div className="rangoFechasContainer">
                            <div className="fechaRangoGroup">
                                <label className="etiqueta">Fecha inicio</label>
                                <div className="fechaSelectores">
                                    <select
                                        value={startYear}
                                        onChange={(e) => setStartYear(Number(e.target.value))}
                                        className="selectFecha"
                                    >
                                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={startMonth}
                                        onChange={(e) => setStartMonth(Number(e.target.value))}
                                        className="selectFecha"
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
                                        className="selectFecha"
                                    >
                                        {Array.from({ length: getDaysInMonth(startYear, startMonth) }, (_, i) => i + 1).map((d) => (
                                            <option key={d} value={d}>
                                                {d.toString().padStart(2, "0")}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="fechaRangoGroup">
                                <label className="etiqueta">Fecha fin</label>
                                <div className="fechaSelectores">
                                    <select
                                        value={endYear}
                                        onChange={(e) => setEndYear(Number(e.target.value))}
                                        className="selectFecha"
                                    >
                                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={endMonth}
                                        onChange={(e) => setEndMonth(Number(e.target.value))}
                                        className="selectFecha"
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
                                        className="selectFecha"
                                    >
                                        {Array.from({ length: getDaysInMonth(endYear, endMonth) }, (_, i) => i + 1).map((d) => (
                                            <option key={d} value={d}>
                                                {d.toString().padStart(2, "0")}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {errorMensajeRango && (
                            <p className="mensajeError">{errorMensajeRango}</p>
                        )}

                        <button onClick={handleDownloadRange} className="btnDescargar">
                            Descargar CSV por rango
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataDownload;
