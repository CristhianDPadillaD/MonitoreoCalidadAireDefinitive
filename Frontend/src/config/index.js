export const VARIABLES = [
  {
    key: "pm2_5",
    label: "PM2.5",
    unit: "µg/m³",
    min: 0,
    max: 150,
    thresholds: [ // personaliza según normativa
      { label: "Muy bueno", max: 12, color: "bg-green-500" },
      { label: "Bueno",     max: 35.4, color: "bg-lime-400" },
      { label: "Regular",   max: 55.4, color: "bg-yellow-400" },
      { label: "Malo",      max: 150, color: "bg-red-400" }
    ]
  },
  {
    key: "co",
    label: "Monóxido de Carbono (CO)",
    unit: "ppm",
    min: 0,
    max: 10,
    thresholds: [
      { label: "Bueno", max: 4.4, color: "bg-green-500" },
      { label: "Regular", max: 9.4, color: "bg-yellow-400" },
      { label: "Malo", max: 10, color: "bg-red-400" },
    ]
  },
  // añade pm1, pm10, temperatura, presion...
]