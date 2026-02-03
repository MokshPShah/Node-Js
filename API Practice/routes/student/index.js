const express = require('express')
const studentCtl  = require('../../controllers/student/studentController')
const { auth, authorized } = require('../../middleware/authMiddleware')

const route = express.Router()

route.get('/dashboard', auth, authorized(['Admin', 'Teacher', 'Student']), studentCtl.studentDashboard)
route.post('/addStudent', auth, authorized(['Admin', 'Teacher']), studentCtl.addStudent)
route.get('/viewAllStudent', auth, authorized(['Admin', 'Teacher']), studentCtl.viewAllStudent)
route.get('/profile/:id', auth, authorized(['Admin', 'Teacher', 'Student']), studentCtl.profile)
route.put('/:id', auth, authorized(['Admin', 'Teacher']), studentCtl.edit)
route.delete('/:id', auth, authorized(['Admin', 'Teacher']), studentCtl.delete)

module.exports = route