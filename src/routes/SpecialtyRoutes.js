const express = require('express')
const { getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } = require('../controllers/SpecialtyController')
const authorizeMiddleware = require('../middleware/authorizeMiddleware')
const { rolesObjects } = require('../utils/index')

const router = express.Router();

router.get('/', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), getSpecialties);
router.post('/add', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), createSpecialty);
router.patch('/:id', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), updateSpecialty);
router.post('/delete/:id', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), deleteSpecialty);

module.exports = router