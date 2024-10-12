const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir archivos estáticos

// Configuración de las sesiones
app.use(session({
    secret: 'tuClaveSecreta', // Cambia esto por una clave secreta que solo tú conozcas
    resave: false, // No volver a guardar la sesión si no ha cambiado
    saveUninitialized: false, // No crear sesiones vacías
    cookie: { secure: false } // Debe ser true si usas HTTPS
}));

// Cargar usuarios desde data.json
function loadUsers() {
    try {
        const data = fs.readFileSync('data/usuarios.json');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Guardar usuarios en data.json
function saveUsers(users) {
    fs.writeFileSync('data/usuarios.json', JSON.stringify(users, null, 2));
}

// Cargar publicaciones desde posts.json
function loadPosts() {
    try {
        const data = fs.readFileSync('data/posts.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar las publicaciones:', error);
        return [];
    }
}

// Guardar publicaciones en posts.json
function savePosts(posts) {
    fs.writeFileSync('data/posts.json', JSON.stringify(posts, null, 2));
}

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.username = username;
        const posts = loadPosts();
        res.render('index', { posts: loadPosts(), currentUser: username });
    } else {
        res.render('login', { message: 'Usuario o contraseña incorrectos', messageType: 'error' });
    }
});

app.post('/register', (req, res) => {
    const { newUsername, newPassword } = req.body;
    const users = loadUsers();

    const existingUser = users.find(u => u.username === newUsername);
    if (existingUser) {
        return res.render('register', { message: 'El usuario ya existe', messageType: 'error' });
    }

    users.push({ username: newUsername, password: newPassword });
    saveUsers(users);
    res.render('login', { message: 'Usuario registrado', messageType: 'success' });
});

// Ruta para mostrar las publicaciones
app.get('/posts', (req, res) => {
    const posts = loadPosts(); // Cargar las publicaciones desde posts.json
    const currentUser = req.session.username;
    res.render('index', { posts, currentUser}); // Pasar las publicaciones a la vista
});

// Ruta para crear publicaciones

app.post('/create', (req, res) => {
    const { title, content } = req.body;
    const posts = loadPosts();
    if (req.session.username) {
        // Agregar el post con el autor sacado de la sesión
        posts.push({ title, content, author: req.session.username, comments: [] });
        savePosts(posts);
        res.redirect('/posts');
    } else {
        res.redirect('/login');
    }
});

app.get('/edit/:index', (req, res) => {
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

app.post('/edit/:index', (req, res) => {
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
        res.redirect('/posts');

    } else {
        res.status(403).send('No tienes permiso para editar esta publicación.');
//        res.send('No tienes permiso para editar esta publicación.');
    }
});

app.post('/delete/:index', (req, res) => {
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
        res.redirect('/posts');
    } else {
        res.status(403).send('No tienes permiso para eliminar esta publicación.');
    }
});

// Recibir y procesar los comentarios

app.post('/comment/:index', (req, res) => {
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
    res.redirect('/posts');
});

app.get('/logout', (req, res) => {
    req.session.destroy(); // Elimina la sesión
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
