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

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/login', (req, res) => {
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

router.post('/register', (req, res) => {
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

router.get('/logout', (req, res) => {
    req.session.destroy(); // Elimina la sesión
    res.redirect('/');
});

module.exports = router;