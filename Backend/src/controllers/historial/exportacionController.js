import Dato from '../../models/dataModel.js';
import { Parser } from 'json2csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
const limitesResolucion = {
  co: 10000,
  pm1: 50,
  pm25: 25,
  pm10: 50,
  temperatura: 35,
  presion: 1013
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

    const datos = await Dato.find({
      timestamp: { $regex: `^${fecha}` }
    }).sort({ timestamp: 1 }).lean();

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

export const generarComparacionDiasReportePDF = async (req, res) => {
  try {
    const { fecha1, fecha2 } = req.query;

    if (!fecha1 || !fecha2) {
      return res.status(400).json({ error: 'Debe proporcionar ambas fechas: fecha1 y fecha2' });
    }

    const variables = ['co', 'pm1', 'pm2_5', 'pm10', 'temperatura', 'presion'];

    const fechas = [fecha1, fecha2];

    const pipeline = [
      {
        $match: {
          $or: fechas.map(f => ({
            timestamp: { $regex: `^${f}` }
          }))
        }
      },
      {
        $group: {
          _id: { $substr: ['$timestamp', 0, 10] },
          co: { $avg: '$co' },
          pm1: { $avg: '$pm1' },
          pm2_5: { $avg: '$pm2_5' },
          pm10: { $avg: '$pm10' },
          temperatura: { $avg: '$temperatura' },
          presion: { $avg: '$presion' }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const resultados = await Dato.aggregate(pipeline);

    if (resultados.length === 0) {
      return res.status(404).json({ error: 'No existen registros para las fechas proporcionadas' });
    }

    const datosPorFecha = {};
    resultados.forEach(r => {
      datosPorFecha[r._id] = r; 
    });

    const limitesResolucion = {
      co: 10000,
      pm1: 50,
      pm25: 25,
      pm10: 50,
      temperatura: 35,
      presion: 1013
    };

    const dataTabla = variables.map(v => {
      const valor1 = datosPorFecha[fecha1] ? datosPorFecha[fecha1][v] : null;
      const valor2 = datosPorFecha[fecha2] ? datosPorFecha[fecha2][v] : null;

      const promedio1 = valor1 != null ? parseFloat(valor1.toFixed(2)) : 'N/A';
      const promedio2 = valor2 != null ? parseFloat(valor2.toFixed(2)) : 'N/A';

      let diferencia = 'N/A';
      if (valor1 != null && valor2 != null) {
        diferencia = parseFloat(Math.abs(valor1 - valor2).toFixed(2));
      }

      const variableFormato = v === 'pm2_5' ? 'PM2_5' : v.toUpperCase();


      const clave = v === 'pm2_5' ? 'pm25' : v;
      const estado1 = typeof promedio1 === 'number' ? (promedio1 > limitesResolucion[clave] ? 'Supera el límite' : 'Dentro del límite') : 'Sin datos';
      const estado2 = typeof promedio2 === 'number' ? (promedio2 > limitesResolucion[clave] ? 'Supera el límite' : 'Dentro del límite') : 'Sin datos';

      return [variableFormato, promedio1, estado1, promedio2, estado2, diferencia];
    });


    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`Reporte Comparativo entre ${fecha1} y ${fecha2}`, 14, 20);
    doc.setFontSize(11);
    doc.text('Comparación de promedios y diferencia absoluta de variables', 14, 28);

    autoTable(doc, {
      startY: 40,
      head: [['Variable', `Promedio ${fecha1}`, 'Estado', `Promedio ${fecha2}`, 'Estado', `Diferencia entre ${fecha1} y ${fecha2}`]],
      body: dataTabla
    });

    const nombreArchivo = `comparacion_dias_${fecha1}_vs_${fecha2}.pdf`;
    const pdfBuffer = doc.output('arraybuffer');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('Error al generar el reporte comparativo:', error);
    res.status(500).json({ error: 'Error interno al generar el reporte comparativo PDF' });
  }
};

export const generarReportePDF = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio) {
      return res.status(400).json({ error: 'Debe proporcionar al menos una fecha de inicio' })
    }

    const variables = ['co', 'pm1', 'pm2_5', 'pm10', 'temperatura', 'presion'];
    let matchStage;
    if (fechaFin) {
      matchStage = {
        $match: {
          $and: [
            { timestamp: { $gte: `${fechaInicio} 00:00:00` } },
            { timestamp: { $lte: `${fechaFin} 23:59:59` } }
          ]
        }
      };
    } else {
      matchStage = {
        $match: {
          timestamp: { $regex: `^${fechaInicio}` }
        }
      };
    }

    const pipeline = [
      matchStage,
      {
        $group: {
          _id: { $substr: ['$timestamp', 0, 10] },
          co: { $avg: '$co' },
          pm1: { $avg: '$pm1' },
          pm2_5: { $avg: '$pm2_5' },
          pm10: { $avg: '$pm10' },
          temperatura: { $avg: '$temperatura' },
          presion: { $avg: '$presion' }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const resultados = await Dato.aggregate(pipeline);

    if (resultados.length === 0) {
      return res.status(404).json({ error: 'No existen registros para el rango de fechas proporcionadas' });
    }


    const doc = new jsPDF();
    const rangoTexto = fechaFin && fechaInicio !== fechaFin ? `${fechaInicio} a ${fechaFin}` : fechaInicio;
    doc.setFontSize(14);
    doc.text(`Reporte de Calidad del Aire - ${rangoTexto}`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Comparación con la resolución 2254 de 2017`, 14, 28);

    resultados.forEach((dia, index) => {
      if (index > 0) doc.addPage();

      const fechaDia = dia._id;
      doc.setFontSize(12);
      doc.text(`Reporte del día: ${fechaDia}`, 14, 40);

      const dataTabla = variables.map(variable => {
        const valor = variable === 'pm2_5' ? dia.pm2_5 : dia[variable];
        const promedio = valor ? parseFloat(valor.toFixed(2)) : 'N/A';
        const clave = variable === 'pm2_5' ? 'pm25' : variable;
        const limite = limitesResolucion[clave];
        const estado = typeof promedio === 'number' ? (promedio > limite ? 'Supera el límite' : 'Dentro del límite') : 'Sin datos';
        return [
          clave.toUpperCase(),
          promedio, `${limite}`,
          estado
        ];
      });

      autoTable(doc, {
        startY: 50,
        head: [['Variable', 'Promedio', 'Límite (Resolución 2254)', 'Estado']],
        body: dataTabla,
      });
      doc.text(`Este reporte resume los valores promedio diarios de las principales variables de la calidad del aire`, 14,
        doc.lastAutoTable.finalY + 10
      );
    });
    const nombreArchivo = fechaFin
      ? `reporte_${fechaInicio}_a_${fechaFin}.pdf`
      : `reporte_${fechaInicio}.pdf`;

    const pdfBuffer = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (error) {
    console.error('Error al generar el reporte:', error);
    res.status(500).json({ error: 'Error interno al generar el reporte PDF' });
  }
};