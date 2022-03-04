import express, { Router } from 'express';
import { generateMnenomic, generateMasterKeys, generateAddress, getUtxos, getTransactions, createTransactions, broadcastTransaction } from '../../../controllers/wallet';
import { generateKeys } from '../../../utils/validator/wallet';

const router: Router = express.Router();

router.get('/mnenomic', generateMnenomic);

router.post('/privatekey', generateKeys, generateMasterKeys)

router.post('/getaddress', generateAddress)

router.post('/utxos', getUtxos)

router.post('/transactions', getTransactions)

router.post('/createtransaction', createTransactions)

router.post('/broadcasttransaction', broadcastTransaction)

export default router;