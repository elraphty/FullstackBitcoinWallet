import express, {Router} from 'express';
import wallet from './wallet';

const router: Router = express.Router();

router.use('/wallet', wallet);

export default router;