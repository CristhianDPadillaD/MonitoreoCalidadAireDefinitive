import express from 'express';
import {
  getUltimoDato,
  getUltimosPorVariable
} from '../controllers/historial/historicoController.js';


import{
  getPromedioDiaActual,
  getPromedioPorHoras,
  getPromedioUltimos7Dias,
  getPromedioMensual,
  getDesviacionEstandarDiaActual,
  getCuartilesDiaActual
}from '../controllers/historial/estadisticasController.js';

import {
  getDatosCrudosDia,
  generarReportePDF,
  generarComparacionDiasReportePDF
} from '../controllers/historial/exportacionController.js';

const router = express.Router();


// Últimos datos completos
router.get('/ultimo', getUltimoDato);

// Últimos 10 valores por contaminante
router.get('/ultimosDatos', getUltimosPorVariable);

// Agregaciones
router.get('/promedio-dia', getPromedioDiaActual);
router.get('/promedio-hora', getPromedioPorHoras);
router.get('/promedio-semana', getPromedioUltimos7Dias);
router.get('/promedio-mes', getPromedioMensual);
router.get('/desviacion-estandar-dia', getDesviacionEstandarDiaActual);
router.get('/cuartiles-dia', getCuartilesDiaActual);


// Descarga de datos
router.get('/descargar-csv', getDatosCrudosDia);
router.get('/generar-pdf', generarReportePDF);
router.get('/comparacion-dias-pdf', generarComparacionDiasReportePDF);

export default router;
