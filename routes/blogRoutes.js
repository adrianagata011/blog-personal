const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.get('/', blogController.getPosts);
router.post('/create', blogController.createPost);

module.exports = router;
