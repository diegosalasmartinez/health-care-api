import express from 'express'
import { getPatients, createPatient } from '../controllers/PatientController.js'

const router = express.Router();

router.get('/', getPatients);
router.post('/add', createPatient);

export default router;