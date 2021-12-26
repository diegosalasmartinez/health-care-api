const express = require('express')
const { getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } = require('../controllers/SpecialtyController')

const router = express.Router();

router.get('/', getSpecialties);
router.post('/add', createSpecialty);
router.patch('/:id', updateSpecialty);
router.post('/delete/:id', deleteSpecialty);

module.exports = router