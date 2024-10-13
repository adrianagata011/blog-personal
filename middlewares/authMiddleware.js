// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.session && req.session.username) {
        // Si el usuario está autenticado, continúa con la siguiente función en la cadena
        return next();
    } else {
        // Si no está autenticado, redirige al usuario a la página de login
        res.redirect('/');
    }
}

module.exports = { isAuthenticated };