const express = require('express')
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/UserController')

const router = express.Router();

router.get('/', getUsers);
router.post('/add', createUser);
router.patch('/:id', updateUser);
router.post('/delete/:id', deleteUser);

module.exports = router