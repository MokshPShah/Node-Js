const express = require('express');
const passport = require('passport');
const route = express.Router();
const productCtl = require('../controllers/productController');
const Product = require('../models/Products');

route.get('/addProduct', passport.checkAuthentication, productCtl.addProduct)
route.post('/insertProduct', passport.checkAuthentication, Product.uploadProductImage, productCtl.insertProduct)
route.get('/viewProduct', passport.checkAuthentication, productCtl.viewProduct)
route.get('/changeStatus', passport.checkAuthentication, productCtl.changeStatus)


module.exports = route;