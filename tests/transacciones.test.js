const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Usuario = require('../models/Usuario');
const Persona = require('../models/Persona');
const Tienda = require('../models/Tienda');
const Suscripcion = require('../models/Suscripcion');
const Transaccion = require('../models/Transaccion');

describe('Transacciones API REST', () => {
    let token;
    let tiendaId;
    let usuarioId;
    let testTransaccionId;
    const uniqueSuffix = Date.now();
    const testEmail = `user_${uniqueSuffix}@tx-test.com`;
    const testPassword = 'Password123!';

    beforeAll(async () => {
        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve) => {
                mongoose.connection.once('connected', resolve);
            });
        }

        // Crear cuenta completa para obtener token y datos
        const resReg = await request(app)
            .post('/auth/registro')
            .send({
                usuario: { email: testEmail, password: testPassword },
                persona: { nombre: 'Test', apellido: 'User' },
                tienda: { nombre: `Tienda Tx ${uniqueSuffix}` },
                plan: 'basico'
            });

        token = resReg.body.token;

        // Login para rescatar usuarioId y tiendaId
        const resLogin = await request(app)
            .post('/auth/login')
            .send({ email: testEmail, password: testPassword });

        tiendaId = resLogin.body.usuario.tiendaId || (await Usuario.findOne({ email: testEmail })).tiendaId;
        usuarioId = resLogin.body.usuario.id;

        // Crear una transacción de referencia
        const txRef = new Transaccion({
            tiendaId,
            usuarioId,
            monto: 1500,
            metodoPago: 'efectivo',
            descripcion: 'Venta de referencia',
            referencia: `REF-${uniqueSuffix}-1`
        });
        const savedTx = await txRef.save();
        testTransaccionId = savedTx._id;
    });

    afterAll(async () => {
        // Limpiar datos creados
        const user = await Usuario.findOne({ email: testEmail });
        if (user) {
            await Persona.findByIdAndDelete(user.personaId);
            await Tienda.findByIdAndDelete(user.tiendaId);
            await Suscripcion.findOneAndDelete({ tiendaId: user.tiendaId });
            await Transaccion.deleteMany({ tiendaId: user.tiendaId });
            await Usuario.findByIdAndDelete(user._id);
        }
        await mongoose.connection.close();
    });

    describe('GET /transacciones/api', () => {
        it('debe fallar (401) sin token', async () => {
            const res = await request(app).get('/transacciones/api');
            expect(res.status).toBe(401);
        });

        it('debe retornar lista (200) con token válido', async () => {
            const res = await request(app)
                .get('/transacciones/api')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('transacciones');
            expect(Array.isArray(res.body.transacciones)).toBe(true);
            expect(res.body).toHaveProperty('total');
            expect(res.body).toHaveProperty('pagina');
        });
    });

    describe('POST /transacciones/api', () => {
        it('debe crear transacción con éxito (201)', async () => {
            const res = await request(app)
                .post('/transacciones/api')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    tiendaId,
                    usuarioId,
                    monto: 350.50,
                    metodoPago: 'tarjeta',
                    descripcion: 'Compra express',
                    referencia: `REF-${uniqueSuffix}-2`
                });

            expect(res.status).toBe(201);
            expect(res.body.transaccion.monto).toBe(350.50);
            expect(res.body.transaccion.metodoPago).toBe('tarjeta');
        });

        it('debe fallar (400) si falta el monto', async () => {
            const res = await request(app)
                .post('/transacciones/api')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    tiendaId,
                    usuarioId,
                    metodoPago: 'tarjeta',
                    referencia: `REF-${uniqueSuffix}-3`
                });

            expect(res.status).toBe(400);
        });
    });

    describe('GET /transacciones/api/:id', () => {
        it('debe retornar la transacción (200) con ID válido y token', async () => {
            const res = await request(app)
                .get(`/transacciones/api/${testTransaccionId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body._id).toBe(String(testTransaccionId));
        });

        it('debe retornar 400 con ID inválido', async () => {
            const res = await request(app)
                .get('/transacciones/api/invalidid')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(400);
            expect(res.body.mensaje).toContain('inválido');
        });

        it('debe retornar 404 con ID inexistente', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/transacciones/api/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.mensaje).toContain('no encontrada');
        });
    });
});
