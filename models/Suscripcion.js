const mongoose = require('mongoose');
const { PLANES_SUSCRIPCION, ESTADOS_SUSCRIPCION } = require('../constants/enums');

const suscripcionSchema = new mongoose.Schema({
    tiendaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tienda',
        required: [true, 'La tienda es obligatoria'],
        unique: true
    },
    plan: {
        type: String,
        enum: Object.values(PLANES_SUSCRIPCION),
        required: [true, 'El plan es obligatorio'],
        default: PLANES_SUSCRIPCION.BASICO
    },
    precioMensual: {
        type: Number,
        required: [true, 'El precio mensual es obligatorio'],
        min: 0
    },
    estado: {
        type: String,
        enum: Object.values(ESTADOS_SUSCRIPCION),
        default: ESTADOS_SUSCRIPCION.ACTIVO
    },
    fechaInicio: {
        type: Date,
        default: Date.now
    },
    fechaVencimiento: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Suscripcion', suscripcionSchema);