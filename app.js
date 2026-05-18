require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

const usuariosRoutes = require("./routes/usuariosRoutes");
const transaccionesRoutes = require("./routes/transaccionesRoutes");
const tiendasRoutes = require("./routes/tiendasRoutes");
const authRoutes = require('./routes/authRoutes');

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(require('./middlewares/userLog'));

// Archivos estáticos
app.use(express.static("public"));

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas
app.use("/usuarios", usuariosRoutes);
app.use("/transacciones", transaccionesRoutes);
app.use("/tiendas", tiendasRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada',
        ruta: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});