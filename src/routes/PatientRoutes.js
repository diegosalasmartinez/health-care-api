import express from 'express'
import { getPatients, createPatient, updatePatient, deletePatient } from '../controllers/PatientController.js'

const router = express.Router();

router.get('/', getPatients);
router.post('/add', createPatient);
router.post('/:id', updatePatient);
router.post('/delete/:id', deletePatient);

export default router;