const fs = require("fs");
const path = require("path");
const Usuario = require("../models/Usuario");
const rutaArchivo = path.join(__dirname, "../data/usuarios.json");


// leer archivo
const leerUsuarios = () => {
    const data = fs.readFileSync(rutaArchivo, "utf-8");
    return JSON.parse(data);

};

// guardar archivo
const guardarUsuarios = (usuarios) => {
    fs.writeFileSync(
        rutaArchivo,
        JSON.stringify(usuarios, null, 2)
    );

};

// GET ALL
const obtenerUsuarios = (req, res) => {
    const usuarios = leerUsuarios();
    res.json(usuarios);
    
};
const obtenerUsuariosVista = (req, res) => {
    const usuarios = leerUsuarios();
    res.render("index", { usuarios });
};

// GET BY ID
const obtenerUsuarioPorId = (req, res) => {
    const usuarios = leerUsuarios();
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        return res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
    }
    res.json(usuario);
};


// CREATE
const crearUsuario = (req, res) => {
    const usuarios = leerUsuarios();
    const { id, nombre, email, rol, telefono, password, tiendaId, activo, fechaCreacion } = req.body;
    const nuevoUsuario = new Usuario(id, nombre, email, rol, telefono, password, tiendaId, activo, fechaCreacion);
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    res.status(201).json({
        mensaje: "Usuario creado",
        usuario: nuevoUsuario
    });
};

const formularioNuevoUsuario = (req, res) => {
    res.render("nuevo");
};

// UPDATE
const actualizarUsuario = (req, res) => {
    const usuarios = leerUsuarios();
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        return res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
    }

    const { nombre, email, rol, telefono, password, tiendaId, activo } = req.body;
    usuario.nombre = nombre ?? usuario.nombre;
    usuario.email = email ?? usuario.email;
    usuario.rol = rol ?? usuario.rol;
    usuario.telefono = telefono ?? usuario.telefono;
    usuario.password = password ?? usuario.password;
    usuario.tiendaId = tiendaId ?? usuario.tiendaId;
    usuario.activo = activo ?? usuario.activo;

    guardarUsuarios(usuarios);

    res.json({
        mensaje: "Usuario actualizado",
        usuario
    });
};


// DELETE
const eliminarUsuario = (req, res) => {
    const usuarios = leerUsuarios();
    const id = parseInt(req.params.id);
    const nuevosUsuarios = usuarios.filter(u => u.id !== id);
    if (usuarios.length === nuevosUsuarios.length) {
        return res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
    }
    guardarUsuarios(nuevosUsuarios);

    res.json({
        mensaje: "Usuario eliminado"
    });

};


module.exports = {
    obtenerUsuarios,
    obtenerUsuariosVista,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    formularioNuevoUsuario
};