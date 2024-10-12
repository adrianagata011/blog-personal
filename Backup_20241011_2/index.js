const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// Controladores
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Configuración de sesiones
app.use(session({
    secret: 'tu-secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// Rutas para los usuarios
app.use('/users', userController);

// Rutas para las publicaciones
app.use('/posts', postController);

// Manejo de errores 400
app.use((req, res) => {
    res.status(400).render('400');
});

// Manejo de errores 401
app.use((req, res) => {
    res.status(401).render('401');
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('404');
});

// Manejo de errores genéricos
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
