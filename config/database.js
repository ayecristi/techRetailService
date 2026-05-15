const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
        console.log(`Base de datos: ${conn.connection.name}`);
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        console.warn('MongoDB no está disponible. La aplicación seguirá funcionando con funcionalidades limitadas.');
        return false;
    }
};

// Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
    console.log('Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error de conexión Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose desconectado');
});

// Cierre al terminar la aplicación por consola
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada por terminación de aplicación');
    process.exit(0);
});

module.exports = connectDB;