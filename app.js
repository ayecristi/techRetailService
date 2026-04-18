const express = require("express");
const app = express();
const PORT = 3000;

// const personasRoutes = require("./routes/personasRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'pug');
app.set('views', './views');
// usar rutas
// app.use("/personas", personasRoutes);


app.get('/', (req, res) => {
    res.send('¡Servidor de TechRetail funcionando perfecto!');
});

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});