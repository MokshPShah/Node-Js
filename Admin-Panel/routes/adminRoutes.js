const express = require('express')
const adminCtl = require('../controllers/adminController')
const Admin = require('../models/Admin')
const route = express.Router();
const checkAuth = require('../middleware/authMiddleware')
const cookieParser = require('cookie-parser')

route.use(cookieParser('4c1b33cab6c6e57a'))

route.get('/login', adminCtl.login)
route.post('/verifyLogin', adminCtl.verifyLogin)
route.get('/dashboard', checkAuth, adminCtl.dashboard)
route.get('/add-admin', checkAuth, adminCtl.addAdmin)
route.get('/view-admin', checkAuth, adminCtl.viewAdmin)
route.post('/insertAdminData', checkAuth, Admin.uploadAdminImage, adminCtl.insertAdminData)
route.get('/adminDetails/:id', checkAuth, adminCtl.adminDetails)
route.get('/delete-admin/', checkAuth, adminCtl.deleteAdmin)
route.post('/update-admin/:id', checkAuth, Admin.uploadAdminImage, adminCtl.updateAdmin)

module.exports = route;