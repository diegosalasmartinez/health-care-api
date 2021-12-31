const express = require('express')
const { getDoctors } = require('../controllers/DoctorController');
const authorizeMiddleware = require('../middleware/authorizeMiddleware')
const { rolesObjects } = require('../utils');

const router = express.Router();

router.get('/', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), getDoctors);

module.exports = router