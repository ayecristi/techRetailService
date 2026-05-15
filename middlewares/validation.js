// Validar ID de MongoDB
const validarObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!id || id.length !== 24) {
        return res.status(400).json({ mensaje: "ID inválido" });
    }
    next();
};

// Validar datos de usuario
const validarUsuario = (req, res, next) => {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
        return res.status(400).json({ mensaje: "Nombre y email son obligatorios" });
    }
    next();
};

// Validar datos de transacción
const validarTransaccion = (req, res, next) => {
    const { tiendaId, usuarioId, monto } = req.body;
    if (!tiendaId || !usuarioId || !monto) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }
    next();
};

// Middleware para sanitizar datos
const sanitizarDatos = (req, res, next) => {
    if (req.body.monto) {
        req.body.monto = parseFloat(req.body.monto);
    }
    next();
};

module.exports = {
    validarObjectId,
    validarUsuario,
    validarTransaccion,
    sanitizarDatos
};