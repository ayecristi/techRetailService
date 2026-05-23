const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
    calle: { type: String, trim: true },
    numero: { type: String, trim: true },
    ciudad: { type: String, trim: true },
    provincia: { type: String, trim: true },
    codigoPostal: { type: String, trim: true },
    pais: { type: String, trim: true, default: 'Argentina' }
}, { _id: false });

const personaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true
    },
    telefono: {
        type: String,
        trim: true
    },
    direccion: direccionSchema
}, {
    timestamps: true
});

module.exports = mongoose.model('Persona', personaSchema);