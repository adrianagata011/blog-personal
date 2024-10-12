const fs = require('fs-extra');
const path = require('path');
const postsPath = path.join(__dirname, '../data/posts.json');

// Obtener todas las publicaciones
exports.getPosts = async (req, res) => {
    const posts = await fs.readJson(postsPath);
    res.render('index', { title: 'Publicaciones', posts });
};

// Crear una nueva publicación
exports.createPost = async (req, res) => {
    const { title, content, category } = req.body;
    let posts = await fs.readJson(postsPath);

    const newPost = { id: Date.now(), title, content, category, comments: [] };
    posts.push(newPost);

    await fs.writeJson(postsPath, posts);
    res.redirect('/blog');
};
