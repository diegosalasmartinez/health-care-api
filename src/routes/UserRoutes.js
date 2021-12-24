import express from 'express'
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/UserController.js'

const router = express.Router();

router.get('/', getUsers);
router.post('/add', createUser);
router.patch('/:id', updateUser);
router.post('/delete/:id', deleteUser);

export default router;