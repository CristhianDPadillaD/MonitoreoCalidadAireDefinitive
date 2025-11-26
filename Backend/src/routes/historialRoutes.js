import express from 'express';
import {
  getUltimoDato,
  getUltimosCO,
  getUltimosPM1,
  getUltimosPM25,
  getUltimosPM10,
  getUltimasTemperaturas,
  getUltimasPresiones
} from '../controllers/historial/historicoController.js';


import{
  getPromedioDiaActual,
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

// Últimos N valores por contaminante
router.get('/ultimos/co', getUltimosCO);
router.get('/ultimos/pm1', getUltimosPM1);
router.get('/ultimos/pm25', getUltimosPM25);
router.get('/ultimos/pm10', getUltimosPM10);

// Otras variables
router.get('/ultimas/temperaturas', getUltimasTemperaturas);
router.get('/ultimas/presiones', getUltimasPresiones);

// Agregaciones
router.get('/promedio-dia', getPromedioDiaActual);
router.get('/promedio-semana', getPromedioUltimos7Dias);
router.get('/promedio-mes', getPromedioMensual);
router.get('/desviacion-estandar-dia', getDesviacionEstandarDiaActual);
router.get('/cuartiles-dia', getCuartilesDiaActual);


// Descarga de datos
router.get('/descargar-csv', getDatosCrudosDia);
router.get('/generar-pdf', generarReportePDF);
router.get('/comparacion-dias-pdf', generarComparacionDiasReportePDF);

export default router;
