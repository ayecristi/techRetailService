module.exports = (req, res, next) => {
    const inicio = Date.now(); 
    console.log(`[${new Date().toLocaleTimeString()}] Recibida: ${req.method} en ${req.url}`);

    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        console.log(`[${new Date().toLocaleTimeString()}] Finalizada: ${req.method} en ${req.url} - Status: ${res.statusCode} (${duracion}ms)`);
    });

    next();
};