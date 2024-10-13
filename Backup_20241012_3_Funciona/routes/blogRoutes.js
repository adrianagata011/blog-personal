const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');

// Configuración de las sesiones
router.use(session({
    secret: 'tuClaveSecreta', // Cambia esto por una clave secreta que solo tú conozcas
    resave: false, // No volver a guardar la sesión si no ha cambiado
    saveUninitialized: false, // No crear sesiones vacías
    cookie: { secure: false } // Debe ser true si usas HTTPS
}));

// Importar las funciones del archivo utils.js
const { loadPosts, loadUsers, savePosts, saveUsers } = require('../utils/utils');

// Importar el middleware de autenticación
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Usar el middleware de autenticación globalmente en todas las rutas
router.use(isAuthenticated); // Esto afectará a todas las rutas

// Ruta para mostrar las publicaciones
router.get('/posts', isAuthenticated, (req, res) => {
    const posts = loadPosts(); // Cargar las publicaciones desde posts.json
    const currentUser = req.session.username;
    res.render('index', { posts, currentUser}); // Pasar las publicaciones a la vista
});

router.post('/create', isAuthenticated, (req, res) => {
    const { title, content } = req.body;
    const posts = loadPosts();
    // Agregar el post con el autor sacado de la sesión
    posts.push({ title, content, author: req.session.username, comments: [] });
    savePosts(posts);
    res.redirect('/blog/posts');
});

router.get('/edit/:index', isAuthenticated, (req, res) => {
    const index = req.params.index;
    const posts = loadPosts();
    // Verificar si la publicación existe
    const post = posts[index];
    if (!post) {
        return res.status(404).send('La publicación no existe.');
    }
    const username = req.session.username;
    if (post.author === username) {
        res.render('edit', { post, index });
    } else {
        res.send('No tienes permiso para editar esta publicación.');
    }
});

router.post('/edit/:index', isAuthenticated, (req, res) => {
    const index = req.params.index;
    const { title, content } = req.body;
    const posts = loadPosts();

    // Verificar si la publicación existe
    const post = posts[index];
    if (!post) {
        return res.status(404).send('La publicación no existe.');
    }

    const username = req.session.username;
    if (post.author === username) {
        posts[index] = { 
            title: title,
            content: content,
            author: post.author,
            comments: post.comments 
        };
        savePosts(posts);
        res.redirect('/blog/posts');

    } else {
        res.status(403).send('No tienes permiso para editar esta publicación.');
//        res.send('No tienes permiso para editar esta publicación.');
    }
});

router.post('/delete/:index', isAuthenticated, (req, res) => {
    const index = req.params.index;
    const posts = loadPosts();

    // Verificar si la publicación existe
    const post = posts[index];
    if (!post) {
        return res.status(404).send('La publicación no existe.');
    }

    const username = req.session.username;
    if (post.author === username) {
        posts.splice(index, 1);
        savePosts(posts);
        res.redirect('/blog/posts');
    } else {
        res.status(403).send('No tienes permiso para eliminar esta publicación.');
    }
});

// Recibir y procesar los comentarios

router.post('/comment/:index', isAuthenticated, (req, res) => {
    const index = req.params.index;
    const { comment } = req.body;
    const posts = loadPosts();
    const post = posts[index];
    const username = req.session.username; // Usuario autenticado

    // Crear el nuevo comentario
    const newComment = {
        author: username,
        content: comment,
        date: new Date().toLocaleString() // Fecha y hora actual
    };

    // Añadir el comentario al array de comentarios de la publicación
    post.comments.push(newComment);
    savePosts(posts); // Guardar los cambios en el archivo

    // Redirigir a la página de publicaciones
    res.redirect('/blog/posts');
});

module.exports = router;