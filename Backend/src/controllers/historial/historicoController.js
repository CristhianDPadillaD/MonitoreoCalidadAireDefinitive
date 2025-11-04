import { obtenerRecientes, obtenerHistorico } from '../utils/consultasHelper.js';
import Dato from '../../models/dataModel.js';



export const getUltimoDato = async (req, res) => {
  try {
    const horas = parseInt(req.query.hours) || 24;
    const registros = await obtenerRecientes(horas, 1);
    if (!registros || registros.length === 0) {
      return res.status(404).json({ error: 'No hay datos recientes disponibles' });
    }
    const ultimoDato = registros[0];
    const createdAt = ultimoDato.createdAt;
    const dia = createdAt.toISOString().split('T')[0];
    const hora = createdAt.toTimeString().split(' ')[0];
    const datosMedicion = { ...ultimoDato };
    delete datosMedicion._id;
    delete datosMedicion.createdAt;
    delete datosMedicion.updatedAt;
    res.json({
      dia,
      hora,
      ...datosMedicion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el último dato' });
  }
};

export const getUltimosCO = async (req, res) => {
  try {
    const cantidad = parseInt(req.query.n) || 10;
    const horas = parseInt(req.query.hours) || 0;
    let registros;
    if (horas > 0) {
      registros = await obtenerRecientes(horas, cantidad * 10);
    } else {
      registros = await obtenerHistorico(cantidad * 10);
    }
    let valoresCo = registros
      .map(r => r.co)
      .filter(v => typeof v === 'number' && v !== null && !isNaN(v))
      .slice(0, cantidad)
      .reverse();
    if (valoresCo.length === 0) {
      return res.status(404).json({ error: 'No hay datos registrados para esta variable' });
    }
    res.json({ co: valoresCo });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener CO' });
  }
};

export const getUltimosPM1 = async (req, res) => {
  try {
    const cantidad = parseInt(req.query.n) || 10;
    const horas = parseInt(req.query.hours) || 0;
    let registros;
    if (horas > 0) {
      registros = await obtenerRecientes(horas, cantidad * 10);
    } else {
      registros = await obtenerHistorico(cantidad * 10);
    }
    let valoresPm1 = registros
      .map(r => r.pm1)
      .filter(v => typeof v === 'number' && v !== null && !isNaN(v))
      .slice(0, cantidad)
      .reverse();
    if (valoresPm1.length === 0) {
      return res.status(404).json({ error: 'No hay datos registrados para esta variable' });
    }
    res.json({ pm1: valoresPm1 });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener PM1' });
  }
};

export const getUltimosPM25 = async (req, res) => {
  try {
    const cantidad = parseInt(req.query.n) || 10;
    const horas = parseInt(req.query.hours) || 0;
    let registros;
    if (horas > 0) {
      registros = await obtenerRecientes(horas, cantidad * 10);
    } else {
      registros = await obtenerHistorico(cantidad * 10);
    }
    let valoresPm25 = registros
      .map(r => r.pm2_5)
      .filter(v => typeof v === 'number' && v !== null && !isNaN(v))
      .slice(0, cantidad)
      .reverse();
    if (valoresPm25.length === 0) {
      return res.status(404).json({ error: 'No hay datos registrados para esta variable' });
    }
    res.json({ pm25: valoresPm25 });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener PM2.5' });
  }
};

export const getUltimosPM10 = async (req, res) => {
  try {
    const cantidad = parseInt(req.query.n) || 10;
    const horas = parseInt(req.query.hours) || 0;
    let registros;
    if (horas > 0) {
      registros = await obtenerRecientes(horas, cantidad * 10);
    } else {
      registros = await obtenerHistorico(cantidad * 10);
    }
    let valoresPm10 = registros
      .map(r => r.pm10)
      .filter(v => typeof v === 'number' && v !== null && !isNaN(v))
      .slice(0, cantidad)
      .reverse();
    if (valoresPm10.length === 0) {
      return res.status(404).json({ error: 'No hay datos registrados para esta variable' });
    }
    res.json({ pm10: valoresPm10 });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener PM10' });
  }
};

export const getUltimasTemperaturas = async (req, res) => {
  try {
    const cantidad = parseInt(req.query.n) || 10;
    const horas = parseInt(req.query.hours) || 0;
    let registros;
    if (horas > 0) {
      registros = await obtenerRecientes(horas, cantidad * 10);
    } else {
      registros = await obtenerHistorico(cantidad * 10);
    }
    let temperaturas = registros
      .map(r => r.temperatura)
      .filter(v => typeof v === 'number' && v !== null && !isNaN(v))
      .slice(0, cantidad)
      .reverse();
    res.json({ temperaturas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener temperaturas' });
  }
};

export const getUltimasPresiones = async (req, res) => {
  try {
    const cantidad = parseInt(req.query.n) || 10;
    const horas = parseInt(req.query.hours) || 0;
    let registros;
    if (horas > 0) {
      registros = await obtenerRecientes(horas, cantidad * 10);
    } else {
      registros = await obtenerHistorico(cantidad * 10);
    }
    let presiones = registros
      .map(r => r.presion)
      .filter(v => typeof v === 'number' && v !== null && !isNaN(v))
      .slice(0, cantidad)
      .reverse();
    res.json({ presiones });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener presiones' });
  }
};
