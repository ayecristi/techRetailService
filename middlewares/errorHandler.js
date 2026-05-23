const errorHandler = (err, req, res, next) => {
    console.error('Error detectado:', err.message);

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Error interno del servidor'
    });
};

module.exports = errorHandler;