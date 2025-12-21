const express = require ('express')
const adminCtl = require ('../controllers/adminController')
const Admim = require('../models/Admin')
const route = express.Router();

route.get('/', adminCtl.dashboard)
route.get('/add-admin', adminCtl.addAdmin)
route.get('/view-admin', adminCtl.viewAdmin)
route.post('/insertAdminData', Admim.uploadAdminImage, adminCtl.insertAdminData)

module.exports = route;