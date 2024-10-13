const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir archivos estáticos

// Importar middleware de autenticación a nivel global
const { isAuthenticated } = require('./middlewares/authMiddleware');

// Configuración de las sesiones
app.use(session({
    secret: 'tuClaveSecreta', // Cambia esto por una clave secreta que solo tú conozcas
    resave: false, // No volver a guardar la sesión si no ha cambiado
    saveUninitialized: false, // No crear sesiones vacías
    cookie: { secure: false } // Debe ser true si usas HTTPS
}));

// Rutas
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/blog', blogRoutes);
app.use('/user', userRoutes);

// Página principal
app.get('/', (req, res) => {
    res.render('login');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
