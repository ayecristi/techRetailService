const Usuario = require('../models/Usuario');
const Persona = require('../models/Persona');

// GET - Formulario registro
const formularioRegistro = (req, res) => {
    res.render('auth/registro');
};

// POST - Registro
const registrar = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, password, rol } = req.body;

        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({ mensaje: 'Nombre, apellido, email y contraseña son obligatorios' });
        }

        const nuevaPersona = new Persona({ nombre, apellido, email, telefono });
        await nuevaPersona.save();

        const nuevoUsuario = new Usuario({
            email, password, rol,
            personaId: nuevaPersona._id
        });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ mensaje: 'Ya existe un usuario con ese email' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// GET - Formulario login
const formularioLogin = (req, res) => {
    res.render('auth/login');
};

// POST - Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
        }

        const usuario = await Usuario.findOne({ email }).populate('personaId');

        if (!usuario || usuario.password !== password) {
            return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
        }

        if (usuario.activo !== 'activo') {
            return res.status(401).json({ mensaje: 'Usuario suspendido o eliminado' });
        }

        await Usuario.findByIdAndUpdate(usuario._id, { fechaUltimoAcceso: new Date() });

        res.status(200).json({ mensaje: 'Login exitoso' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    formularioRegistro,
    registrar,
    formularioLogin,
    login
};