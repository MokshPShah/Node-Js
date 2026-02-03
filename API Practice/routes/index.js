const express = require("express");
const authRoutes = require("./auth/index")
const adminRoutes = require("./admin/index")
const teacherRoutes = require("./teacher/index")
const studentRoutes = require("./student/index")

const route = express.Router();

route.use('/auth', authRoutes)
route.use('/admin', adminRoutes)
route.use('/teacher', teacherRoutes)
route.use('/student', studentRoutes)

module.exports = route;