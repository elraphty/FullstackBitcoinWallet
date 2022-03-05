import express, { Router } from 'express';
import { registerUser, userLogin } from '../../../controllers/user';
import { createUser } from '../../../utils/validator/user';

const router: Router = express.Router();

router.post('/', createUser, registerUser)

router.post('/login', createUser, userLogin)

export default router;