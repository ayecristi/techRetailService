require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const usuariosRoutes = require("./routes/usuariosRoutes");
const transaccionesRoutes = require("./routes/transaccionesRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static("public"));

//rutas
app.use("/usuarios", usuariosRoutes);
app.use("/transacciones", transaccionesRoutes);

app.get('/', (req, res) => {
    res.send('¡Servidor de TechRetail funcionando perfecto!');
});

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});