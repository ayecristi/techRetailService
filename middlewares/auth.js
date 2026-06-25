const jwt = require('jsonwebtoken');

// Middleware para vistas (usa sesión)
const requireAuth = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/auth/login');
    }
    next();
};

// Middleware para vistas (usa sesión) - solo admin
const requireAdmin = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/auth/login');
    }
    if (req.session.usuario.rol !== 'admin') {
        return res.status(403).render('error', {
            statusCode: 403,
            mensaje: 'No tenés permisos para acceder a esta sección. Se requiere rol Administrador.',
            errores: null
        });
    }
    next();
};

// Middleware para rutas API (usa JWT)
const verificarJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = datos;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensaje: 'Token expirado' });
        }
        return res.status(401).json({ mensaje: 'Token inválido' });
    }
};

// Middleware para rutas API - solo admin
const verificarJWTAdmin = (req, res, next) => {
    verificarJWT(req, res, () => {
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'Acceso denegado: se requiere rol admin' });
        }
        next();
    });
};

module.exports = { requireAuth, requireAdmin, verificarJWT, verificarJWTAdmin };