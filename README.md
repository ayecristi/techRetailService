# TechRetail Service

Un servicio backend modular para gestión de transacciones comerciales desarrollado con Node.js, Express y MongoDB.

## 🎯 Objetivos Específicos

- ✅ Arquitectura modular y organizada
- ✅ Integración con base de datos MongoDB usando Mongoose
- ✅ Uso de middlewares, rutas y controladores
- ✅ Manejo de errores implementado
- ✅ Validaciones simples implementadas
- ✅ Programación asincrónica con async/await
- ✅ Documentación completa del proyecto

## 🏗️ Arquitectura

```
techRetailService/
├── config/
│   └── database.js          # Conexión a MongoDB
├── controllers/
│   ├── usuariosController.js
│   └── transaccionesController.js
├── middlewares/
│   ├── errorHandler.js      # Manejo de errores
│   ├── userLog.js          # Logging de requests
│   └── validation.js       # Validaciones de entrada
├── models/
│   ├── Usuario.js          # Modelo de Usuario (Mongoose)
│   └── Transaccion.js      # Modelo de Transacción (Mongoose)
├── routes/
│   ├── usuariosRoutes.js
│   └── transaccionesRoutes.js
├── views/                  # Templates Pug
├── public/                 # Archivos estáticos
├── data/                   # Datos JSON (legacy)
├── app.js                  # Punto de entrada
├── package.json
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd techRetailService
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Editar el archivo `.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/techretail
   ```

4. **Iniciar MongoDB**

   Asegurarse de que MongoDB esté corriendo localmente o configurar la URI de conexión.

5. **Ejecutar la aplicación**
   ```bash
   # Modo desarrollo
   npm run dev

   # Modo producción
   npm start
   ```

## 📡 API Endpoints

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/usuarios/api` | Obtener todos los usuarios |
| GET | `/usuarios/api/:id` | Obtener usuario por ID |
| POST | `/usuarios/api` | Crear nuevo usuario |
| PUT | `/usuarios/api/:id` | Actualizar usuario |
| DELETE | `/usuarios/api/:id` | Eliminar usuario |

### Transacciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/transacciones/api` | Obtener todas las transacciones |
| GET | `/transacciones/api/:id` | Obtener transacción por ID |
| POST | `/transacciones/api` | Crear nueva transacción |
| PUT | `/transacciones/api/:id` | Actualizar transacción |
| DELETE | `/transacciones/api/:id` | Eliminar transacción |
| POST | `/transacciones/procesar/:id` | Procesar venta |
| POST | `/transacciones/reembolsar/:id` | Reembolsar transacción |

### Interfaz Web

- **Inicio**: `http://localhost:3000`
- **Usuarios**: `http://localhost:3000/usuarios/listar`
- **Transacciones**: `http://localhost:3000/transacciones/listar`

## 🗄️ Modelos de Datos

### Usuario
```javascript
{
  nombre: String (requerido, 2-50 caracteres),
  email: String (requerido, único, formato email),
  rol: String (admin/cliente/vendedor, default: cliente),
  telefono: String (opcional, formato teléfono),
  password: String (requerido, min 6 caracteres),
  tiendaId: ObjectId (referencia a Tienda),
  activo: Boolean (default: true),
  fechaCreacion: Date (auto-generado)
}
```

### Transacción
```javascript
{
  tiendaId: ObjectId (requerido),
  usuarioId: ObjectId (requerido),
  monto: Number (requerido, positivo),
  comision: Number (default: 0),
  montoNeto: Number (calculado),
  descripcion: String (opcional, max 500 caracteres),
  metodoPago: String (efectivo/tarjeta/transferencia/paypal/criptomoneda),
  estado: String (pendiente/completado/cancelado/reembolsado),
  items: Array (productos en la transacción),
  referencia: String (única, opcional),
  creadoEn: Date,
  actualizadoEn: Date
}
```

## 🔧 Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB con Mongoose ODM
- **Templates**: Pug (anteriormente Jade)
- **Middleware**: Express middleware personalizado
- **Validación**: Middleware de validación personalizado + Mongoose
- **Configuración**: dotenv para variables de entorno

## 🛡️ Validaciones Implementadas

### Validaciones de Usuario
- Nombre: requerido, 2-50 caracteres
- Email: requerido, formato válido, único
- Contraseña: requerida, mínimo 6 caracteres
- Rol: debe ser admin, cliente o vendedor
- Teléfono: formato válido (opcional)

### Validaciones de Transacción
- Tienda ID: requerido, ObjectId válido
- Usuario ID: requerido, ObjectId válido
- Monto: requerido, número positivo
- Método de pago: valores permitidos específicos

## ⚠️ Manejo de Errores

El sistema incluye middleware centralizado de manejo de errores que captura:

- Errores de validación de Mongoose
- IDs inválidos (CastError)
- Valores duplicados (códigos 11000)
- Errores de JWT (si se implementa autenticación)
- Errores generales del servidor

## 🔄 Programación Asincrónica

Todo el código utiliza `async/await` para:

- Operaciones de base de datos con Mongoose
- Lectura/escritura de archivos (legacy)
- Conexión a base de datos
- Manejo de requests HTTP

## 📝 Scripts Disponibles

```bash
npm start          # Inicia el servidor en modo producción
npm run dev        # Inicia con nodemon para desarrollo
npm test           # Ejecuta tests (por implementar)
```

## 🔍 Testing

Para probar la API, puedes usar:

- **Thunder Client** (extensión de VS Code)
- **Postman**
- **curl** commands
- **Interfaz web** incluida

### Ejemplos de Requests

```bash
# Crear usuario
curl -X POST http://localhost:3000/usuarios/api \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "123456",
    "rol": "cliente"
  }'

# Obtener transacciones
curl http://localhost:3000/transacciones/api
```

## 🚀 Despliegue

### Variables de Entorno para Producción

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/techretail
PORT=3000
```

### Construcción para Producción

```bash
npm install --production
npm start
```

## 📋 Próximas Mejoras

- [ ] Implementar autenticación JWT
- [ ] Agregar tests unitarios e integración
- [ ] Implementar logging avanzado
- [ ] Agregar rate limiting
- [ ] Implementar caché (Redis)
- [ ] Documentación de API con Swagger
- [ ] Containerización con Docker

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Autor**: [Tu Nombre]
- **Email**: [tu.email@example.com]
- **Proyecto**: TechRetail Service v1.0.0

---

*Desarrollado con ❤️ para el curso de Backend - IFTS*