const express = require('express')
const teacherController = require('../../controllers/teacher/teacherController')
const { auth, authorized } = require('../../middleware/authMiddleware')

const route = express.Router();

// dashboard, viewAll, edit, delete, profile

route.get('/dashboard', auth, authorized(['Admin', 'Teacher']), teacherController.teacherDashboard)
route.post('/addTeacher', auth, authorized(['Admin']), teacherController.addTeacher)
route.get('/viewAllTeacher', auth, authorized(['Admin']), teacherController.viewAllTeacher)
route.get('/profile/:id', auth, authorized(['Admin', 'Teacher']), teacherController.profile)
route.put('/:id', auth, authorized(['Admin']), teacherController.edit)
route.delete('/:id', auth, authorized(['Admin']), teacherController.delete)

module.exports = route