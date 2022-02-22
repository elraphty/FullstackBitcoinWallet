import express, {Router, Request, Response} from 'express';
import {generateMnenomic} from '../../../controllers/wallet';

const router: Router = express.Router();

router.get('/mnenomic', generateMnenomic);

export default router;