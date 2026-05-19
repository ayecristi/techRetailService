const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    tiendaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tienda',
        required: [true, 'La tienda es obligatoria']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: 0
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: 0,
        default: 0
    },
    categoria: {
        type: String,
        trim: true
    },
    imagenUrl: {
        type: String,
        trim: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Producto', productoSchema);