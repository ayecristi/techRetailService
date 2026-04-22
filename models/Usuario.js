const crypto = require('crypto');

class Usuario {
    constructor(id, nombre, email, rol, telefono, password, tiendaId, activo, fechaCreacion) {
        
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.telefono = telefono;
        this.password = password;
        this.tiendaId = tiendaId;
        this.activo = activo;
        this.fechaCreacion = new Date().toISOString();
    }

    // Verificar si es administrador
    esAdmin() {
        return this.rol === 'admin';
    }

    // Verificar si es cliente
    esCliente() {
        return this.rol === 'cliente';
    }
}

module.exports = Usuario;