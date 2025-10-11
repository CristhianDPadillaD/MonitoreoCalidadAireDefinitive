import Dato from '../models/dataModel.js';

export const guardarDato = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);
    const nuevoDato = new Dato(req.body);
    await nuevoDato.save();

    console.log("✅ Datos guardados en MongoDB exitosamente.");
    res.status(201).json({ message: "Datos guardados correctamente" });
    
  } catch (error) {
    console.error("❌ Error al guardar en la base de datos:", error.message);
    res.status(500).json({ message: "Error al procesar la solicitud", error: error.message });
  }
};