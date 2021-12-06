import express from 'express'
import { getUsers, createUser, updateUser } from '../controllers/UserController.js'

const router = express.Router();

router.get('/', getUsers);
router.post('/add', createUser);
router.post('/:id', updateUser);

export default router;