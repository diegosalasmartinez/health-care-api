const express = require('express')
const { getDoctors } = require('../controllers/DashboardController')
const authorizeMiddleware = require('../middleware/authorizeMiddleware')
const { rolesObjects } = require('../utils/index')

const router = express.Router();

router.get('/doctors', authorizeMiddleware([rolesObjects.ADMIN]), getDoctors);

module.exports = router