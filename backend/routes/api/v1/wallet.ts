import express, {Router, Request, Response} from 'express';
import {generateMnenomic, generatePrivateKey} from '../../../controllers/wallet';

const router: Router = express.Router();

router.get('/mnenomic', generateMnenomic);

router.post('/privatekey', generatePrivateKey)

export default router;