const nivelesPorVariable = {
  pm1: [
    { color: "#c3f5c3", label: "Buena", rango: [0, 37.999] },
    { color: "#ecec93", label: "Prevencion", rango: [38, 55.999] },
    { color: "#e7c39f", label: "Alerta", rango: [56, 150.999] },
    { color: "#eba8a8", label: "Emergencia", rango: [151, 9999] }
  ],
  pm25: [
    { color: "#c3f5c3", label: "Buena", rango: [0, 37.999] },
    { color: "#ecec93", label: "Prevencion", rango: [38, 55.999] },
    { color: "#e7c39f", label: "Alerta", rango: [56, 150.999] },
    { color: "#eba8a8", label: "Emergencia", rango: [151, 9999] }
  ],
  pm10: [
    { color: "#c3f5c3", label: "Buena", rango: [0, 54] },
    { color: "#ecec93", label: "Prevencion", rango: [55, 154] },
    { color: "#e7c39f", label: "Alerta", rango: [155, 254] },
    { color: "#eba8a8", label: "Emergencia", rango: [255, 9999] }
  ],
  co: [
    { color: "#c3f5c3", label: "Buena", rango: [0, 4.4] },
    { color: "#ecec93", label: "Prevencion", rango: [4.5, 9.4] },
    { color: "#e7c39f", label: "Alerta", rango: [9.5, 12.4] },
    { color: "#eba8a8", label: "Emergencia", rango: [12.5, 15.4] }
  ],
  presion: [
    { color: "#c3f5c3", label: "Normal", rango: [950, 1020] },
    { color: "#ecec93", label: "Alta", rango: [1021, 1030] },
    { color: "#eba8a8", label: "Baja", rango: [900, 949] },
    { color: "#aa9d90", label: "Extrema", rango: [1031, 9999] },
  ],
  temperatura: [
    { color: "#c3f5c3", label: "Fría", rango: [-5, 10] },
    { color: "#ecec93", label: "Templada", rango: [10, 20] },
    { color: "#e7c39f", label: "Cálida", rango: [20, 28] },
    { color: "#eba8a8", label: "Calurosa", rango: [28, 35] },
    { color: "#aa9d90", label: "Muy caliente", rango: [35, 9999] },
  ],
};

// Límite máximo recomendado por variable para trazar referencias en los gráficos.
const limitesPorVariable = {
  pm1: 151,
  pm25: 151,
  pm10: 255,
  co: 12.5,
  temperatura: 35,
  presion: 1031,
};

const aliasVariable = {
  pm2_5: "pm25",
};

export const obtenerLimiteMaximo = (variable) => {
  const clave = aliasVariable[variable] || variable;
  return limitesPorVariable[clave] ?? null;
};

export { limitesPorVariable };

export default nivelesPorVariable;
