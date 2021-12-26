const express = require('express')
const { login } = require('../controllers/AuthController')

const router = express.Router();

router.post('/login', login);

module.exports = router