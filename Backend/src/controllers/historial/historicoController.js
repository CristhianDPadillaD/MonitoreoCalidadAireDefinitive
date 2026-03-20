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

export const getUltimosPorVariable = async (req, res) => {
  try {
    const { variable } = req.query; 
    const cantidad = parseInt(req.query.n) || 10;
    const horas = parseInt(req.query.hours) || 0;

    let registros;

    if (horas > 0) {
      registros = await obtenerRecientes(horas, cantidad * 10);
    } else {
      registros = await obtenerHistorico(cantidad * 10);
    }

    // Validar que la variable exista
    const variablesValidas = [
      'co',
      'pm1',
      'pm2_5',
      'pm10',
      'temperatura',
      'presion'
    ];

    if (!variablesValidas.includes(variable)) {
      return res.status(400).json({ error: 'Variable no válida' });
    }

    const datos = registros
      .map(r => ({
        valor: r[variable],
        timestamp: r.timestamp
      }))
      .filter(v => typeof v.valor === 'number' && v.valor !== null && !isNaN(v.valor))
      .slice(0, cantidad)
      .reverse();

    if (datos.length === 0) {
      return res.status(404).json({ error: 'No hay datos registrados para esta variable' });
    }

    res.json({ [variable]: datos });

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos' });
  }
};

