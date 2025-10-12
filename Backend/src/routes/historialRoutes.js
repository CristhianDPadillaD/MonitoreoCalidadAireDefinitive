import express from 'express';
import {
  getUltimoDato,
  getUltimosCO,
  getUltimosPM1,
  getUltimosPM25,
  getUltimosPM10,
  getUltimasTemperaturas,
  getUltimasPresiones,
  getPromedioDiaActual,
  getPromedioUltimos7Dias
} from '../controllers/historialController.js';

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

export default router;
