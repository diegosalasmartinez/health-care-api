const express = require('express')
const { getBestDoctors, getBestSpecialties } = require('../controllers/DashboardController')
const authorizeMiddleware = require('../middleware/authorizeMiddleware')
const { rolesObjects } = require('../utils/index')

const router = express.Router();

router.get('/doctors', authorizeMiddleware([rolesObjects.ADMIN]), getBestDoctors);
router.get('/specialties', authorizeMiddleware([rolesObjects.ADMIN]), getBestSpecialties);

module.exports = router