const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const User = require('../models/User');

// Ruta para el registro de usuarios
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Debe proporcionar un nombre de usuario y una contraseña.' });
    }

    const usersPath = path.join(__dirname, '../data/users.json');
    
    try {
        let users = await fs.readJson(usersPath);
        
        // Verificar si el usuario ya existe
        const userExists = users.find(user => user.username === username);
        if (userExists) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Crear un nuevo usuario
        const newUser = new User(username, password);
        users.push(newUser.toJSON());

        // Guardar el nuevo usuario en la base de datos JSON
        await fs.writeJson(usersPath, users);

        res.status(201).json({ message: 'Usuario registrado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario.', error });
    }
});

// Ruta para el inicio de sesión de usuarios
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Debe proporcionar un nombre de usuario y una contraseña.' });
    }

    const usersPath = path.join(__dirname, '../data/users.json');
    
    try {
        let users = await fs.readJson(usersPath);
        
        // Verificar si el usuario existe
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
        }

        // Verificar la contraseña
        const userInstance = new User(user.username, user.password);
        if (!userInstance.verifyPassword(password)) {
            return res.status(400).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión.', error });
    }
});

module.exports = router;
