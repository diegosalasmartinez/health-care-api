import express from 'express'
import { getDoctors } from '../controllers/DoctorController.js'

const router = express.Router();

router.get('/', getDoctors);

export default router;