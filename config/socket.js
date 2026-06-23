const { Server } = require('socket.io');

let io;

const iniciarSocket = (server) => {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log(`[Socket.IO] Usuario conectado: ${socket.id}`);

        socket.on('unirse-tienda', (tiendaId) => {
            socket.join(`tienda-${tiendaId}`);
            console.log(`[Socket.IO] Socket ${socket.id} se unió a tienda-${tiendaId}`);
        });

        socket.on('disconnect', () => {
            console.log(`[Socket.IO] Usuario desconectado: ${socket.id}`);
        });
    });

    return io;
};

const notificarNuevaTransaccion = (tiendaId, transaccion) => {
    if (!io) return;
    io.to(`tienda-${tiendaId}`).emit('nueva-transaccion', {
        mensaje: 'Nueva transacción registrada',
        transaccion: {
            id: transaccion._id,
            monto: transaccion.monto,
            metodoPago: transaccion.metodoPago,
            estado: transaccion.estado,
            fecha: transaccion.createdAt
        }
    });
};

const notificarCambioEstado = (tiendaId, transaccion) => {
    if (!io) return;
    io.to(`tienda-${tiendaId}`).emit('estado-transaccion', {
        mensaje: `Transacción actualizada a: ${transaccion.estado}`,
        transaccion: {
            id: transaccion._id,
            estado: transaccion.estado,
            monto: transaccion.monto
        }
    });
};

module.exports = { iniciarSocket, notificarNuevaTransaccion, notificarCambioEstado };