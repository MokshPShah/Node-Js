const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', blogController.getAllArticles);
router.get('/my-articles', requireAuth, blogController.getMyArticles);
router.get('/create', requireAuth, blogController.getCreateForm);
router.post('/create', requireAuth, blogController.createArticle);
router.post('/delete/:id', requireAuth, blogController.deleteArticle);

module.exports = router;