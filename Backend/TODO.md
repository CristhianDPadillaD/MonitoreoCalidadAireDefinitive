# TODO: Implementar HU-4 - Descargar datos crudos en CSV para un día específico

## Pasos a completar:

- [x] Instalar dependencia 'json2csv' para generar archivos CSV
- [x] Agregar función 'getDatosCrudosDia' en src/controllers/historialController.js
- [x] Agregar ruta '/descargar-csv' en src/routes/historialRoutes.js
- [x] Probar el endpoint con fechas con y sin datos
- [x] Verificar que el CSV se descargue correctamente y contenga todas las variables crudas

## Detalles técnicos:

- Endpoint: GET /api/historial/descargar-csv?fecha=YYYY-MM-DD
- Formato archivo: CSV separado por comas
- Columnas: timestamp, temperatura, humedad, presion, temp_lp, co, pm1, pm2_5, pm10
- Si no hay datos: Mensaje "No hay datos disponibles para la fecha seleccionada"
- Si hay datos: Descarga automática con nombre 'datos_crudo_YYYY-MM-DD.csv' y mensaje de confirmación
