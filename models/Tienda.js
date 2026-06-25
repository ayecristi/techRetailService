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
    const Producto = mongoose.model('Producto');
    const producto = new Producto({ ...datosProducto, tiendaId: this._id });
    return await producto.save();
};

tiendaSchema.methods.listarProductos = async function() {
    const Producto = mongoose.model('Producto');
    return await Producto.find({ tiendaId: this._id, activo: true }).sort({ nombre: 1 });
};

module.exports = mongoose.model('Tienda', tiendaSchema);