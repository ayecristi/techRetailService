const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'El email de login es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true
    },
    emailRecuperacion: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    rol: {
        type: String,
        enum: ['admin', 'vendedor'],
        default: 'admin'
    },
    activo: {
        type: String,
        enum: ['activo', 'suspendido', 'eliminado'],
        default: 'activo'
    },
    fechaUltimoAcceso: {
        type: Date
    },
    personaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Persona',
        required: [true, 'La persona es obligatoria']
    },
    tiendaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tienda'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);