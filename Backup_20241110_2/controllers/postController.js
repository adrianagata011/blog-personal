const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ruta para leer publicaciones desde un archivo JSON
const getPosts = () => {
    const data = fs.readFileSync(path.join(__dirname, '../data/posts.json'));
    return JSON.parse(data);
};

// Ruta para guardar las publicaciones en el archivo JSON
const savePosts = (posts) => {
    fs.writeFileSync(path.join(__dirname, '../data/posts.json'), JSON.stringify(posts, null, 2));
};

// Obtener todas las publicaciones
router.get('/', (req, res) => {
    const posts = getPosts();
    res.render('posts', { posts });
});

// Crear una nueva publicación
router.post('/new', (req, res) => {
    const { title, content, category } = req.body;
    const posts = getPosts();
    const newPost = {
        id: Date.now(), // Generar un ID único
        title,
        content,
        category,
        comments: [],
        createdAt: new Date().toISOString(),
        author: req.user ? req.user.username : 'Anónimo' // Suponiendo que el nombre de usuario está en req.user
    };
    posts.push(newPost);
    savePosts(posts);
    res.redirect('/posts');
});

// Editar una publicación
router.post('/:id/edit', (req, res) => {
    const { title, content, category } = req.body;
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.params.id));

    if (post) {
        post.title = title;
        post.content = content;
        post.category = category;
        savePosts(posts);
        res.redirect('/posts');
    } else {
        res.status(404).send('Publicación no encontrada');
    }
});

// Eliminar una publicación
router.post('/:id/delete', (req, res) => {
    const posts = getPosts();
    const updatedPosts = posts.filter(p => p.id !== parseInt(req.params.id));
    savePosts(updatedPosts);
    res.redirect('/posts');
});

// Agregar un comentario a una publicación
router.post('/:id/comments', (req, res) => {
    const { comment } = req.body;
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.params.id));

    if (post) {
        post.comments.push({
            text: comment,
            createdAt: new Date().toISOString(),
            author: req.user ? req.user.username : 'Anónimo'
        });
        savePosts(posts);
        res.redirect(`/posts/${post.id}`);
    } else {
        res.status(404).send('Publicación no encontrada');
    }
});

// Obtener detalles de una publicación
router.get('/:id', (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.params.id));
    
    if (post) {
        res.render('postDetail', { post });
    } else {
        res.status(404).send('Publicación no encontrada');
    }
});

module.exports = router;
