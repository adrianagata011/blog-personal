const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir archivos estáticos

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
        const posts = loadPosts();
        res.render('index', { posts });
    } else {
        res.render('login', { message: 'Usuario o contraseña incorrectos', title: 'Login' });
    }
});

app.post('/register', (req, res) => {
    const { newUsername, newPassword } = req.body;
    const users = loadUsers();

    const existingUser = users.find(u => u.username === newUsername);
    if (existingUser) {
        return res.render('register', { message: 'El usuario ya existe', title: 'Registro' });
    }

    users.push({ username: newUsername, password: newPassword });
    saveUsers(users);
    res.render('login', { message: 'Usuario registrado con éxito, ahora puedes iniciar sesión', title: 'Login' });
});

// Ruta para mostrar las publicaciones
app.get('/posts', (req, res) => {
    const posts = loadPosts(); // Cargar las publicaciones desde posts.json
    res.render('index', { posts }); // Pasar las publicaciones a la vista
});

app.post('/create', (req, res) => {
    const { title, content } = req.body;
    const posts = loadPosts();

    posts.push({ title, content });
    savePosts(posts);

    res.redirect('/posts');
});

app.get('/edit/:index', (req, res) => {
    const index = req.params.index;
    const posts = loadPosts();
    const post = posts[index];

    res.render('edit', { post, index });
});

app.post('/edit/:index', (req, res) => {
    const index = req.params.index;
    const { title, content } = req.body;
    const posts = loadPosts();

    posts[index] = { title, content };
    savePosts(posts);

    res.redirect('/');
});

app.post('/delete/:index', (req, res) => {
    const index = req.params.index;
    const posts = loadPosts();

    posts.splice(index, 1);
    savePosts(posts);

    res.redirect('/posts');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
