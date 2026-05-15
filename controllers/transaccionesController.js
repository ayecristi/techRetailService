const fs = require("fs");
const path = require("path");
const Transaccion = require("../models/Transaccion");
const Tienda = require("../models/Tienda");
const rutaUsuarios = path.join(__dirname, "../data/usuarios.json");

const leerUsuarios = () => {
    const data = fs.readFileSync(rutaUsuarios, "utf-8");
    return JSON.parse(data);
};

// GET ALL - API
const obtenerTransacciones = async (req, res) => {
    try {
        const { estado, tiendaId, usuarioId, limit = 50, skip = 0 } = req.query;

        let filtro = {};

        if (estado) filtro.estado = estado;
        if (tiendaId) filtro.tiendaId = tiendaId;
        if (usuarioId) filtro.usuarioId = usuarioId;

        const transacciones = await Transaccion.find(filtro)
            .populate('tiendaId', 'nombre')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Transaccion.countDocuments(filtro);

        res.json({
            transacciones,
            total,
            pagina: Math.floor(skip / limit) + 1,
            paginas: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error obteniendo transacciones:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// GET ALL - Vista
const obtenerTransaccionesVista = async (req, res) => {
    try {
        const transacciones = await Transaccion.find()
            .populate('tiendaId', 'nombre')
            .sort({ createdAt: -1 })
            .limit(100);

        res.render("transacciones/listar", { transacciones });
    } catch (error) {
        console.error("ERROR AL RENDERIZAR LISTAR TRANSACCIONES:", error);
        res.status(500).send("Error interno: " + error.message);
    }
};

// GET BY ID - API
const obtenerTransaccionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                mensaje: "ID de transacción inválido"
            });
        }

        const transaccion = await Transaccion.findById(id)
            .populate('tiendaId', 'nombre');

        if (!transaccion) {
            return res.status(404).json({
                mensaje: "Transacción no encontrada"
            });
        }

        res.json(transaccion);
    } catch (error) {
        console.error('Error obteniendo transacción por ID:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// GET BY ID - Vista
const obtenerTransaccionVista = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).render("transacciones/ver", {
                error: "ID de transacción inválido"
            });
        }

        const transaccion = await Transaccion.findById(id)
            .populate('tiendaId', 'nombre');

        if (!transaccion) {
            return res.status(404).render("transacciones/ver", {
                error: "Transacción no encontrada"
            });
        }

        res.render("transacciones/ver", { transaccion });
    } catch (error) {
        console.error('Error obteniendo transacción para vista:', error);
        res.status(500).render("transacciones/ver", {
            error: "Error interno del servidor"
        });
    }
};

