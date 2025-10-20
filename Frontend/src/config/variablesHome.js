export const VARIABLES = [
  {
    key: "pm2_5",
    label: "PM 2.5 ",
    unit: "µg/m³",
    thresholds: [
      { max: 12, color: "#c3f5c3ff", label: "Buena" },
      { max: 37, color: "#ecec93ff", label: "Aceptable" },
      { max: 55, color: "#e7c39f", label: "Dañina (sensibles)" },
      { max: 150, color: "#eba8a8ff", label: "Dañina" },
      { max: 250, color: "#d4afe9", label: "Muy dañina" },
      { max: 500, color: "#aa9d90", label: "Peligrosa" },
    ],
  },
  {
    key: "co",
    label: "Monóxido de Carbono (CO)",
    unit: "ppm",
    thresholds: [
      { max: 4.4, color: "#c3f5c3ff", label: "Buena" },
      { max: 9.4, color: "#ecec93ff", label: "Aceptable" },
      { max: 12.4, color: "#e7c39f", label: "Dañina (sensibles)" },
      { max: 15.4, color: "#eba8a8ff", label: "Dañina" },
      { max: 30.4, color: "#d4afe9", label: "Muy dañina" },
      { max: 50, color: "#aa9d90", label: "Peligrosa" },
    ],
  },
];