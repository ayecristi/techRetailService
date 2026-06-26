# TechRetail Service

Sistema de gestión backend para **TechRetail Solutions S.R.L.**, una plataforma SaaS orientada a PyMEs que necesitan digitalizar sus canales de venta. Permite gestionar tiendas, productos, transacciones, suscripciones y usuarios, con autenticación segura y notificaciones en tiempo real.

> Proyecto final — Desarrollo Web Backend | Tecnicatura en Desarrollo de Software  
> **Integrantes:** Cristi Ayelén, Gramaccioni Lucio

🌐 **Deploy:** [https://techretailservice.onrender.com](https://techretailservice.onrender.com)

---

## Tecnologías utilizadas

| Tecnología | Versión | Rol en el proyecto |
|---|---|---|
| Node.js | >= 18 | Entorno de ejecución |
| Express | ^5.2.1 | Framework HTTP y ruteo |
| MongoDB Atlas | — | Base de datos en la nube |
| Mongoose | ^8.0.0 | ODM y modelado de datos |
| Pug | ^3.0.4 | Motor de templates (vistas) |
| express-session | ^1.19.0 | Manejo de sesiones (vistas) |
| jsonwebtoken | ^9.0.3 | Autenticación JWT (API REST) |
| bcrypt | ^6.x | Hash seguro de contraseñas |
| Socket.IO | ^4.8.3 | Comunicación en tiempo real |
| dotenv | ^17.4.2 | Variables de entorno |
| nodemon | ^3.1.14 | Recarga automática (desarrollo) |

---

## Requisitos previos

- Node.js v18 o superior
- npm
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/ayecristi/techRetailService.git
cd techRetailService

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear un archivo .env en la raíz con las siguientes variables:
# PORT=3000
# NODE_ENV=development
# MONGODB_URI=tu_cadena_de_conexion
# SESSION_SECRET=tu_clave_de_sesion
# JWT_SECRET=tu_clave_jwt
```

---

## Ejecución

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

El servidor queda disponible en `http://localhost:3000`

---

## Estructura del proyecto

```
techRetailService/
├── app.js                    # Entry point — configura Express, sesiones, rutas y Socket.IO
├── config/
│   ├── database.js           # Conexión a MongoDB Atlas
│   └── socket.js             # Inicialización y eventos de Socket.IO
├── controllers/
│   ├── authController.js     # Login, registro, logout + generación de JWT
│   ├── usuariosController.js
│   ├── productosController.js
│   ├── tiendasController.js
│   ├── transaccionesController.js
│   └── suscripcionesController.js
├── middlewares/
│   ├── auth.js               # requireAuth (sesión), verificarJWT, verificarJWTAdmin
│   ├── errorHandler.js       # Manejo centralizado de errores
│   ├── userLog.js            # Log de actividad de usuarios
│   └── validation.js         # Validaciones de entrada
├── models/
│   ├── Usuario.js
│   ├── Persona.js
│   ├── Tienda.js
│   ├── Producto.js
│   ├── Transaccion.js
│   └── Suscripcion.js
├── routes/
│   ├── authRoutes.js
│   ├── usuariosRoutes.js
│   ├── productosRoutes.js
│   ├── tiendasRoutes.js
│   ├── transaccionesRoutes.js
│   └── suscripcionesRoutes.js
├── views/                    # Templates Pug (MVC — capa Vista)
├── public/                   # Archivos estáticos (CSS)
├── data/                     # Datos auxiliares en JSON
├── constants/
│   └── enums.js              # Valores constantes del sistema
└── package.json
```

---

## Patrón de arquitectura

El proyecto sigue el patrón **MVC (Model-View-Controller)**:

- **Model** — Esquemas Mongoose en `/models`. Definen entidades, tipos, validaciones y relaciones.
- **View** — Templates Pug en `/views`. Renderizan las páginas HTML del panel de gestión.
- **Controller** — Lógica de negocio en `/controllers`. Procesan las peticiones y coordinan modelos y vistas.

---

## Autenticación y autorización

El sistema implementa **dos mecanismos de autenticación en paralelo**:

### Sesiones (para vistas web)
Las rutas del panel de administración (`/transacciones`, `/productos`, etc.) están protegidas con el middleware `requireAuth`, que verifica la sesión activa del usuario.

### JWT — JSON Web Token (para la API REST)
Las rutas bajo `/api` están protegidas con JWT. Al hacer login o registro, el servidor devuelve un token:

```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": { "id": "...", "email": "...", "rol": "admin" }
}
```

Para consumir la API, incluir el token en el header:

```
Authorization: Bearer <token>
```

| Middleware | Protege | Requiere |
|---|---|---|
| `requireAuth` | Vistas web | Sesión activa |
| `verificarJWT` | Rutas GET/POST de API | Token válido |
| `verificarJWTAdmin` | Rutas PUT/DELETE de API | Token + rol admin |

---

## WebSockets — Notificaciones en tiempo real

El sistema utiliza **Socket.IO** para emitir eventos en tiempo real a los usuarios conectados.

### Funcionamiento
- Al iniciar sesión, el cliente se une automáticamente a la sala de su tienda (`tienda-{id}`)
- Cada vez que se crea, procesa o reembolsa una transacción, el servidor emite un evento a esa sala
- Las notificaciones aparecen como un toast en la esquina inferior derecha del panel

### Eventos disponibles

| Evento | Cuándo se emite | Datos que envía |
|---|---|---|
| `nueva-transaccion` | Al crear una transacción | `{ mensaje, transaccion: { id, monto, metodoPago, estado } }` |
| `estado-transaccion` | Al procesar o reembolsar | `{ mensaje, transaccion: { id, estado, monto } }` |

---

## Endpoints principales

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/auth/login` | Formulario de login |
| POST | `/auth/login` | Iniciar sesión → devuelve JWT |
| GET | `/auth/registro` | Formulario de registro |
| POST | `/auth/registro` | Crear cuenta → devuelve JWT |
| GET | `/auth/logout` | Cerrar sesión |

### API REST (requieren JWT)
| Método | Ruta | Auth requerida |
|---|---|---|
| GET | `/transacciones/api` | `verificarJWT` |
| GET | `/transacciones/api/:id` | `verificarJWT` |
| POST | `/transacciones/api` | `verificarJWT` |
| PUT | `/transacciones/api/:id` | `verificarJWTAdmin` |
| DELETE | `/transacciones/api/:id` | `verificarJWTAdmin` |

---

## Seguridad implementada

- **Hash de contraseñas** con `bcrypt` (factor de costo 10) en registro y creación de usuarios
- **JWT** con expiración de 1 hora para la API REST
- **Sesiones** con clave secreta configurable vía variables de entorno
- **Roles**: `admin` y `vendedor` con middlewares de autorización diferenciados
- **Variables de entorno** para todas las claves sensibles
- **Validación de pertenencia**: las transacciones solo son accesibles por la tienda que las creó

---

## Licencia

Proyecto académico — Uso educativo.