const express = require('express')
const adminCtl = require('../controllers/adminController')
const Admin = require('../models/Admin')
const route = express.Router();
const cookieParser = require('cookie-parser')

route.use(cookieParser())

route.get('/login', adminCtl.login)
route.post('/verifyLogin', adminCtl.verifyLogin)
route.get('/logout', adminCtl.logout)
route.get('/dashboard', adminCtl.dashboard)
route.get('/profile', adminCtl.profile)
route.post('/update-profile', Admin.uploadAdminImage, adminCtl.updateProfile)
route.get('/add-admin', adminCtl.addAdmin)
route.get('/view-admin', adminCtl.viewAdmin)
route.post('/insertAdminData', Admin.uploadAdminImage, adminCtl.insertAdminData)
route.get('/adminDetails/:id', adminCtl.adminDetails)
route.get('/delete-admin/', adminCtl.deleteAdmin)
route.post('/update-admin/:id', Admin.uploadAdminImage, adminCtl.updateAdmin)

module.exports = route;