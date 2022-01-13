const express = require('express')
const { getAppointments, getAppointmentsCompleted, createAppointment, updateAppointment, completeAppointment, deleteAppointment } = require('../controllers/AppointmentController')
const authorizeMiddleware = require('../middleware/authorizeMiddleware')
const { rolesObjects } = require('../utils/index')

const router = express.Router();

router.get('/', authorizeMiddleware([rolesObjects.ALL]), getAppointments);
router.get('/completed', authorizeMiddleware([rolesObjects.ALL]), getAppointmentsCompleted);
router.post('/add', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), createAppointment);
router.patch('/:id', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), updateAppointment);
router.post('/complete/:id', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.DOCTOR]), completeAppointment);
router.post('/delete/:id', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), deleteAppointment);

module.exports = router