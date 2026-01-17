const express = require('express');
const passport = require('passport');
const route = express.Router();
const productCtl = require('../controllers/productController')

route.get('/addProduct', passport.checkAuthentication, productCtl.addProduct)
route.get('/viewProduct', passport.checkAuthentication, productCtl.viewProduct)


module.exports = route;