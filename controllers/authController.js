const Usuario = require('../models/Usuario');
const Persona = require('../models/Persona');
const Tienda = require('../models/Tienda');

const formularioRegistro = (req, res) => {
    res.render('auth/registro');
};

const registrar = async (req, res) => {
    try {
        const { usuario, persona, tienda } = req.body;

        if (!persona.nombre || !persona.apellido || !usuario.email || !usuario.password || !tienda.nombre) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        }

        const nuevaPersona = new Persona({ 
            nombre: persona.nombre, 
            apellido: persona.apellido, 
            email: usuario.email 
        });
        await nuevaPersona.save();

        const nuevaTienda = new Tienda({
            nombre: tienda.nombre,
            cuit: tienda.cuit,
            whatsapp: tienda.whatsapp
        });
        await nuevaTienda.save();

        const nuevoUsuario = new Usuario({
            email: usuario.email, 
            password: usuario.password, 
            rol: 'admin', 
            personaId: nuevaPersona._id,
            tiendaId: nuevaTienda._id
        });
        await nuevoUsuario.save();

        // Guardar sesión
        req.session.usuario = {
            id: nuevoUsuario._id,
            email: nuevoUsuario.email,
            rol: nuevoUsuario.rol,
            tiendaId: nuevaTienda._id,
            nombre: nuevaPersona.nombre
        };

        res.status(201).json({ mensaje: 'Cuenta y tienda registradas exitosamente' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ mensaje: 'Ya existe un usuario con ese email' });
        }
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const formularioLogin = (req, res) => {
    res.render('auth/login');
};

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

        // Guardar sesión
        req.session.usuario = {
            id: usuario._id,
            email: usuario.email,
            rol: usuario.rol,
            tiendaId: usuario.tiendaId,
            nombre: usuario.personaId.nombre
        };

        res.status(200).json({ mensaje: 'Login exitoso' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
};

module.exports = {
    formularioRegistro,
    registrar,
    formularioLogin,
    login,
    logout
};