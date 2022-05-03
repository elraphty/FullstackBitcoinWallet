import { Request, Response, NextFunction } from "express";
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { payments, networks, Psbt } from 'bitcoinjs-lib';
import { responseSuccess, responseErrorValidation } from "../helpers";
import { broadcastTx, getTransactionsFromAddress } from "../helpers/blockstream-api";
import { Address, BlockstreamAPITransactionResponse, DecoratedUtxo, SignedTransactionData } from "../interfaces/blockstream";
import { createTransaction, signTransaction, createAddressBatch, changeAddressBatch, createDecoratedUTXOs } from "../helpers/bitcoinlib";
import { serializeTxs } from "../helpers/transactions";
import { validationResult } from 'express-validator';
import knex from '../db/knex';
import { User } from "../interfaces/knex";
import { encryptKey, decryptKey } from "../helpers/encryptKey";
import { RequestUser } from '../interfaces';

const bip32 = BIP32Factory(ecc);

const derivationPath = "m/84'/0'/0'";

// Controller for generating mnenomic seed
export const generateMnenomic = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const mnemonic = generateMnemonic(256);

        responseSuccess(res, 200, 'Successfully generated mnenomic', mnemonic);
    } catch (err) {
        next(err);
    }
};

// Controller for generating master private, and public  key
export const generateMasterKeys = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }

        const {email, password, mnemonic} = req.body;

        const seed = await mnemonicToSeed(mnemonic, password);
        const node = bip32.fromSeed(seed, networks.testnet);
        const xprv = node.toBase58();

        const xpub = node.derivePath(derivationPath).neutered().toBase58();

        const data = {
            xprv,
            xpub,
        };

        const enKey = encryptKey(xprv);

        // Set user private key
        await knex<User>('users').where({ email }).update({ pk: enKey, pub: xpub });

        return responseSuccess(res, 200, 'Successfully generated master keys', data);
    } catch (err) {
        next(err);
    }
};

// Controller for generating master private key
export const generateAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }
    
        const reqUser = req as RequestUser;
        const xpub = reqUser.user.pub || '';

        const addressType: string | unknown = req.query.type;

        const node: BIP32Interface = bip32.fromBase58(xpub, networks.testnet).derivePath("0/0");

        const currentAddressBatch: Address[] = createAddressBatch(xpub, node, addressType);

        const currentChangeAddressBatch: Address[] = changeAddressBatch(xpub, node, addressType);

        const data = {
            address: currentAddressBatch,
            changeAddress: currentChangeAddressBatch,
        };

        return responseSuccess(res, 200, 'Successfully generated address', data);
    } catch (err) {
        next(err);
    }
};

// Controller for generating master private key
export const generateMultiAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }
       
        const xpubs: string[] = req.body.publicKeys;
        const signersCount: number = Number(req.body.signers)

        let pubkeys: Buffer[] = xpubs.map(pub => {
            return bip32.fromBase58(pub, networks.testnet).derivePath("0/0").publicKey;
        })

        const { address, redeem } = payments.p2sh({
            redeem: payments.p2ms({ m: signersCount, pubkeys }),
        });

        // console.log('Redeem ===', redeem)

        return responseSuccess(res, 200, 'Successfully generated P2SH address', address);
    } catch (err) {
        next(err);
    }
};

export const getUtxos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }
        
        const reqUser = req as RequestUser;
        const xpub = reqUser.user.pub || '';

        const addressType: string | unknown = req.query.type;

        const node = bip32.fromBase58(xpub, networks.testnet).derivePath("0/0");

        const currentAddressBatch: Address[] = createAddressBatch(xpub, node, addressType);

        const currentChangeAddressBatch: Address[] = changeAddressBatch(xpub, node, addressType);

        const addresses: Address[] = [...currentAddressBatch, ...currentChangeAddressBatch];

        const decoratedUtxos: DecoratedUtxo[] = await createDecoratedUTXOs(addresses, node);

        responseSuccess(res, 200, 'Successfully listed utxos', decoratedUtxos);
    } catch (err) {
        next(err);
    }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const reqUser = req as RequestUser;
        const xpub = reqUser.user.pub || '';

        const addressType: string | unknown = req.query.type;
       
        const node = bip32.fromBase58(xpub, networks.testnet).derivePath("0/0");

        const currentAddressBatch: Address[] = createAddressBatch(xpub, node, addressType);

        const currentChangeAddressBatch: Address[] = changeAddressBatch(xpub, node, addressType);

        const addresses: Address[] = [...currentAddressBatch];

        const currentTransactionBatch: BlockstreamAPITransactionResponse[] = [];

        for (let i = 0; i < 10; i++) {
            const currentAddress = addresses[i];
            const addressTransactions = await getTransactionsFromAddress(
                currentAddress
            );
            currentTransactionBatch.push(...addressTransactions);
        }

        const serializedTxs = serializeTxs(
            currentTransactionBatch,
            currentAddressBatch,
            currentChangeAddressBatch
        );

        responseSuccess(res, 200, 'Successfully listed transactions', serializedTxs);
    } catch (err) {
        next(err);
    }
};

export const createTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const reqUser = req as RequestUser;
        const xpub = reqUser.user.pub || '';
        const recipientAddress: string = req.body.recipientAddress;
        const amount: number = req.body.amount;
        const addressType: string | unknown = req.query.type;

        // Get Users encryoted private key from the database and decrypt it
        // @ts-ignore
        const getPriv = await knex<User>('users').where('email', req.user.email).first();

        const xprv: string = decryptKey(getPriv?.pk || '');

        const root = bip32.fromBase58(xprv, networks.testnet);

        const currentAddressBatch: Address[] = createAddressBatch(xpub, root, addressType);

        const currentChangeAddressBatch: Address[] = changeAddressBatch(xpub, root, addressType);

        const addresses: Address[] = [...currentAddressBatch, ...currentChangeAddressBatch];

        const decoratedUtxos: DecoratedUtxo[] = await createDecoratedUTXOs(addresses, root);

        // Create the transaction
        const transaction: Psbt = await createTransaction(decoratedUtxos, recipientAddress, amount, currentChangeAddressBatch[0], addressType);

        // Sign the transaction
        const signedTransactionHex: SignedTransactionData = await signTransaction(transaction, root);

        const data = {
            tHex: signedTransactionHex,
            transaction
        }

        responseSuccess(res, 200, 'Successfully created and signed transaction', data);
    } catch (err) {
        next(err);
    }
};

export const broadcastTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }
        
        const txHex: string = req.body.txHex;

        const data = await broadcastTx(txHex);

        responseSuccess(res, 200, 'Successfully broadcasted transaction', data);

    } catch (err) {
        next(err);
    }
};

export const getPublicKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }
        
        // @ts-ignore
        const email: string = req.user.email;

        // Set user private key
        const user = await knex<User>('users').where({ email }).first();

        const pubKey = user?.pub;

        responseSuccess(res, 200, 'Successfully broadcasted transaction', pubKey);

    } catch (err) {
        next(err);
    }
};


export const getPrivateKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }
        
        // @ts-ignore
        const email: string = req.user.email;

        // Get user data
        const user = await knex<User>('users').where({ email }).first();

        // Decryot private key 
        const xprv: string = decryptKey(user?.pk || '');

        responseSuccess(res, 200, 'Successfully broadcasted transaction', xprv);

    } catch (err) {
        next(err);
    }
};