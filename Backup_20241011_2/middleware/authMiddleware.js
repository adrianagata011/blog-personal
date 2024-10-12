// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    // Verifica si el usuario está autenticado
    if (!req.user) {
        return res.status(401).send('No autorizado. Inicia sesión para continuar.');
    }
    next(); // Si está autenticado, pasa al siguiente middleware o ruta
};

module.exports = authMiddleware;
