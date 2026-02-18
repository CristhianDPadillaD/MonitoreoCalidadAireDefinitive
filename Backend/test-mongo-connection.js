import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { promisify } from 'util';

dotenv.config();

const resolveDns = promisify(dns.resolve4);

async function testConnection() {
  console.log('🔍 Diagnóstico de conexión MongoDB\n');
  
  // 1. Verificar MONGO_URI
  const mongoUri = process.env.MONGO_URI;
  console.log('📋 MONGO_URI cargada:', mongoUri ? 'Sí ✓' : 'No ✗');
  
  if (mongoUri) {
    // Extraer el host de la URI
    const hostMatch = mongoUri.match(/@(.+?)\//);
    if (hostMatch) {
      const host = hostMatch[1];
      console.log('🌐 Host del cluster:', host);
      
      // 2. Probar resolución DNS
      try {
        const addresses = await resolveDns(host);
        console.log('✅ DNS resuelve correctamente a:', addresses.join(', '));
      } catch (dnsError) {
        console.error('❌ Error de DNS:', dnsError.message);
        console.error('\n⚠️  PROBLEMA IDENTIFICADO:');
        console.error('   El nombre del cluster no se puede resolver.');
        console.error('   Posibles causas:');
        console.error('   1. El cluster no existe en MongoDB Atlas');
        console.error('   2. El cluster está pausado');
        console.error('   3. El nombre del cluster es incorrecto\n');
        console.error('   📝 SOLUCIÓN:');
        console.error('   1. Ve a https://cloud.mongodb.com/');
        console.error('   2. Verifica que tu cluster esté activo');
        console.error('   3. Haz clic en "Connect" → "Connect your application"');
        console.error('   4. Copia el connection string exacto\n');
        return;
      }
    }
    
    // 3. Intentar conectar
    console.log('\n🔌 Intentando conectar a MongoDB...');
    try {
      await mongoose.connect(mongoUri, {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
      });
      console.log('✅ ¡Conexión exitosa!');
      await mongoose.connection.close();
      console.log('👍 Todo funcionando correctamente');
    } catch (error) {
      console.error('❌ Error de conexión:', error.message);
      console.error('\nCódigo de error:', error.code);
      console.error('Nombre del error:', error.name);
    }
  } else {
    console.error('❌ No se encontró MONGO_URI en el archivo .env');
  }
}

testConnection().catch(console.error);
