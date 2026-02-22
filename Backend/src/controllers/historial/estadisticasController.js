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


    const hoy = new Date().toISOString().slice(0, 10);

    const canalizacionAgregacion = [
      {
        $match: {
          timestamp: { $regex: `^${hoy}` },
          [campo]: { $ne: null, $type: 'number' }
        }
      },
      {
        $group: {
          _id: null,
          suma: { $sum: `$${campo}` },
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          promedio: { $cond: [{ $gt: ['$cantidad', 0] }, { $divide: ['$suma', '$cantidad'] }, null] },
          _id: 0
        }
      }
    ];

    const resultadoAgregacion = await Dato.aggregate(canalizacionAgregacion);
    const diaStr = hoy;
    if (resultadoAgregacion.length === 0 || resultadoAgregacion[0].promedio === null) {
      return res.json({ dia: diaStr, promedio: null });
    }
    const promedio = parseFloat(resultadoAgregacion[0].promedio.toFixed(2));
    res.json({ dia: diaStr, promedio });
  } catch (error) {
    console.error('Error en promedio día actual:', error);
    res.status(500).json({ error: 'Error al calcular promedio' });
  }
};
export const getPromedioPorHoras = async (req, res) => {
  try {
    const { variable } = req.query;
    let { fecha } = req.query;

    if (!variable) {
      return res.status(400).json({
        error: 'Debe proporcionar la variable'
      });
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

    // 🔥 Si no envían fecha, usar día actual (zona Colombia)
    if (!fecha) {
      fecha = new Date().toLocaleDateString('sv-SE', {
        timeZone: 'America/Bogota'
      });
    }

    const pipeline = [
      {
        $match: {
          timestamp: { $regex: `^${fecha}` },
          [campo]: { $ne: null, $type: 'number' }
        }
      },
      {
        $group: {
          _id: {
            hora: { $substr: ['$timestamp', 11, 2] }
          },
          suma: { $sum: `$${campo}` },
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          hora: '$_id.hora',
          promedio: {
            $cond: [
              { $gt: ['$cantidad', 0] },
              { $divide: ['$suma', '$cantidad'] },
              null
            ]
          },
          _id: 0
        }
      },
      { $sort: { hora: 1 } }
    ];

    const resultados = await Dato.aggregate(pipeline);
    if (resultados.length === 0) {
  return res.status(404).json({
    fecha,
    variable,
    mensaje: `No existen datos registrados para el día ${fecha}`
  });
}

    const respuesta = resultados.map(r => ({
      hora: `${r.hora}:00`,
      promedio: r.promedio !== null
        ? parseFloat(r.promedio.toFixed(2))
        : null
    }));

    res.json({
      fecha,
      variable,
      horas: respuesta
    });

  } catch (error) {
    console.error('Error en promedio por horas:', error);
    res.status(500).json({ error: 'Error al calcular promedio por horas' });
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
    const hoy = new Date();
    const fechas = [];

    for (let i = 0; i < 7; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() - i);
      fechas.push(fecha.toISOString().slice(0, 10));
    }
    const canalizacionAgregacion = [
      {
        $match: {
          $or: fechas.map(f => ({
            timestamp: { $regex: `^${f}` }
          })),
          [campo]: { $ne: null, $type: 'number' }
        }
      },
      {
        $group: {
          _id: { $substr: ['$timestamp', 0, 10] },
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
    console.error('Error en promedio mensual:', error);
    res.status(500).json({ error: 'Error al calcular promedio mensual' });
  }
};

export const getDesviacionEstandarDiaActual = async (req, res) => {
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
    const hoy = new Date().toISOString().slice(0, 10);
    const canalizacionAgregacion = [
      {
        $match: {
          timestamp: { $regex: `^${hoy}` },
          [campo]: { $ne: null, $type: 'number' }
        }
      },
      {
        $group: {
          _id: null,
          valores: { $push: `$${campo}` },
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          desviacionEstandar: {
            $cond: {
              if: { $gt: ['$cantidad', 1] },
              then: {
                $sqrt: {
                  $divide: [
                    { $sum: { $map: { input: '$valores', as: 'val', in: { $pow: [{ $subtract: ['$$val', { $avg: '$valores' }] }, 2] } } } },
                    { $subtract: ['$cantidad', 1] }
                  ]
                }
              },
              else: null
            }
          },
          _id: 0
        }
      }
    ];
    const resultadoAgregacion = await Dato.aggregate(canalizacionAgregacion);
    if (resultadoAgregacion.length === 0 || resultadoAgregacion[0].desviacionEstandar === null) {
      return res.json({ dia: hoy, desviacionEstandar: null });
    }
    const desviacionEstandar = parseFloat(resultadoAgregacion[0].desviacionEstandar.toFixed(2));
    res.json({ dia: hoy, desviacionEstandar });
  } catch (error) {
    console.error('Error en desviación estándar día actual:', error);
    res.status(500).json({ error: 'Error al calcular desviación estándar' });
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


    const canalizacionAgregacion = [
      {
        $match: {
          timestamp: { $regex: `^${mes}` },
          [campo]: { $ne: null, $type: 'number' }
        }
      },
      {
        $group: {
          _id: {
            $substr: ['$timestamp', 0, 10]
          },
          suma: { $sum: `$${campo}` },
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          dia: '$_id',
          promedio: { $cond: [{ $gt: ['$cantidad', 0] }, { $divide: ['$suma', '$cantidad'] }, null] },
          _id: 0
        }
      },
      { $sort: { dia: 1 } }
    ];

    const promediosCalculados = await Dato.aggregate(canalizacionAgregacion);

    if (promediosCalculados.length === 0) {
      return res.json([]);
    }

    const resultado = promediosCalculados.map(p => {
      const fechaLocal = new Date(`${p.dia}T00:00:00-05:00`);
      const diaSemana = fechaLocal
        .toLocaleDateString('es-CO', { weekday: 'short', timeZone: 'America/Bogota' })
        .replace('.', '');
      const diaSemanaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

      return {
        dia: p.dia,
        diaSemana: diaSemanaCapitalizado,
        promedio: p.promedio === null ? null : parseFloat(p.promedio.toFixed(2))
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error('Error en promedio mensual:', error);
    res.status(500).json({ error: 'Error al calcular promedio mensual' });
  }
};

export const getCuartilesDiaActual = async (req, res) => {
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

    const hoy = new Date().toISOString().slice(0, 10);

    const datos = await Dato.aggregate([
      {
        $match: {
          timestamp: { $regex: `^${hoy}` },
          [campo]: { $ne: null, $type: 'number' }
        }
      },
      {
        $project: {
          _id: 0,
          valor: `$${campo}`
        }
      }
    ]);

    if (datos.length === 0) {
      return res.json({
        dia: hoy,
        cuartiles: null
      });
    }

    const valores = datos.map(d => d.valor).sort((a, b) => a - b);

    const resultadoCuartiles = await Dato.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: timeZone } },
              hoy
            ]
          },
          [campo]: { $ne: null, $type: "number" }
        }
      },
      {
        $group: {
          _id: null,
          valores: { $push: `$${campo}` }
        }
      },
      {
        $project: {
          cuartiles: {
            $percentile: {
              input: "$valores",
              p: [0.25, 0.5, 0.75],
              method: "approximate"
            }
          },
          _id: 0
        }
      }
    ]);

    let Q1, Q2, Q3;
    if (resultadoCuartiles.length === 0 || !resultadoCuartiles[0].cuartiles) {
      const quantile = (arr, q) => {
        if (!arr.length) return null;
        const pos = (arr.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        if (arr[base + 1] !== undefined) return arr[base] + rest * (arr[base + 1] - arr[base]);
        return arr[base];
      };
      Q1 = quantile(valores, 0.25);
      Q2 = quantile(valores, 0.5);
      Q3 = quantile(valores, 0.75);
    } else {
      [Q1, Q2, Q3] = resultadoCuartiles[0].cuartiles;
    }

    const IQR = Q3 - Q1;

    const limiteInferior = Q1 - 1.5 * IQR;
    const limiteSuperior = Q3 + 1.5 * IQR;

    const nonOutliers = valores.filter(v => v >= limiteInferior && v <= limiteSuperior);
    const whiskerMin = nonOutliers.length ? Math.min(...nonOutliers) : Math.min(...valores);
    const whiskerMax = nonOutliers.length ? Math.max(...nonOutliers) : Math.max(...valores);

    const valoresAtipicos = valores.filter(v => v < limiteInferior || v > limiteSuperior);

    res.json({
      dia: hoy,
      boxplot: {
        q1: parseFloat(Q1.toFixed(2)),
        q2: parseFloat(Q2.toFixed(2)),
        q3: parseFloat(Q3.toFixed(2)),
        iqr: parseFloat(IQR.toFixed(2)),
        limite_inferior: whiskerMin,
        limite_superior: whiskerMax,
        valoresAtipicos
      }
    });

  } catch (error) {
    console.error("Error en cuartiles día actual:", error);
    res.status(500).json({ error: "Error al calcular cuartiles" });
  }
};

