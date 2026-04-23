module.exports = (req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] Se recibió una petición ${req.method} en ${req.url}`);
    next();
};