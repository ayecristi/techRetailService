const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Usuario = require('../models/Usuario');
const Persona = require('../models/Persona');
const Tienda = require('../models/Tienda');
const Suscripcion = require('../models/Suscripcion');
const Producto = require('../models/Producto');

describe('Productos API REST', () => {
    let token;
    let tiendaId;
    let testProductoId;
    const uniqueSuffix = Date.now();
    const testEmail = `user_${uniqueSuffix}@prod-test.com`;
    const testPassword = 'Password123!';

    beforeAll(async () => {
        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve) => {
                mongoose.connection.once('connected', resolve);
            });
        }

        // Registrar admin completo
        const resReg = await request(app)
            .post('/auth/registro')
            .send({
                usuario: { email: testEmail, password: testPassword },
                persona: { nombre: 'Test', apellido: 'ProductUser' },
                tienda: { nombre: `Tienda Prod ${uniqueSuffix}` },
                plan: 'basico'
            });

        token = resReg.body.token;

        // Recuperar tiendaId
        const user = await Usuario.findOne({ email: testEmail });
        tiendaId = user.tiendaId;

        // Crear producto de referencia
        const prodRef = new Producto({
            tiendaId,
            nombre: 'Producto Referencia',
            precio: 100,
            stock: 20,
            categoria: 'Varios'
        });
        const savedProd = await prodRef.save();
        testProductoId = savedProd._id;
    });

    afterAll(async () => {
        // Limpiar datos creados
        const user = await Usuario.findOne({ email: testEmail });
        if (user) {
            await Persona.findByIdAndDelete(user.personaId);
            await Tienda.findByIdAndDelete(user.tiendaId);
            await Suscripcion.findOneAndDelete({ tiendaId: user.tiendaId });
            await Producto.deleteMany({ tiendaId: user.tiendaId });
            await Usuario.findByIdAndDelete(user._id);
        }
        await mongoose.connection.close();
    });

    describe('GET /productos/api', () => {
        it('debe fallar (401) sin token', async () => {
            const res = await request(app).get('/productos/api');
            expect(res.status).toBe(401);
        });

        it('debe retornar catálogo (200) con token', async () => {
            const res = await request(app)
                .get('/productos/api')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('POST /productos/api', () => {
        it('debe crear un producto (201) con datos válidos y token', async () => {
            const res = await request(app)
                .post('/productos/api')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nombre: 'Remera Negra',
                    descripcion: 'Remera 100% algodón',
                    precio: 2500,
                    stock: 50,
                    categoria: 'Ropa'
                });

            expect(res.status).toBe(201);
            expect(res.body.nombre).toBe('Remera Negra');
            expect(res.body.precio).toBe(2500);
        });

        it('debe fallar (400) si falta el nombre o el precio', async () => {
            const res = await request(app)
                .post('/productos/api')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    descripcion: 'Falta precio y nombre',
                    stock: 10
                });

            expect(res.status).toBe(400);
        });
    });

    describe('PUT /productos/api/:id', () => {
        it('debe actualizar el producto (200) si pertenece a su tienda', async () => {
            const res = await request(app)
                .put(`/productos/api/${testProductoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nombre: 'Producto Referencia Modificado',
                    precio: 150,
                    stock: 25
                });

            expect(res.status).toBe(200);
            expect(res.body.producto.nombre).toBe('Producto Referencia Modificado');
            expect(res.body.producto.precio).toBe(150);
        });
    });

    describe('DELETE /productos/api/:id', () => {
        it('debe eliminar el producto (200) si pertenece a su tienda', async () => {
            const res = await request(app)
                .delete(`/productos/api/${testProductoId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.mensaje).toBe('Producto eliminado');

            // Verificar que ya no existe
            const checkProd = await Producto.findById(testProductoId);
            expect(checkProd).toBeNull();
        });
    });
});
