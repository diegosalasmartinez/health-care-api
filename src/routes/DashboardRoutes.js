const express = require('express')
const { getBestDoctors, getBestSpecialties, getHistory } = require('../controllers/DashboardController')
const authorizeMiddleware = require('../middleware/authorizeMiddleware')
const { rolesObjects } = require('../utils/index')

const router = express.Router();

router.get('/doctors', authorizeMiddleware([rolesObjects.ADMIN]), getBestDoctors);
router.get('/specialties', authorizeMiddleware([rolesObjects.ADMIN]), getBestSpecialties);
router.get('/history', authorizeMiddleware([rolesObjects.ADMIN]), getHistory);

module.exports = router