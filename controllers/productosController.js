const Producto = require('../models/Producto');

// GET ALL - API
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find()
            .populate('tiendaId', 'nombre');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// GET BY TIENDA
const obtenerProductosPorTienda = async (req, res) => {
    try {
        const productos = await Producto.find({ tiendaId: req.params.tiendaId, activo: true })
            .populate('tiendaId', 'nombre');
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// GET BY ID
const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id)
            .populate('tiendaId', 'nombre');
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// CREATE
const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoria, imagenUrl } = req.body;
        const tiendaId = req.body.tiendaId || req.session?.usuario?.tiendaId;

        if (!tiendaId || !nombre || precio === undefined) {
            return res.status(400).json({ mensaje: 'Nombre y precio son obligatorios' });
        }

        const nuevoProducto = new Producto({ tiendaId, nombre, descripcion, precio, stock, categoria, imagenUrl });
        await nuevoProducto.save();

        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// UPDATE
const actualizarProducto = async (req, res) => {
    try {
        const { tiendaId, nombre, descripcion, precio, stock, categoria, imagenUrl, activo } = req.body;

        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            { tiendaId, nombre, descripcion, precio, stock, categoria, imagenUrl, activo },
            { new: true, runValidators: true }
        );

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.status(200).json({ mensaje: 'Producto actualizado', producto });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// DELETE
const eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.status(200).json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductosPorTienda,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};