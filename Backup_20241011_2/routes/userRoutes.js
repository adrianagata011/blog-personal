const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registro de usuario
router.post('/users/register', userController.registerUser);

// Inicio de sesión de usuario
router.post('/users/login', userController.loginUser);

// Middleware para proteger rutas
router.use(userController.authMiddleware);

module.exports = router;
