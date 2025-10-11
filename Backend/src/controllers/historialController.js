import Dato from '../models/dataModel.js';

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
      return res.status(404).json({ error: 'No se encontró historial' });
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

export const getPromediosPorDia = async (req, res) => {
  try {
    const { variable, dias } = req.query;
    if (!variable || !dias) {
      return res.status(400).json({ error: 'Variable o días no proporcionados' });
    }
    const diasArray = dias.split(',');
    const fieldMap = {
      co: 'co',
      pm1: 'pm1',
      pm25: 'pm2_5',
      pm10: 'pm10',
      temperatura: 'temperatura',
      presion: 'presion'
    };
    const campo = fieldMap[variable] || variable;
    const diasCoincidentes = diasArray.map(d => ({ $expr: { $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, d] } }));
    const canalizacionAgregacion = [
      { $match: { $or: diasCoincidentes, [campo]: { $ne: null, $type: 'number' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
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
      { $sort: { dia: 1 } }
    ];
    const promediosCalculados = await Dato.aggregate(canalizacionAgregacion);
    const resultado = diasArray.map(dia => {
      const promedio = promediosCalculados.find(p => p.dia === dia);
      return { dia, promedio: promedio ? parseFloat(promedio.promedio.toFixed(2)) : 0 };
    });
    res.json(resultado);
  } catch (error) {
    console.error('Error en promedio por día:', error);
    res.status(500).json({ error: 'Error al calcular promedio' });
  }
};

export const obtenerDiasPorVariable = async (req, res) => {
  try {
    const { variable } = req.query;
    if (!variable) {
      return res.status(400).json({ error: 'Falta el parámetro variable' });
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
    const flujoAgregacion = [
      { $match: { [campo]: { $ne: null, $type: 'number' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
        }
      },
      {
        $group: {
          _id: null,
          dias: { $addToSet: '$_id' }
        }
      },
      { $project: { _id: 0, diasConVariable: '$dias' } }
    ];
    const resultado = await Dato.aggregate(flujoAgregacion);
    res.json(resultado[0]?.diasConVariable || []);
  } catch (error) {
    console.error('Error al obtener días por variable:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getDatosPorDia = async (req, res) => {
  try {
    const { variable, dias } = req.query;
    if (!variable || !dias) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }
    const diasArray = dias.split(',');
    const fieldMap = {
      co: 'co',
      pm1: 'pm1',
      pm25: 'pm2_5',
      pm10: 'pm10',
      temperatura: 'temperatura',
      presion: 'presion'
    };
    const campo = fieldMap[variable] || variable;
    const resultadosPorDia = {};
    for (const dia of diasArray) {
      const inicio = new Date(dia + 'T00:00:00');
      const fin = new Date(dia + 'T23:59:59');
      const registros = await Dato.find({
        createdAt: { $gte: inicio, $lte: fin },
        [campo]: { $ne: null, $type: 'number' }
      }).sort({ createdAt: 1 }).lean();
      const datosDelDia = registros.map(r => ({
        hora: r.createdAt.toTimeString().split(' ')[0],
        valor: r[campo]
      }));
      resultadosPorDia[dia] = datosDelDia;
    }
    res.json(resultadosPorDia);
  } catch (error) {
    console.error('Error en getDatosPorDia:', error);
    res.status(500).json({ error: 'Error al obtener datos por día' });
  }
};

const obtenerCategoria = (promedio, umbrales) => {
  if (promedio === null || promedio === undefined) return 'N/A';
  if (promedio < umbrales.bueno) return 'bueno';
  if (promedio <= umbrales.malo) return 'regular';
  return 'malo';
};

export const getCalidadAire = async (req, res) => {
  try {
    const horas = parseInt(req.query.hours) || 1;
    const fechaDesde = new Date(Date.now() - horas * 60 * 60 * 1000);

    const flujoAgregacion = [
      { $match: { createdAt: { $gte: fechaDesde } } },
      {
        $group: {
          _id: null,
          promedioCo: { $avg: '$co' },
          promedioPm1: { $avg: '$pm1' },
          promedioPm25: { $avg: '$pm2_5' },
          promedioPm10: { $avg: '$pm10' },
          conteoCo: { $sum: { $cond: [{ $and: [{ $ne: ['$co', null] }, { $ne: ['$co', NaN] }] }, 1, 0] } },
          conteoPm1: { $sum: { $cond: [{ $and: [{ $ne: ['$pm1', null] }, { $ne: ['$pm1', NaN] }] }, 1, 0] } },
          conteoPm25: { $sum: { $cond: [{ $and: [{ $ne: ['$pm2_5', null] }, { $ne: ['$pm2_5', NaN] }] }, 1, 0] } },
          conteoPm10: { $sum: { $cond: [{ $and: [{ $ne: ['$pm10', null] }, { $ne: ['$pm10', NaN] }] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          co: {
            promedio: { $cond: [{ $eq: ['$conteoCo', 0] }, null, '$promedioCo'] }
          },
          pm1: {
            promedio: { $cond: [{ $eq: ['$conteoPm1', 0] }, null, '$promedioPm1'] }
          },
          pm25: {
            promedio: { $cond: [{ $eq: ['$conteoPm25', 0] }, null, '$promedioPm25'] }
          },
          pm10: {
            promedio: { $cond: [{ $eq: ['$conteoPm10', 0] }, null, '$promedioPm10'] }
          }
        }
      }
    ];

    const resultado = await Dato.aggregate(flujoAgregacion);
    const datos = resultado[0] || { co: { promedio: null }, pm1: { promedio: null }, pm25: { promedio: null }, pm10: { promedio: null } };

    const umbrales = {
      co: { bueno: 17.5, malo: 35 },
      pm1: { bueno: 25, malo: 50 },
      pm25: { bueno: 25, malo: 50 },
      pm10: { bueno: 50, malo: 100 }
    };

    const co = { promedio: datos.co.promedio, category: obtenerCategoria(datos.co.promedio, umbrales.co) };
    const pm1 = { promedio: datos.pm1.promedio, category: obtenerCategoria(datos.pm1.promedio, umbrales.pm1) };
    const pm25 = { promedio: datos.pm25.promedio, category: obtenerCategoria(datos.pm25.promedio, umbrales.pm25) };
    const pm10 = { promedio: datos.pm10.promedio, category: obtenerCategoria(datos.pm10.promedio, umbrales.pm10) };

    const categorias = [co.category, pm1.category, pm25.category, pm10.category].filter(c => c !== 'N/A');
    const calidadGeneral = categorias.length > 0 ? categorias.reduce((peor, cat) => {
      if (cat === 'malo') return 'malo';
      if (cat === 'regular' && peor !== 'malo') return 'regular';
      return peor;
    }, 'bueno') : 'N/A';

    res.json({ co, pm1, pm25, pm10, overall: calidadGeneral, period: `${horas}h` });
  } catch (error) {
    console.error('Error al obtener calidad del aire:', error);
    res.status(500).json({ error: 'Error al calcular calidad del aire' });
  }
};
