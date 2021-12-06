import express from 'express'
import { getDoctors, createDoctor } from '../controllers/DoctorController.js'

const router = express.Router();

router.get('/', getDoctors);
router.post('/add', createDoctor);

export default router;