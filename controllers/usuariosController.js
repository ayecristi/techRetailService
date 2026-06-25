const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const Persona = require('../models/Persona');

// GET ALL - API
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find()
            .populate('personaId')
            .populate('tiendaId', 'nombre');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// GET ALL - Vista
const obtenerUsuariosVista = async (req, res) => {
    try {
        const tiendaId = req.session.usuario?.tiendaId;
        const usuarios = await Usuario.find({ tiendaId })
            .populate('personaId')
            .populate('tiendaId', 'nombre');
        res.render('usuarios/listar', { usuarios });
    } catch (error) {
        res.status(500).send('Error interno: ' + error.message);
    }
};

// GET BY ID
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id)
            .populate('personaId')
            .populate('tiendaId', 'nombre');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// CREATE
const crearUsuario = async (req, res) => {
    try {
        const {
            // Datos de Persona
            nombre, apellido, email, telefono,
            calle, numero, ciudad, provincia, codigoPostal, pais,
            // Datos de Usuario
            emailLogin, emailRecuperacion, password, rol, tiendaId
        } = req.body;

        if (!nombre || !apellido || !email || !emailLogin || !password) {
            if (req.originalUrl.includes('/api')) {
                return res.status(400).json({ mensaje: 'Nombre, apellido, email, emailLogin y contraseña son obligatorios' });
            } else {
                return res.status(400).send('Nombre, apellido, email, emailLogin y contraseña son obligatorios');
            }
        }

        // Crear Persona primero
        const nuevaPersona = new Persona({
            nombre, apellido, email, telefono,
            direccion: { calle, numero, ciudad, provincia, codigoPostal, pais }
        });
        await nuevaPersona.save();

        // Crear Usuario vinculado a la Persona
        const passwordHasheada = await bcrypt.hash(password, 10);
        
        let finalTiendaId = tiendaId;
        if (!req.originalUrl.includes('/api')) {
            finalTiendaId = req.session.usuario?.tiendaId;
        } else if (req.usuario && req.usuario.tiendaId) {
            finalTiendaId = req.usuario.tiendaId;
        }

        const nuevoUsuario = new Usuario({
            email: emailLogin,
            emailRecuperacion,
            password: passwordHasheada,
            rol,
            tiendaId: finalTiendaId,
            personaId: nuevaPersona._id
        });
        await nuevoUsuario.save();

        if (req.originalUrl.includes('/api')) {
            return res.status(201).json({ usuario: nuevoUsuario, persona: nuevaPersona });
        } else {
            return res.redirect('/usuarios/listar');
        }
    } catch (error) {
        if (error.code === 11000) {
            if (req.originalUrl.includes('/api')) {
                return res.status(409).json({ mensaje: 'Ya existe un usuario con ese email' });
            } else {
                return res.status(409).send('Ya existe un usuario con ese email');
            }
        }
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
};

const formularioNuevoUsuario = (req, res) => {
    res.render('usuarios/nuevo');
};

// UPDATE
const actualizarUsuario = async (req, res) => {
    try {
        const {
            nombre, apellido, email, telefono,
            calle, numero, ciudad, provincia, codigoPostal, pais,
            emailLogin, emailRecuperacion, password, rol, activo, tiendaId
        } = req.body;

        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            if (req.originalUrl.includes('/api')) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            } else {
                return res.status(404).send('Usuario no encontrado');
            }
        }

        const userTiendaId = req.session.usuario?.tiendaId || req.usuario?.tiendaId;
        if (userTiendaId && String(usuario.tiendaId) !== String(userTiendaId)) {
            if (req.originalUrl.includes('/api')) {
                return res.status(403).json({ mensaje: 'Acceso denegado' });
            } else {
                return res.status(403).send('Acceso denegado');
            }
        }

        // Actualizar Persona
        await Persona.findByIdAndUpdate(
            usuario.personaId,
            { nombre, apellido, email, telefono, direccion: { calle, numero, ciudad, provincia, codigoPostal, pais } },
            { new: true, runValidators: true }
        );

        let finalTiendaId = tiendaId || usuario.tiendaId;
        if (!req.originalUrl.includes('/api')) {
            finalTiendaId = req.session.usuario?.tiendaId || usuario.tiendaId;
        } else if (req.usuario && req.usuario.tiendaId) {
            finalTiendaId = req.usuario.tiendaId;
        }

        // Actualizar Usuario
        const datosActualizar = { email: emailLogin, emailRecuperacion, rol, activo, tiendaId: finalTiendaId };
        if (password) {
            datosActualizar.password = await bcrypt.hash(password, 10);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            datosActualizar,
            { new: true, runValidators: true }
        ).populate('personaId');

        if (req.originalUrl.includes('/api')) {
            return res.status(200).json({ mensaje: 'Usuario actualizado', usuario: usuarioActualizado });
        } else {
            return res.redirect('/usuarios/listar');
        }
    } catch (error) {
        if (req.originalUrl.includes('/api')) {
            res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
        } else {
            res.status(500).send('Error interno: ' + error.message);
        }
    }
};

const formularioEditarUsuario = async (req, res) => {
    try {
        const tiendaId = req.session.usuario?.tiendaId;
        const usuario = await Usuario.findById(req.params.id).populate('personaId');
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }
        if (tiendaId && String(usuario.tiendaId) !== String(tiendaId)) {
            return res.status(403).send('Acceso denegado');
        }
        res.render('usuarios/editar', { usuario });
    } catch (error) {
        res.status(500).send('Error interno: ' + error.message);
    }
};

// DELETE
const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            if (req.originalUrl.includes('/api')) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            } else {
                return res.status(404).send('Usuario no encontrado');
            }
        }

        const userTiendaId = req.session.usuario?.tiendaId || req.usuario?.tiendaId;
        if (userTiendaId && String(usuario.tiendaId) !== String(userTiendaId)) {
            if (req.originalUrl.includes('/api')) {
                return res.status(403).json({ mensaje: 'Acceso denegado' });
            } else {
                return res.status(403).send('Acceso denegado');
            }
        }

        // Eliminar Persona asociada también
        await Persona.findByIdAndDelete(usuario.personaId);
        await Usuario.findByIdAndDelete(req.params.id);

        if (req.originalUrl.includes('/api')) {
            return res.status(200).json({ mensaje: 'Usuario y persona eliminados' });
        } else {
            return res.redirect('/usuarios/listar');
        }
    } catch (error) {
        if (req.originalUrl.includes('/api')) {
            res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
        } else {
            res.status(500).send('Error al eliminar: ' + error.message);
        }
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuariosVista,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    formularioNuevoUsuario,
    formularioEditarUsuario
};