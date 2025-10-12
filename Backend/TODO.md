# TODO: Modificar método getPromediosPorDia

## Tareas Pendientes

- [x] Agregar el método `getPromedioDiaActual` en `src/controllers/historialController.js` que calcule el promedio de una variable (co, pm1, pm2.5, pm10) para el día actual, recibiendo solo la variable como parámetro en query (?variable=co).
- [x] Eliminar el método `getPromediosPorDia` de `src/controllers/historialController.js`.
- [x] Actualizar `src/routes/historialRoutes.js`: agregar import y ruta para `getPromedioDiaActual` (e.g., /promedio-dia-actual), y eliminar import y ruta de `getPromediosPorDia`.
