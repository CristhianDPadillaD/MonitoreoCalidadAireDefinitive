import Dato from '../../models/dataModel.js';

export const obtenerRecientes = async (horas = 24, limite = 100) => {
  const fechaDesde = new Date(Date.now() - horas * 60 * 60 * 1000);
  return await Dato.find({ createdAt: { $gte: fechaDesde } }).sort({ createdAt: -1 }).limit(limite).lean();
};

export const obtenerHistorico = async (limite = 100) => {
  return await Dato.find().sort({ createdAt: -1 }).limit(limite).lean();
};