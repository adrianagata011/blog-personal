const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ruta a la base de datos JSON de posts
const postsFile = path.join(__dirname, '../data/posts.json');

// Ruta para mostrar los posts en la página principal
router.get('/', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(postsFile));
    res.render('index', { title: 'Blog Personal', posts });
});

// Ruta para agregar un post
router.post('/add', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(postsFile));

    // Crear nuevo post
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date().toISOString().split('T')[0]
    };

    // Agregarlo a la lista de posts
    posts.push(newPost);

    // Guardar el archivo
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

    // Redirigir a la página principal
    res.redirect('/blog');
});

// Ruta para eliminar un post
router.post('/delete/:id', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(postsFile));

    // Filtrar los posts para eliminar el que tiene el ID dado
    const filteredPosts = posts.filter(post => post.id != req.params.id);

    // Guardar los cambios
    fs.writeFileSync(postsFile, JSON.stringify(filteredPosts, null, 2));

    // Redirigir a la página principal
    res.redirect('/blog');
});

module.exports = router;
