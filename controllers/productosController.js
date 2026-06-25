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
        const tiendaId = req.usuario?.tiendaId || req.body.tiendaId || req.session?.usuario?.tiendaId;

        if (!tiendaId || !nombre || precio === undefined) {
            return res.status(400).json({ mensaje: 'Nombre y precio son obligatorios' });
        }

        const nuevoProducto = new Producto({ tiendaId, nombre, descripcion, precio, stock, categoria, imagenUrl });
        await nuevoProducto.save();

        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
};

// UPDATE
const actualizarProducto = async (req, res) => {
    try {
        const { tiendaId, nombre, descripcion, precio, stock, categoria, imagenUrl, activo } = req.body;

        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        const requesterTiendaId = req.usuario?.tiendaId || req.session?.usuario?.tiendaId;
        if (requesterTiendaId && String(producto.tiendaId) !== String(requesterTiendaId)) {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }

        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            { tiendaId: tiendaId || producto.tiendaId, nombre, descripcion, precio, stock, categoria, imagenUrl, activo },
            { new: true, runValidators: true }
        );

        res.status(200).json({ mensaje: 'Producto actualizado', producto: productoActualizado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
};

// DELETE
const eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        const requesterTiendaId = req.usuario?.tiendaId || req.session?.usuario?.tiendaId;
        if (requesterTiendaId && String(producto.tiendaId) !== String(requesterTiendaId)) {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }

        await Producto.findByIdAndDelete(req.params.id);
        res.status(200).json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
};

// GET VISTA — listado de productos de la tienda logueada
const obtenerProductosVista = async (req, res) => {
    try {
        const tiendaId = req.session.usuario?.tiendaId;
        if (!tiendaId) return res.redirect('/auth/login');
        const productos = await Producto.find({ tiendaId }).sort({ nombre: 1 });
        res.render('productos/listar', { productos });
    } catch (error) {
        res.status(500).send('Error interno: ' + error.message);
    }
};

// GET VISTA — formulario de nuevo producto
const formularioNuevoProducto = (req, res) => {
    res.render('productos/nuevo');
};

// GET VISTA — formulario de edición
const formularioEditarProducto = async (req, res) => {
    try {
        const tiendaId = req.session.usuario?.tiendaId;
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).send('Producto no encontrado');
        if (String(producto.tiendaId) !== String(tiendaId)) return res.status(403).send('Acceso denegado');
        res.render('productos/editar', { producto });
    } catch (error) {
        res.status(500).send('Error interno: ' + error.message);
    }
};

// POST ACCIÓN — crear desde formulario
const crearProductoVista = async (req, res) => {
    try {
        const tiendaId = req.session.usuario?.tiendaId;
        const { nombre, descripcion, precio, stock, categoria, imagenUrl } = req.body;
        const nuevoProducto = new Producto({ tiendaId, nombre, descripcion, precio, stock, categoria, imagenUrl });
        await nuevoProducto.save();
        res.redirect('/productos/listar');
    } catch (error) {
        res.status(500).send('Error al crear: ' + error.message);
    }
};

// POST ACCIÓN — actualizar desde formulario
const actualizarProductoVista = async (req, res) => {
    try {
        const tiendaId = req.session.usuario?.tiendaId;
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).send('Producto no encontrado');
        if (String(producto.tiendaId) !== String(tiendaId)) return res.status(403).send('Acceso denegado');
        const { nombre, descripcion, precio, stock, categoria, imagenUrl, activo } = req.body;
        await Producto.findByIdAndUpdate(req.params.id, { nombre, descripcion, precio, stock, categoria, imagenUrl, activo: activo === 'on' }, { new: true, runValidators: true });
        res.redirect('/productos/listar');
    } catch (error) {
        res.status(500).send('Error al actualizar: ' + error.message);
    }
};

// POST ACCIÓN — eliminar desde formulario
const eliminarProductoVista = async (req, res) => {
    try {
        const tiendaId = req.session.usuario?.tiendaId;
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).send('Producto no encontrado');
        if (String(producto.tiendaId) !== String(tiendaId)) return res.status(403).send('Acceso denegado');
        await Producto.findByIdAndDelete(req.params.id);
        res.redirect('/productos/listar');
    } catch (error) {
        res.status(500).send('Error al eliminar: ' + error.message);
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductosPorTienda,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosVista,
    formularioNuevoProducto,
    formularioEditarProducto,
    crearProductoVista,
    actualizarProductoVista,
    eliminarProductoVista
};