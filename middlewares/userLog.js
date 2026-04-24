module.exports = (req, res, next) => {
    const inicio = Date.now(); // Tomamos el tiempo de inicio
    console.log(`[${new Date().toLocaleTimeString()}] 🟢 Recibida: ${req.method} en ${req.url}`);

    // Escuchamos cuando la respuesta termine de enviarse
    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        console.log(`[${new Date().toLocaleTimeString()}] 🏁 Finalizada: ${req.method} en ${req.url} - Status: ${res.statusCode} (${duracion}ms)`);
    });

    next();
};