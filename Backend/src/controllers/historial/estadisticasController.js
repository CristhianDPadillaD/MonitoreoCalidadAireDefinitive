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
    const hoy = new Date().toLocaleDateString('sv-SE');
    const canalizacionAgregacion = [
      { $match: { $expr: { $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, hoy] }, [campo]: { $ne: null, $type: 'number' } } },
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

export const getComparacionDias = async (req, res) => {
  try {
    const { fecha1, fecha2, variable } = req.query;

    if (!fecha1 || !fecha2 || !variable) {
      return res.status(400).json({ error: 'fecha1, fecha2 y variable son requeridos' });
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

    const pipeline = [
      {
        $match: {
          $expr: {
            $or: [
              { $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, fecha1] },
              { $eq: [{ $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, fecha2] }
            ]
          },
          [campo]: { $ne: null, $type: 'number' }
        }
      },
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
      }
    ];

    const resultados = await Dato.aggregate(pipeline);

    let promedio1 = null;
    let promedio2 = null;

    resultados.forEach(r => {
      if (r.dia === fecha1) {
        promedio1 = parseFloat(r.promedio.toFixed(2));
      } else if (r.dia === fecha2) {
        promedio2 = parseFloat(r.promedio.toFixed(2));
      }
    });

    const respuesta = {
      fecha1: fecha1,
      promedio1: promedio1,
      fecha2: fecha2,
      promedio2: promedio2
    };

    res.json(respuesta);
  } catch (error) {
    console.error('Error en getComparacionDias:', error);
    res.status(500).json({ error: 'Error al calcular comparación de días' });
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

    const hoy = new Date().toLocaleDateString('sv-SE');

    const datos = await Dato.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              hoy
            ]
          },
          [campo]: { $ne: null, $type: "number" }
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
              { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
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

    const [Q1, Q2, Q3] = resultadoCuartiles[0].cuartiles;


    const IQR = Q3 - Q1;

    const limiteInferior = Q1 - 1.5 * IQR;
    const limiteSuperior = Q3 + 1.5 * IQR;

    const whiskerMin = Math.min(...valores.filter(v => v >= limiteInferior));
    const whiskerMax = Math.max(...valores.filter(v => v <= limiteSuperior));

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