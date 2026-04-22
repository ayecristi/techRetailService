class Transaccion {
    constructor(id, tiendaId, usuarioId, monto, metodoPago, estado, descripcion, tiendaId) {
        this.id = id; 
        this.tiendaOrigenId = tiendaId;
        this.usuarioId = usuarioId; // definimos si es cliente con el rol 'cliente'
        this.tiendaId = tiendaId || null;

        this.monto = monto; 
        this.comision = 0; 
        this.montoNeto = null; 
        this.descripcion = descripcion || ""; 

        this.metodoPago = metodoPago; 
        this.estado = estado || "pendiente"; // pendiente, completado, cancelado, reembolsado

        this.items = []; // array de productos 
        this.referencia = null; 

        this.creadoEn = new Date().toISOString();
        this.actualizadoEn = new Date().toISOString();
    }

    procesarVenta(datos) {
        this.estado = "completado";
        this.actualizadoEn = new Date().toISOString();
        return {
            exito: true,
            mensaje: "Venta procesada correctamente",
            transaccion: this
        };
    }

    reembolsar() {
        if (this.estado === "completado" || this.estado === "pendiente") {
            this.estado = "reembolsado";
            this.actualizadoEn = new Date().toISOString();
            return {
                exito: true,
                mensaje: "Transacción reembolsada",
                transaccion: this
            };
        }
        return {
            exito: false,
            mensaje: "No se puede reembolsar transacciones en estado: " + this.estado
        };
    }
}

module.exports = Transaccion;
