require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const usuariosData = require("./data/usuarios.json");
const transaccionesData = require("./data/transacciones.json");

const usuariosRoutes = require("./routes/usuariosRoutes");
const transaccionesRoutes = require("./routes/transaccionesRoutes");

app.use(express.json());
// Recibir datos de formularios html
app.use(express.urlencoded({ extended: true }));
app.use(require('./middlewares/userLog'));
// Archivos estáticos (CSS, JS, imágenes)
app.use(express.static("public"));

app.set('view engine', 'pug');
app.set('views', './views');


//rutas
app.use("/usuarios", usuariosRoutes);
app.use("/transacciones", transaccionesRoutes);

app.get('/', (req, res) => {
    res.render('index', { usuarios: usuariosData, transacciones: transaccionesData });
});

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});