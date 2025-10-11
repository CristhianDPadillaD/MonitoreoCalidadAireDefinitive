export const VARIABLES = [
  {
    key: "co",
    label: "Monóxido de carbono (CO)",
    unit: "ppm",
    min: 0,
    max: 50,
    thresholds: [10, 25, 40],
    size: "large",
    color: "#4caf50"
  },
  {
    key: "pm10",
    label: "Material particulado (PM)",
    unit: "µg/m³",
    min: 0,
    max: 150,
    thresholds: [50, 100, 150],
    size: "medium",
    color: "#2196f3"
  }
];