const express = require('express')
const adminCtl = require('../controllers/adminController')
const Admin = require('../models/Admin')
const route = express.Router();

route.get('/', adminCtl.dashboard)
route.get('/add-admin', adminCtl.addAdmin)
route.get('/view-admin', adminCtl.viewAdmin)
route.post('/insertAdminData', Admin.uploadAdminImage, adminCtl.insertAdminData)
route.get('/adminDetails/:id', adminCtl.adminDetails)
route.get('/delete-admin/', adminCtl.deleteAdmin)
route.post('/update-admin/', Admin.uploadAdminImage, adminCtl.updateAdmin)

module.exports = route;