import mongoose from "mongoose";
import dns from "dns";

// Configurar DNS de Google para resolver correctamente MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const conectarDB = async () => {
  try {
    console.log("🔄 Intentando conectar a MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 15000, 
      socketTimeoutMS: 45000, 
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 15000,
      family: 4
    });
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error.message);
    console.error("\n⚠️  Posibles soluciones:");
    console.error("1. Verifica que tu IP esté en la lista blanca de MongoDB Atlas");
    console.error("2. Ve a: https://cloud.mongodb.com/ → Network Access → Add IP Address");
    console.error("3. Verifica que tu MONGO_URI en el archivo .env sea correcta");
    console.error("4. Asegúrate de tener conexión a internet");
    console.error("5. Si el problema persiste, puede ser tu router o ISP bloqueando MongoDB\n");
    process.exit(1);
  }
};

// Manejar eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión con MongoDB:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose desconectado de MongoDB');
});

export default conectarDB;
