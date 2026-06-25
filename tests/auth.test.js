const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Usuario = require('../models/Usuario');
const Persona = require('../models/Persona');
const Tienda = require('../models/Tienda');
const Suscripcion = require('../models/Suscripcion');

describe('Auth API REST', () => {
    const uniqueSuffix = Date.now();
    const testEmail = `user_${uniqueSuffix}@auth-test.com`;
    const testPassword = 'Password123!';
    const tiendaName = `Tienda Test ${uniqueSuffix}`;

    beforeAll(async () => {
        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve) => {
                mongoose.connection.once('connected', resolve);
            });
        }
    });

    afterAll(async () => {
        // Limpiar datos creados
        const user = await Usuario.findOne({ email: testEmail });
        if (user) {
            await Persona.findByIdAndDelete(user.personaId);
            await Tienda.findByIdAndDelete(user.tiendaId);
            await Suscripcion.findOneAndDelete({ tiendaId: user.tiendaId });
            await Usuario.findByIdAndDelete(user._id);
        }
        await mongoose.connection.close();
    });

    describe('POST /auth/registro', () => {
        it('debe registrar un nuevo usuario con éxito (201) y retornar un token', async () => {
            const res = await request(app)
                .post('/auth/registro')
                .send({
                    usuario: {
                        email: testEmail,
                        password: testPassword
                    },
                    persona: {
                        nombre: 'Juan',
                        apellido: 'Perez'
                    },
                    tienda: {
                        nombre: tiendaName,
                        cuit: '20-12345678-9',
                        whatsapp: '+5493415555555'
                    },
                    plan: 'basico'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.mensaje).toContain('registradas exitosamente');
        });

        it('debe fallar (409) si el email está duplicado', async () => {
            const res = await request(app)
                .post('/auth/registro')
                .send({
                    usuario: {
                        email: testEmail,
                        password: testPassword
                    },
                    persona: {
                        nombre: 'Otro',
                        apellido: 'Nombre'
                    },
                    tienda: {
                        nombre: 'Otra Tienda'
                    }
                });

            expect(res.status).toBe(409);
            expect(res.body.mensaje).toContain('existe un usuario');
        });

        it('debe fallar (400) si faltan campos obligatorios', async () => {
            const res = await request(app)
                .post('/auth/registro')
                .send({
                    usuario: {
                        email: testEmail
                    },
                    persona: {
                        nombre: 'Juan'
                    },
                    tienda: {
                        nombre: ''
                    }
                });

            expect(res.status).toBe(400);
            expect(res.body.mensaje).toContain('Faltan datos obligatorios');
        });
    });

    describe('POST /auth/login', () => {
        it('debe iniciar sesión exitosamente (200) con credenciales correctas', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testEmail,
                    password: testPassword
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('usuario');
            expect(res.body.usuario.email).toBe(testEmail);
        });

        it('debe fallar (401) con contraseña incorrecta', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testEmail,
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.mensaje).toContain('incorrectos');
        });

        it('debe fallar (401) con email no existente', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: `non-existent-${Date.now()}@auth-test.com`,
                    password: testPassword
                });

            expect(res.status).toBe(401);
            expect(res.body.mensaje).toContain('incorrectos');
        });
    });
});
