import mongoose from "mongoose";


const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 10000, 
      socketTimeoutMS: 45000, 
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 5000, 
      family: 4
    });
    console.log(" Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};

export default conectarDB;
