import express, {Router} from 'express';
import {generateMnenomic, generateMasterKeys, generateChildPubKey, getUtxos, getTransactions, createTransactions} from '../../../controllers/wallet';

const router: Router = express.Router();

router.get('/mnenomic', generateMnenomic);

router.post('/privatekey', generateMasterKeys)

router.post('/childpubkey', generateChildPubKey)

router.post('/utxos', getUtxos)

router.post('/transactions', getTransactions)

router.post('/createtransaction', createTransactions)

export default router;