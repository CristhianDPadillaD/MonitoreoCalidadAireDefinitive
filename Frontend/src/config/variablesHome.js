export const VARIABLES = [
  {
    key: "pm2_5",
    label: "PM 2.5 (μg/m³)",
    unit: "μg/m³",
    thresholds: [
      { max: 12, color: "#c3f5c3ff", label: "Buena" },
      { max: 37, color: "#ecec93ff", label: "Aceptable" },
      { max: 55, color: "#e7c39f", label: "Dañina (sensibles)" },
      { max: 150, color: "#eba8a8ff", label: "Dañina" }

    ],
  },
  {
    key: "co",
    label: "Monóxido de Carbono (CO) (mg/m³)",
    unit: "mg/m³",
    thresholds: [
      { max: 4.4, color: "#c3f5c3ff", label: "Buena" },
      { max: 9.4, color: "#ecec93ff", label: "Aceptable" },
      { max: 12.4, color: "#e7c39f", label: "Dañina (sensibles)" },
      { max: 15.4, color: "#eba8a8ff", label: "Dañina" }
    ],
  },
];