import express, { Router } from 'express';
import { generateMnenomic, generateMasterKeys, generateAddress, getUtxos, getTransactions, createTransactions, broadcastTransaction } from '../../../controllers/wallet';
import { generateKeys, broadcastTx } from '../../../utils/validator/wallet';
import { authUser } from '../../../helpers/auth';

const router: Router = express.Router();

router.get('/mnenomic', generateMnenomic);

router.post('/privatekey', generateKeys, generateMasterKeys)

router.post('/getaddress', authUser, generateAddress)

router.post('/utxos', authUser, getUtxos)

router.post('/transactions', getTransactions)

router.post('/createtransaction', createTransactions)

router.post('/broadcasttransaction', broadcastTx, broadcastTransaction)

export default router;