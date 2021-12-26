const express = require('express')
const { getPatients, createPatient, updatePatient, deletePatient } = require('../controllers/PatientController')

const router = express.Router();

router.get('/', getPatients);
router.post('/add', createPatient);
router.patch('/:id', updatePatient);
router.post('/delete/:id', deletePatient);

module.exports = router