const express = require('express')
const { adminDashboard } = require('../../controllers/admin/adminController.js')
const { auth, authorized } = require('../../middleware/authMiddleware.js')

const route = express.Router();

route.get('/dashboard', auth, authorized(['Admin']), adminDashboard)

module.exports = route;