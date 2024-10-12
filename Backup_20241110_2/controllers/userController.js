const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Función para leer los usuarios desde un archivo JSON
const getUsers = () => {
    const data = fs.readFileSync(path.join(__dirname, '../data/users.json'));
    return JSON.parse(data);
};

// Función para guardar usuarios en el archivo JSON
const saveUsers = (users) => {
    fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 2));
};

// Ruta para el inicio de sesión
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        req.session.user = user; // Guardar el usuario en la sesión
        res.redirect('/posts'); // Redirigir a la página de publicaciones
    } else {
        res.status(401).render('login', { error: 'Usuario o contraseña incorrectos.' });
    }
});

// Ruta para el cierre de sesión
router.get('/logout', (req, res) => {
    req.session.destroy(); // Destruir la sesión
    res.redirect('/'); // Redirigir a la página de inicio
});

// Ruta para registrar un nuevo usuario
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();

    if (users.find(u => u.username === username)) {
        return res.status(400).render('400', { error: 'El usuario ya existe.' });
    }

    users.push({ username, password });
    saveUsers(users);
    res.redirect('/users/login');
});

module.exports = router;
