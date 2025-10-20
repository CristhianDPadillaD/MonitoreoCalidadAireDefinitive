const nivelesPorVariable = {
  pm1: [
    { color: "#c3f5c3", label: "Buena", rango: [0, 5] },
    { color: "#ecec93", label: "Aceptable", rango: [5, 10] },
    { color: "#e7c39f", label: "Dañina para grupos sensibles", rango: [10, 15] },
    { color: "#eba8a8", label: "Dañina para la salud", rango: [15, 25] },
    { color: "#d4afe9", label: "Muy dañina", rango: [25, 40] },
    { color: "#aa9d90", label: "Peligrosa", rango: [40, 9999] },
  ],
  "pm2_5": [
    { color: "#c3f5c3", label: "Buena", rango: [0, 12] },
    { color: "#ecec93", label: "Aceptable", rango: [12, 35.4] },
    { color: "#e7c39f", label: "Dañina para grupos sensibles", rango: [35.5, 55.4] },
    { color: "#eba8a8", label: "Dañina para la salud", rango: [55.5, 150.4] },
    { color: "#d4afe9", label: "Muy dañina", rango: [150.5, 250.4] },
    { color: "#aa9d90", label: "Peligrosa", rango: [250.5, 9999] },
  ],
  pm10: [
    { color: "#c3f5c3", label: "Buena", rango: [0, 54] },
    { color: "#ecec93", label: "Aceptable", rango: [55, 154] },
    { color: "#e7c39f", label: "Dañina para grupos sensibles", rango: [155, 254] },
    { color: "#eba8a8", label: "Dañina para la salud", rango: [255, 354] },
    { color: "#d4afe9", label: "Muy dañina", rango: [355, 424] },
    { color: "#aa9d90", label: "Peligrosa", rango: [425, 9999] },
  ],
  co: [
    { color: "#c3f5c3", label: "Buena", rango: [0, 4.4] },
    { color: "#ecec93", label: "Aceptable", rango: [4.5, 9.4] },
    { color: "#e7c39f", label: "Dañina para grupos sensibles", rango: [9.5, 12.4] },
    { color: "#eba8a8", label: "Dañina para la salud", rango: [12.5, 15.4] },
    { color: "#d4afe9", label: "Muy dañina", rango: [15.5, 30.4] },
    { color: "#aa9d90", label: "Peligrosa", rango: [30.5, 9999] },
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

export default nivelesPorVariable;
