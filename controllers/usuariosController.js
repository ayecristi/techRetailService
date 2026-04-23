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
    try {
        const usuarios = leerUsuarios();
        res.render("usuarios/listar", { usuarios });
    } catch (error) {
        console.error("ERROR AL RENDERIZAR LISTAR:", error);
        res.status(500).send("Error interno: " + error.message);
    }
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
    const nuevoUsuario = new Usuario(Number(id), nombre, email, rol, telefono, password, tiendaId, activo, fechaCreacion);
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    if (req.originalUrl.includes('/api')) {
            // Si llama a la API (Thunder Client), devuelvo JSON
            return res.status(201).json(nuevoUsuario);
        } else {
            // Si llamaron desde el formulario web (/guardar), redirijo a la lista
            return res.redirect('/usuarios/listar');
        }
};

const formularioNuevoUsuario = (req, res) => {
    res.render("usuarios/nuevo");
};

// UPDATE
const actualizarUsuario = (req, res) => {
    const usuarios = leerUsuarios();
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        if (req.originalUrl.includes('/api')) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        } else {
            return res.status(404).send("Usuario no encontrado");
        }
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

   if (req.originalUrl.includes('/api')) {
        return res.status(200).json({
            mensaje: "Usuario actualizado",
            usuario
        });
    } else {
        return res.redirect('/usuarios/listar');
    }
};

const formularioEditarUsuario = (req, res) => {
    const usuarios = leerUsuarios();
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).send("Usuario no encontrado para editar");
    }

    res.render("usuarios/editar", { usuario: usuario });
};


// DELETE
const eliminarUsuario = (req, res) => {
    const usuarios = leerUsuarios();
    const id = parseInt(req.params.id);
    const nuevosUsuarios = usuarios.filter(u => u.id !== id);
    if (usuarios.length === nuevosUsuarios.length) {
        if (req.originalUrl.includes('/api')) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        } else {
            return res.status(404).send("Usuario no encontrado");
        }
    }
    guardarUsuarios(nuevosUsuarios);

    //actualizar vista
    if (req.originalUrl.includes('/api')) {
        return res.status(200).json({
            mensaje: "Usuario eliminado"
        });
    } else {
        return res.redirect("/usuarios/listar");
    }

};


module.exports = {
    obtenerUsuarios,
    obtenerUsuariosVista,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    formularioNuevoUsuario,
    formularioEditarUsuario
};