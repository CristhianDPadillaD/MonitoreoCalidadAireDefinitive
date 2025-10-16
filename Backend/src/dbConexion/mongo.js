import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout para seleccionar servidor
      connectTimeoutMS: 10000, // Timeout para conexión inicial
      socketTimeoutMS: 45000, // Timeout para operaciones de socket
      maxPoolSize: 10, // Máximo número de conexiones en el pool
      serverSelectionTimeoutMS: 5000, // Reintento de selección de servidor
      family: 4 // Usar IPv4
    });
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};

export default conectarDB;
