const express = require('express')
const adminCtl = require('../controllers/adminController')
const Admin = require('../models/Admin')
const route = express.Router();

route.get('/', adminCtl.dashboard)
route.get('/add-admin', adminCtl.addAdmin)
route.get('/view-admin', adminCtl.viewAdmin)
route.post('/insertAdminData', Admin.uploadAdminImage, adminCtl.insertAdminData)
route.get('/delete-admin/:id', adminCtl.deleteAdmin);
route.post('/update-admin/:id', Admin.uploadAdminImage, adminCtl.updateAdmin);
route.get('/admin-details/:id', adminCtl.adminDetails);

module.exports = route;