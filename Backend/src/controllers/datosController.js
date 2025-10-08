import Dato from '../models/dataModel.js';

export const guardarDato = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);

    // Crea una nueva instancia del modelo con los datos del ESP32
    const nuevoDato = new Dato(req.body);

    // Guarda el documento en la base de datos
    await nuevoDato.save();

    // Si el guardado es exitoso, este mensaje aparecerá en la consola
    console.log("✅ Datos guardados en MongoDB exitosamente.");
    res.status(201).json({ message: "Datos guardados correctamente" });
    
  } catch (error) {
    // Si hay un error durante el guardado, este mensaje aparecerá
    console.error("❌ Error al guardar en la base de datos:", error.message);
    res.status(500).json({ message: "Error al procesar la solicitud", error: error.message });
  }
};