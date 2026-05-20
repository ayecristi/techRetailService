const requireAuth = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/auth/login');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session.usuario || req.session.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    next();
};

module.exports = { requireAuth, requireAdmin };