require("dotenv").config();
const http = require('http');
const express = require("express");
const morgan = require('morgan');
const connectDB = require("./config/database");
const errorHandler = require("./middlewares/errorHandler");
const session = require('express-session');
const { iniciarSocket } = require('./config/socket');

const app = express();
const server = http.createServer(app);
iniciarSocket(server);
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

const usuariosRoutes = require("./routes/usuariosRoutes");
const transaccionesRoutes = require("./routes/transaccionesRoutes");
const tiendasRoutes = require("./routes/tiendasRoutes");
const authRoutes = require('./routes/authRoutes');
const productosRoutes = require('./routes/productosRoutes');
const suscripcionesRoutes = require('./routes/suscripcionesRoutes');

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
app.use(require('./middlewares/userLog'));

// Logging HTTP
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

// Archivos estáticos
app.use(express.static("public"));

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', './views');

app.use("/usuarios", usuariosRoutes);
app.use("/transacciones", transaccionesRoutes);
app.use("/tiendas", tiendasRoutes);
app.use('/auth', authRoutes);
app.use('/productos', productosRoutes);
app.use('/suscripciones', suscripcionesRoutes);
app.get('/', (req, res) => {
    if (req.session.usuario) {
        return res.redirect('/tiendas');
    }
    res.redirect('/auth/login');
});
// Alias para el dashboard
app.get('/dashboard', (req, res) => {
    res.redirect('/tiendas');
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
    const esApiRequest = req.originalUrl.includes('/api');
    if (esApiRequest) {
        return res.status(404).json({
            mensaje: 'Ruta no encontrada',
            ruta: req.originalUrl
        });
    }
    res.status(404).render('error', {
        statusCode: 404,
        mensaje: `La página "${req.originalUrl}" no existe.`,
        errores: null
    });
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
        console.log(`Socket.IO activo en puerto ${PORT}`);
    });
}

module.exports = app;