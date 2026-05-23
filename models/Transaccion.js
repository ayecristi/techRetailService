const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
    tiendaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tienda',
        required: [true, 'El ID de la tienda es obligatorio']
    },
    usuarioId: {
        type: String,
        required: [true, 'El ID del usuario es obligatorio']
    },
    monto: {
        type: Number,
        required: [true, 'El monto es obligatorio'],
        min: [0, 'El monto debe ser positivo']
    },
    comision: {
        type: Number,
        default: 0,
        min: [0, 'La comisión debe ser positiva']
    },
    montoNeto: {
        type: Number,
        default: function() {
            return this.monto - this.comision;
        }
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    metodoPago: {
        type: String,
        required: [true, 'El método de pago es obligatorio'],
        enum: {
            values: ['efectivo', 'tarjeta', 'transferencia', 'paypal', 'criptomoneda'],
            message: 'Método de pago no válido'
        }
    },
    estado: {
        type: String,
        enum: {
            values: ['pendiente', 'completado', 'cancelado', 'reembolsado'],
            message: 'Estado no válido'
        },
        default: 'pendiente'
    },
    items: [{
        productoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto'
        },
        nombre: String,
        cantidad: {
            type: Number,
            min: [1, 'La cantidad debe ser al menos 1']
        },
        precioUnitario: {
            type: Number,
            min: [0, 'El precio unitario debe ser positivo']
        },
        subtotal: {
            type: Number,
            default: function() {
                return this.cantidad * this.precioUnitario;
            }
        }
    }],
    referencia: {
        type: String,
        unique: true,
        sparse: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Transaccion', transaccionSchema);
