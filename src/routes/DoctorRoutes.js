const express = require('express')
const { getDoctors } = require('../controllers/DoctorController')

const router = express.Router();

router.get('/', getDoctors);

module.exports = router