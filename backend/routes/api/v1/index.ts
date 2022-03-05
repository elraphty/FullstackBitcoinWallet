import express, {Router} from 'express';
import wallet from './wallet';
import user from './user';

const router: Router = express.Router();

router.use('/wallet', wallet);

router.use('/user', user);

export default router;