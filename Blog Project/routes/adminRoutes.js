const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/admin', requireAuth, requireAdmin, adminController.getDashboard);
router.post('/admin/delete-user/:id', requireAuth, requireAdmin, adminController.deleteUser);

module.exports = router;