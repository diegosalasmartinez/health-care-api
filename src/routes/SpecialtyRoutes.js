import express from 'express'
import { getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from '../controllers/SpecialtyController.js'

const router = express.Router();

router.get('/', getSpecialties);
router.post('/add', createSpecialty);
router.patch('/:id', updateSpecialty);
router.post('/delete/:id', deleteSpecialty);

export default router;