const errorHandler = (err, req, res, next) => {
    // Log detallado solo en development
    if (process.env.NODE_ENV !== 'production') {
        console.error(`[${new Date().toISOString()}] ERROR:`, err);
    } else {
        console.error(`[${new Date().toISOString()}] ERROR: ${err.message}`);
    }

    let statusCode = err.statusCode || 500;
    let mensaje = err.message || 'Error interno del servidor';
    let errores = null;

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        statusCode = 400;
        mensaje = 'Error de validación';
        errores = Object.values(err.errors).map(e => e.message);
    }

    // Error de duplicado MongoDB (unique constraint)
    if (err.code === 11000) {
        statusCode = 409;
        const campo = err.keyValue ? Object.keys(err.keyValue)[0] : 'campo';
        mensaje = `Ya existe un registro con ese ${campo}`;
    }

    // Error de ID inválido (CastError de ObjectId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        mensaje = 'ID inválido';
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        mensaje = 'Token inválido';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        mensaje = 'Token expirado';
    }

    // Responder en JSON para rutas API; renderizar vista para rutas web
    const esApiRequest = req.originalUrl.includes('/api') ||
        (req.headers.accept && req.headers.accept.includes('application/json'));

    if (esApiRequest) {
        return res.status(statusCode).json({
            success: false,
            error: mensaje,
            ...(errores && { errores })
        });
    }

    res.status(statusCode).render('error', {
        statusCode,
        mensaje,
        errores
    });
};

module.exports = errorHandler;