// CREATE - API y Formulario
const crearTransaccion = async (req, res) => {
    try {
        const {
            tiendaId,
            usuarioId,
            monto,
            metodoPago,
            descripcion,
            items,
            referencia
        } = req.body;

        // Validación básica
        if (!tiendaId || !usuarioId || !monto || !metodoPago) {
            if (req.originalUrl.includes('/api')) {
                return res.status(400).json({
                    mensaje: 'Tienda, usuario, monto y método de pago son obligatorios'
                });
            } else {
                return res.status(400).send('Tienda, usuario, monto y método de pago son obligatorios');
            }
        }

        const usuarios = leerUsuarios();
        const usuarioExiste = usuarios.find(u => String(u.id) === String(usuarioId));
        if (!usuarioExiste) {
            if (req.originalUrl.includes('/api')) {
                return res.status(400).json({
                    mensaje: 'El usuario especificado no existe'
                });
            } else {
                return res.status(400).send('El usuario especificado no existe');
            }
        }

        const tiendaExiste = await Tienda.findById(tiendaId);
        if (!tiendaExiste) {
            if (req.originalUrl.includes('/api')) {
                return res.status(400).json({
                    mensaje: 'La tienda especificada no existe'
                });
            } else {
                return res.status(400).send('La tienda especificada no existe');
            }
        }

        // Crear nueva transacción
        const nuevaTransaccion = new Transaccion({
            tiendaId,
            usuarioId,
            monto: parseFloat(monto),
            metodoPago,
            descripcion: descripcion ? descripcion.trim() : undefined,
            items: items || [],
            referencia
        });

        const transaccionGuardada = await nuevaTransaccion.save();

        if (req.originalUrl.includes('/api')) {
            return res.status(201).json({
                mensaje: 'Transacción creada exitosamente',
                transaccion: transaccionGuardada
            });
        } else {
            return res.redirect('/transacciones/listar');
        }
    } catch (error) {
        console.error('Error creando transacción:', error);

        if (error.code === 11000) {
            if (req.originalUrl.includes('/api')) {
                return res.status(409).json({
                    mensaje: 'Ya existe una transacción con esta referencia'
                });
            } else {
                return res.status(409).send('Ya existe una transacción con esta referencia');
            }
        }

        if (error.name === 'ValidationError') {
            if (req.originalUrl.includes('/api')) {
                return res.status(400).json({
                    mensaje: 'Datos de transacción inválidos',
                    errores: Object.values(error.errors).map(e => e.message)
                });
            } else {
                return res.status(400).send('Datos de transacción inválidos: ' + Object.values(error.errors).map(e => e.message).join(', '));
            }
        }

        if (req.originalUrl.includes('/api')) {
            return res.status(500).json({
                mensaje: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        } else {
            return res.status(500).send('Error interno del servidor');
        }
    }
};

// UPDATE - API
const actualizarTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ mensaje: "ID de transacción inválido" });
        }

        // No permitir actualizar ciertos campos
        delete updates._id;
        delete updates.creadoEn;
        delete updates.createdAt;

        const transaccion = await Transaccion.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).populate('tiendaId', 'nombre');

        if (!transaccion) {
            return res.status(404).json({ mensaje: "Transacción no encontrada" });
        }

        res.status(200).json({
            mensaje: "Transacción actualizada exitosamente",
            transaccion
        });
    } catch (error) {
        console.error('Error actualizando transacción:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                mensaje: 'Datos de transacción inválidos',
                errores: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// DELETE - API
const eliminarTransaccion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ mensaje: "ID de transacción inválido" });
        }

        const transaccionEliminada = await Transaccion.findByIdAndDelete(id);

        if (!transaccionEliminada) {
            return res.status(404).json({ mensaje: "Transacción no encontrada" });
        }

        res.status(200).json({
            mensaje: "Transacción eliminada exitosamente"
        });
    } catch (error) {
        console.error('Error eliminando transacción:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ACCIONES ESPECÍFICAS
const procesarVenta = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ mensaje: "ID de transacción inválido" });
        }

        const transaccion = await Transaccion.findById(id);

        if (!transaccion) {
            return res.status(404).json({ mensaje: "Transacción no encontrada" });
        }

        const resultado = transaccion.procesarVenta();
        await transaccion.save();

        res.json(resultado);
    } catch (error) {
        console.error('Error procesando venta:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const reembolsarTransaccion = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ mensaje: "ID de transacción inválido" });
        }

        const transaccion = await Transaccion.findById(id);

        if (!transaccion) {
            return res.status(404).json({ mensaje: "Transacción no encontrada" });
        }

        const resultado = transaccion.reembolsar();
        if (resultado.exito) {
            await transaccion.save();
        }

        res.json(resultado);
    } catch (error) {
        console.error('Error reembolsando transacción:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// VISTAS
const formularioCrearTransaccion = async (req, res) => {
    try {
        const usuarios = leerUsuarios();
        const tiendas = await Tienda.find().select('nombre');
        res.render("transacciones/crear", { usuarios, tiendas });
    } catch (error) {
        console.error('Error obteniendo datos para crear transacción:', error);
        res.status(500).send("Error interno del servidor");
    }
};

const formularioEditarTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        const transaccion = await Transaccion.findById(id);
        
        if (!transaccion) {
            return res.status(404).send("Transacción no encontrada");
        }

        const usuarios = leerUsuarios();
        const tiendas = await Tienda.find().select('nombre');
        res.render("transacciones/editar", { transaccion, usuarios, tiendas });
    } catch (error) {
        console.error('Error obteniendo datos para editar transacción:', error);
        res.status(500).send("Error interno del servidor");
    }
};

const actualizarTransaccionVista = async (req, res) => {
    try {
        const { id } = req.params;
        const { tiendaId, usuarioId, monto, metodoPago, estado, descripcion, referencia } = req.body;

        const transaccion = await Transaccion.findByIdAndUpdate(
            id,
            { 
                tiendaId, 
                usuarioId, 
                monto: parseFloat(monto), 
                metodoPago, 
                estado, 
                descripcion, 
                referencia
            },
            { new: true, runValidators: true }
        );

        if (!transaccion) {
            return res.status(404).send("Transacción no encontrada");
        }

        res.redirect('/transacciones/listar');
    } catch (error) {
        console.error('Error actualizando transacción desde vista:', error);
        res.status(500).send("Error al actualizar: " + error.message);
    }
};

const eliminarTransaccionVista = async (req, res) => {
    try {
        const { id } = req.params;
        const transaccionEliminada = await Transaccion.findByIdAndDelete(id);

        if (!transaccionEliminada) {
            return res.status(404).send("Transacción no encontrada");
        }

        res.redirect('/transacciones/listar');
    } catch (error) {
        console.error('Error eliminando transacción desde vista:', error);
        res.status(500).send("Error al eliminar: " + error.message);
    }
};

module.exports = {
    obtenerTransacciones,
    obtenerTransaccionesVista,
    obtenerTransaccionPorId,
    obtenerTransaccionVista,
    crearTransaccion,
    actualizarTransaccion,
    eliminarTransaccion,
    procesarVenta,
    reembolsarTransaccion,
    formularioCrearTransaccion,
    formularioEditarTransaccion,
    actualizarTransaccionVista,
    eliminarTransaccionVista
};
