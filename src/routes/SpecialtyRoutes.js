const express = require('express')
const { getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } = require('../controllers/SpecialtyController')
const authorizeMiddleware = require('../middleware/authorizeMiddleware')
const { rolesObjects } = require('../utils/index')
const router = express.Router();

router.get('/', authorizeMiddleware([rolesObjects.ALL]), getSpecialties);
router.post('/add', createSpecialty);
router.patch('/:id', updateSpecialty);
router.post('/delete/:id', deleteSpecialty);

module.exports = router