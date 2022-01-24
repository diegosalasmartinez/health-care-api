const express = require('express')
const { getPatients, createPatient, updatePatient, updatePatientHistory , deletePatient } = require('../controllers/PatientController')
const authorizeMiddleware = require('../middleware/authorizeMiddleware')
const { rolesObjects } = require('../utils');

const router = express.Router();

router.get('/', authorizeMiddleware([rolesObjects.ALL]), getPatients);
router.post('/add', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), createPatient);
router.patch('/:id', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), updatePatient);
router.patch('/:id/history', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.DOCTOR]), updatePatientHistory);
router.post('/delete/:id', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), deletePatient);

module.exports = router