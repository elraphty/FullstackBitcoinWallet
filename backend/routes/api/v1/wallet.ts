import express, {Router} from 'express';
import {generateMnenomic, generateMasterKeys, generateAddress, getUtxos, getTransactions, createTransactions, broadcastTransaction} from '../../../controllers/wallet';

const router: Router = express.Router();

router.get('/mnenomic', generateMnenomic);

router.post('/privatekey', generateMasterKeys)

router.post('/getaddress', generateAddress)

router.post('/utxos', getUtxos)

router.post('/transactions', getTransactions)

router.post('/createtransaction', createTransactions)

router.post('/broadcasttransaction', broadcastTransaction)

export default router;