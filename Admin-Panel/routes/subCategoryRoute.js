const express = require('express')
const categoryCtl = require('../controllers/categoryController')
const Category = require('../models/Category');
const passport = require('passport');

const route = express.Router();


module.exports = route;