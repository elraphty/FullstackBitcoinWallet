import express, { Router } from 'express';
import { generateMnenomic, generateMasterKeys, generateAddress, getUtxos, getTransactions, createTransactions, broadcastTransaction } from '../../../controllers/wallet';
import { generateKeys, broadcastTx } from '../../../utils/validator/wallet';
import { authUser } from '../../../helpers/auth';

const router: Router = express.Router();

router.get('/mnenomic', generateMnenomic);

router.post('/privatekey', generateKeys, generateMasterKeys)

router.get('/getaddress', authUser, generateAddress)

router.get('/utxos', authUser, getUtxos)

router.get('/transactions', authUser, getTransactions)

router.post('/createtransaction', authUser, createTransactions)

router.post('/broadcasttransaction', authUser, broadcastTx,  broadcastTransaction)

export default router;