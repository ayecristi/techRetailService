const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const Persona = require('../models/Persona');
const Tienda = require('../models/Tienda');
const Suscripcion = require('../models/Suscripcion');
const { PLANES_SUSCRIPCION, ESTADOS_SUSCRIPCION, DETALLES_PLANES } = require('../constants/enums');

const generarToken = (usuario) => {
    return jwt.sign(
        {
            id: usuario._id,
            email: usuario.email,
            rol: usuario.rol,
            tiendaId: usuario.tiendaId
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const formularioRegistro = (req, res) => {
    res.render('auth/registro', { planes: DETALLES_PLANES });
};

const registrar = async (req, res) => {
    try {
        const { usuario, persona, tienda, plan } = req.body;

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

        // Hashear la contraseña antes de guardar
        const passwordHasheada = await bcrypt.hash(usuario.password, 10);

        const nuevoUsuario = new Usuario({
            email: usuario.email,
            password: passwordHasheada,
            rol: 'admin',
            personaId: nuevaPersona._id,
            tiendaId: nuevaTienda._id
        });
        await nuevoUsuario.save();

        const planSeleccionado = plan || PLANES_SUSCRIPCION.BASICO;
        const detallesPlan = DETALLES_PLANES[planSeleccionado] || DETALLES_PLANES[PLANES_SUSCRIPCION.BASICO];
        const precioMensual = detallesPlan.precio;

        const nuevaSuscripcion = new Suscripcion({
            tiendaId: nuevaTienda._id,
            plan: planSeleccionado,
            precioMensual,
            estado: ESTADOS_SUSCRIPCION.ACTIVO
        });
        await nuevaSuscripcion.save();

        // Guardar sesión
        req.session.usuario = {
            id: nuevoUsuario._id,
            email: nuevoUsuario.email,
            rol: nuevoUsuario.rol,
            tiendaId: nuevaTienda._id,
            nombre: nuevaPersona.nombre
        };

        // Generar JWT
        const token = generarToken(nuevoUsuario);

        res.status(201).json({
            mensaje: 'Cuenta, tienda y suscripción registradas exitosamente',
            token
        });
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

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
        }

        // Comparar contraseña con bcrypt
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
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

        // Generar JWT
        const token = generarToken(usuario);

        res.status(200).json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario._id,
                email: usuario.email,
                rol: usuario.rol,
                nombre: usuario.personaId.nombre
            }
        });
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