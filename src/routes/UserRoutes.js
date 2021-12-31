const express = require('express')
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/UserController')
const authorizeMiddleware = require('../middleware/authorizeMiddleware')
const { rolesObjects } = require('../utils/index')

const router = express.Router();

router.get('/', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), getUsers);
router.post('/add', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), createUser);
router.patch('/:id', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), updateUser);
router.post('/delete/:id', authorizeMiddleware([rolesObjects.ADMIN, rolesObjects.SECRETARY]), deleteUser);

module.exports = router