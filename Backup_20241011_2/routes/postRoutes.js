const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear publicación
router.post('/create', authMiddleware, postController.createPost);

// Editar publicación (solo si es del usuario)
router.put('/edit/:id', authMiddleware, postController.editPost);

// Eliminar publicación (solo si es del usuario)
router.delete('/delete/:id', authMiddleware, postController.deletePost);

// Añadir comentario a publicación
router.post('/comment/:id', authMiddleware, postController.addComment);

// Filtrar publicaciones por categoría
router.get('/category/:category', postController.filterByCategory);

// Búsqueda avanzada por palabra
router.get('/search', postController.searchPosts);

module.exports = router;
