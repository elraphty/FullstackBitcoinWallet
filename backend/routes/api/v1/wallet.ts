import express, {Router} from 'express';
import {generateMnenomic, generateMasterKeys, generateChildPubKey, getUtxos, getTransactions} from '../../../controllers/wallet';

const router: Router = express.Router();

router.get('/mnenomic', generateMnenomic);

router.post('/privatekey', generateMasterKeys)

router.post('/childpubkey', generateChildPubKey)

router.post('/transactions', getTransactions)

export default router;