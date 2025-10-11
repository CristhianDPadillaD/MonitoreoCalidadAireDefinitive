import mongoose from 'mongoose';

const datoSchema = new mongoose.Schema({
    timestamp: {
        type: String, 
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
    timestamps: true,
    versionKey: false
});

const Dato = mongoose.model('Dato', datoSchema);

export default Dato;