import mongoose from 'mongoose';

const datoSchema = new mongoose.Schema({
    timestamp: {
        type: String, // Usamos String para que coincida con lo que envía el ESP32
        required: true
    },
    temperatura: Number,
    humedad: Number,
    presion: Number,
    temp_lp: Number,
    co: Number,
    pm1: Number,
    pm2_5: Number,
    pm10: Number
}, {
    timestamps: true, // Esto agrega automáticamente las fechas de creación/actualización
    versionKey: false
});

const Dato = mongoose.model('Dato', datoSchema);

export default Dato;