const mongoose = require('mongoose');

const tiendaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    cuit: {
        type: String,
        trim: true
    },
    whatsapp: {
        type: String,
        trim: true
    },
    categoria: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingrese un email válido']
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

tiendaSchema.methods.crearProducto = async function(datosProducto) {
    console.log(`Creando producto en tienda ${this.nombre}`);
};

tiendaSchema.methods.listarProductos = async function() {
    console.log(`Listando productos de tienda ${this.nombre}`);
    return [];
};

module.exports = mongoose.model('Tienda', tiendaSchema);