import { Request, Response, NextFunction } from "express";
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { networks, Psbt } from 'bitcoinjs-lib';
import { responseSuccess, responseErrorValidation } from "../helpers";
import { broadcastTx, getTransactionsFromAddress } from "../helpers/blockstream-api";
import { Address, BlockstreamAPITransactionResponse, DecoratedUtxo, SignedTransactionData } from "../interfaces/blockstream";
import { createTransaction, getAddressFromChildPubkey, signTransaction, createAddressBatch, changeAddressBatch, createDecoratedUTXOs } from "../helpers/bitcoinlib";
import { serializeTxs } from "../helpers/transactions";
import { validationResult } from 'express-validator';
import knex from '../db/knex';
import { User } from "../interfaces/knex";
import { encryptKey, decryptKey } from "../helpers/encryptKey";

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
    
        // @ts-ignore
        const xpub = req.user.pub;

        const node: BIP32Interface = bip32.fromBase58(xpub, networks.testnet).derivePath("0/0");

        const currentAddressBatch: Address[] = createAddressBatch(xpub, node);

        const currentChangeAddressBatch: Address[] = changeAddressBatch(xpub, node);

        const data = {
            address: currentAddressBatch,
            changeAddress: currentChangeAddressBatch,
        };

        return responseSuccess(res, 200, 'Successfully generated address', data);
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

        const xpub: string = req.body.publicKey;

        const node = bip32.fromBase58(xpub, networks.testnet).derivePath("0/0");

        const currentAddressBatch: Address[] = createAddressBatch(xpub, node);

        const currentChangeAddressBatch: Address[] = changeAddressBatch(xpub, node);

        const addresses: Address[] = [...currentAddressBatch, ...currentChangeAddressBatch];

        const decoratedUtxos: DecoratedUtxo[] = await createDecoratedUTXOs(addresses, node);

        responseSuccess(res, 200, 'Successfully listed utxos', decoratedUtxos);
    } catch (err) {
        next(err);
    }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const xpub: string = req.body.publicKey;

        const node = bip32.fromBase58(xpub, networks.testnet).derivePath("0/0");

        const currentAddressBatch: Address[] = createAddressBatch(xpub, node);

        const currentChangeAddressBatch: Address[] = changeAddressBatch(xpub, node);

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
        const xpub: string = req.body.publicKey;
        const recipientAddress: string = req.body.recipientAddress;
        const amount: number = req.body.amount;
        const xprv: string = req.body.privateKey;

        const root = bip32.fromBase58(xprv, networks.testnet);

        const currentAddressBatch: Address[] = createAddressBatch(xpub, root);

        const currentChangeAddressBatch: Address[] = changeAddressBatch(xpub, root);

        const addresses: Address[] = [...currentAddressBatch, ...currentChangeAddressBatch];

        const decoratedUtxos: DecoratedUtxo[] = await createDecoratedUTXOs(addresses, root);

        // Create the transaction
        const transaction: Psbt = await createTransaction(decoratedUtxos, recipientAddress, amount, currentChangeAddressBatch[0]);

        // Sign the transaction
        const signedTransactionHex: SignedTransactionData = await signTransaction(transaction, root);

        responseSuccess(res, 200, 'Successfully created and signed transaction', signedTransactionHex);
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