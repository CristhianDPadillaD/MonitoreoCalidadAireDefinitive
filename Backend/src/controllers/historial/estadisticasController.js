import Dato from '../../models/dataModel.js'; 

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