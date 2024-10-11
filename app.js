const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs'); // Agregar para leer el archivo JSON

const app = express();

// Configuración del motor de plantillas Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware para parsear el cuerpo de la solicitud
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cargar publicaciones desde el archivo JSON
let posts = [];
fs.readFile(path.join(__dirname, 'data', 'posts.json'), 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo de publicaciones:', err);
        return;
    }
    posts = JSON.parse(data);
});

// Rutas
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/blog', blogRoutes);
app.use('/user', userRoutes);

// Página principal
app.get('/', (req, res) => {
    res.render('index', { title: 'Blog Personal', posts: posts });
});

// Manejo de errores
app.use((req, res) => {
    res.status(404).render('error', { message: 'Página no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
