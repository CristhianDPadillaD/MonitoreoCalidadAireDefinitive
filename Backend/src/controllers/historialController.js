import Dato from '../models/dataModel.js';
import { Parser } from 'json2csv';

const obtenerRecientes = async (horas = 24, limite = 100) => {
  const fechaDesde = new Date(Date.now() - horas * 60 * 60 * 1000);
  return await Dato.find({ createdAt: { $gte: fechaDesde } }).sort({ createdAt: -1 }).limit(limite).lean();
};

const obtenerHistorico = async (limite = 100) => {
  return await Dato.find().sort({ createdAt: -1 }).limit(limite).lean();
};

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

export const getPromedioDiaActual = async (req, res) => {
  try {
    const { variable } = req.query;
    if (!variable) {
      return res.status(400).json({ error: 'Variable no proporcionada' });
    }
    const fieldMap = {
      co: 'co',
      pm1: 'pm1',
      pm25: 'pm2_5',
      pm10: 'pm10',
      temperatura: 'temperatura',
      presion: 'presion'
    };
    const campo = fieldMap[variable] || variable;
    const hoy = new Date().toLocaleDateString('sv-SE');
    const canalizacionAgregacion = [
      { $match: { $expr: { $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, hoy] }, [campo]: { $ne: null, $type: 'number' } } },
      {
        $group: {
          _id: null,
          suma: { $sum: `$${campo}` },
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          promedio: { $divide: ['$suma', '$cantidad'] },
          _id: 0
        }
      }
    ];
    const resultadoAgregacion = await Dato.aggregate(canalizacionAgregacion);
    if (resultadoAgregacion.length === 0) {
      return res.json({ dia: hoy, promedio: null });
    }
    const promedio = parseFloat(resultadoAgregacion[0].promedio.toFixed(2));
    res.json({ dia: hoy, promedio });
  } catch (error) {
    console.error('Error en promedio día actual:', error);
    res.status(500).json({ error: 'Error al calcular promedio' });
  }
};

export const getPromedioUltimos7Dias = async (req, res) => {
  try {
    const { variable } = req.query;
    if (!variable) {
      return res.status(400).json({ error: 'Variable no proporcionada' });
    }

    const fieldMap = {
      co: 'co',
      pm1: 'pm1',
      pm25: 'pm2_5',
      pm10: 'pm10',
      temperatura: 'temperatura',
      presion: 'presion'
    };
    const campo = fieldMap[variable] || variable;
    const fechaDesde = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const canalizacionAgregacion = [
      {
        $match: {
          createdAt: { $gte: fechaDesde },
          [campo]: { $ne: null, $type: 'number' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'America/Bogota'
            }
          },
          suma: { $sum: `$${campo}` },
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          dia: '$_id',
          promedio: { $divide: ['$suma', '$cantidad'] },
          _id: 0
        }
      },
      { $sort: { dia: -1 } },
      { $limit: 7 }
    ];

    const promediosCalculados = await Dato.aggregate(canalizacionAgregacion);

    if (promediosCalculados.length === 0) {
      return res.json([]);
    }

    const resultado = promediosCalculados.map(p => {

      const fechaLocal = new Date(`${p.dia}T00:00:00-05:00`);

      const diaSemana = fechaLocal
        .toLocaleDateString('es-CO', {
          weekday: 'short',
          timeZone: 'America/Bogota'
        })
        .replace('.', ''); 

      const diaSemanaCapitalizado =
        diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

      return {
        dia: p.dia,
        diaSemana: diaSemanaCapitalizado,
        promedio: parseFloat(p.promedio.toFixed(2))
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error('Error en promedio últimos 7 días:', error);
    res.status(500).json({ error: 'Error al calcular promedio' });
  }
};

export const getPromedioMensual = async (req, res) => {
  try {
    const { variable, mes } = req.query;
    if (!variable || !mes) {
      return res.status(400).json({ error: 'Variable y mes no proporcionados' });
    }
    const fieldMap = {
      co: 'co',
      pm1: 'pm1',
      pm25: 'pm2_5',
      pm10: 'pm10',
      temperatura: 'temperatura',
      presion: 'presion'
    };
    const campo = fieldMap[variable] || variable;

    const [year, month] = mes.split('-').map(Number);
    const fechaInicio = new Date(year, month - 1, 1);
    const fechaFin = new Date(year, month, 1);

    const canalizacionAgregacion = [
      {
        $match: {
          createdAt: { $gte: fechaInicio, $lt: fechaFin },
          [campo]: { $ne: null, $type: 'number' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'America/Bogota'
            }
          },
          suma: { $sum: `$${campo}` },
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          dia: '$_id',
          promedio: { $divide: ['$suma', '$cantidad'] },
          _id: 0
        }
      },
      { $sort: { dia: 1 } } // Orden cronológico
    ];

    const promediosCalculados = await Dato.aggregate(canalizacionAgregacion);

    if (promediosCalculados.length === 0) {
      return res.json([]);
    }

    const resultado = promediosCalculados.map(p => {
      const fechaLocal = new Date(`${p.dia}T00:00:00-05:00`);
      const diaSemana = fechaLocal
        .toLocaleDateString('es-CO', {
          weekday: 'short',
          timeZone: 'America/Bogota'
        })
        .replace('.', '');

      const diaSemanaCapitalizado =
        diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

      return {
        dia: p.dia,
        diaSemana: diaSemanaCapitalizado,
        promedio: parseFloat(p.promedio.toFixed(2))
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error('Error en promedio mensual:', error);
    res.status(500).json({ error: 'Error al calcular promedio mensual' });
  }
};
export const getDatosCrudosDia = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ error: 'Fecha no proporcionada. Use el formato YYYY-MM-DD' });
    }

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      return res.status(400).json({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' });
    }

    const fechaInicio = new Date(fecha + 'T00:00:00.000Z');
    const fechaFin = new Date(fecha + 'T23:59:59.999Z');

    const datos = await Dato.find({
      createdAt: { $gte: fechaInicio, $lte: fechaFin }
    }).sort({ createdAt: 1 }).lean();

    if (datos.length === 0) {
      return res.status(404).json({ error: 'No hay datos disponibles para la fecha seleccionada' });
    }

    const datosParaCsv = datos.map(dato => ({
      timestamp: dato.timestamp,
      temperatura: dato.temperatura,
      humedad: dato.humedad,
      presion: dato.presion,
      temp_lp: dato.temp_lp,
      co: dato.co,
      pm1: dato.pm1,
      pm2_5: dato.pm2_5,
      pm10: dato.pm10
    }));

    const parser = new Parser();
    const csv = parser.parse(datosParaCsv);


    const nombreArchivo = `datos_crudo_${fecha}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);


    res.send(csv);

  } catch (error) {
    console.error('Error al descargar datos crudos:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud de descarga' });
  }
};






