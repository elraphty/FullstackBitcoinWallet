import express, { Router } from 'express';
import { generateMnenomic, generateMasterKeys, generateAddress, getUtxos, getTransactions, createTransactions, broadcastTransaction, getPrivateKey, getPublicKey, generateMultiAddress } from '../../../controllers/wallet';
import { generateKeys, broadcastTx, multiAddress } from '../../../utils/validator/wallet';
import { authUser } from '../../../helpers/auth';

const router: Router = express.Router();

router.get('/mnenomic', generateMnenomic);

router.post('/privatekey', generateKeys, generateMasterKeys);

router.get('/getaddress', authUser, generateAddress);

router.post('/getp2shaddress', multiAddress, authUser, generateMultiAddress);

router.get('/utxos', authUser, getUtxos);

router.get('/transactions', authUser, getTransactions);

router.post('/createtransaction', authUser, createTransactions);

router.post('/broadcasttransaction', authUser, broadcastTx,  broadcastTransaction);

router.get('/privateKey', authUser, getPrivateKey);

router.get('/publicKey', authUser, getPublicKey);

export default router;