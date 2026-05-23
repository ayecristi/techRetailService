const PLANES_SUSCRIPCION = {
    BASICO: 'basico',
    PROFESIONAL: 'profesional',
    ENTERPRISE: 'enterprise'
};

const ESTADOS_SUSCRIPCION = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
    CANCELADO: 'cancelado'
};

const DETALLES_PLANES = {
    [PLANES_SUSCRIPCION.BASICO]: {
        nombre: 'Básico',
        precio: 5000,
        tagline: 'Ideal para comenzar tu negocio digital',
        destacado: false,
        caracteristicas: [
            '1 Tienda online',
            'Hasta 50 productos',
            'Soporte por email 24/7',
            'Panel de control básico',
            'Integración de WhatsApp'
        ]
    },
    [PLANES_SUSCRIPCION.PROFESIONAL]: {
        nombre: 'Profesional',
        precio: 12000,
        tagline: 'La opción más popular para hacer crecer tu marca',
        destacado: true,
        caracteristicas: [
            'Todo lo del plan Básico',
            'Productos ilimitados',
            'Soporte prioritario 24/7',
            'Estadísticas avanzadas',
            'Integración con múltiples medios de pago',
            'Dominio personalizado'
        ]
    },
    [PLANES_SUSCRIPCION.ENTERPRISE]: {
        nombre: 'Enterprise',
        precio: 30000,
        tagline: 'Para grandes operaciones y necesidades complejas',
        destacado: false,
        caracteristicas: [
            'Todo lo del plan Profesional',
            'Múltiples tiendas',
            'Soporte dedicado por teléfono',
            'API de integración a medida',
            'Reportes mensuales personalizados',
            'Conciliación de cuentas automatizada'
        ]
    }
};

module.exports = {
    PLANES_SUSCRIPCION,
    ESTADOS_SUSCRIPCION,
    DETALLES_PLANES
};