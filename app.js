const express = require("express");
const app = express();
const PORT = 3000;

// const personasRoutes = require("./routes/personasRoutes");

app.use(express.json());

// usar rutas
// app.use("/personas", personasRoutes);

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});