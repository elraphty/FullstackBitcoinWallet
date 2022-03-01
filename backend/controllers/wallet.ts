import { Request, Response, NextFunction } from "express";
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { networks, payments, Psbt } from 'bitcoinjs-lib';
import { responseSuccess } from "../helpers";
import { broadcastTx, getTransactionsFromAddress, getUtxosFromAddress } from "../helpers/blockstream-api";
import { Address, BlockstreamAPITransactionResponse, DecoratedUtxo, SignedTransactionData } from "../interfaces/blockstream";
import { createTransaction, deriveChildPublicKey, getAddressFromChildPubkey, signTransaction } from "../helpers/bitcoinlib";
import { serializeTxs } from "../helpers/transactions";

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
export const generateMasterKeys = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mnemonic: string = req.body.mnemonic;
        const seed = await mnemonicToSeed(mnemonic);
        const node = bip32.fromSeed(seed, networks.testnet);
        const xprv = node.toBase58();

        const xpub = node.derivePath(derivationPath).neutered().toBase58();

        const data = {
            xprv,
            xpub,
        };

        responseSuccess(res, 200, 'Successfully generated master keys', data);
    } catch (err) {
        next(err);
    }
};

// Controller for generating master private key
export const generateChildPubKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const xpub: string = req.body.publickey;

        const node = bip32.fromBase58(xpub, networks.testnet).derivePath("0/0");

        const child = node.neutered().toBase58();

        const { address } = payments.p2pkh({
            pubkey: node.publicKey,
            network: networks.testnet
        });

        const data = {
            child,
            address,
        };

        responseSuccess(res, 200, 'Successfully generated address', data);
    } catch (err) {
        next(err);
    }
};

export const getUtxos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const xpub: string = req.body.publicKey;

        const currentAddressBatch: Address[] = [];

        const node = bip32.fromBase58(xpub, networks.testnet).derivePath("0/0");

        for (let i = 0; i < 10; i++) {
            const derivationPath = `0/${i}`;
            const currentChildPubkey = bip32.fromBase58(xpub, networks.testnet).derivePath(derivationPath);
            const currentAddress = getAddressFromChildPubkey(currentChildPubkey);

            currentAddressBatch.push({
                ...currentAddress,
                derivationPath,
                masterFingerprint: node.fingerprint,
            });
        }


        const currentChangeAddressBatch: Address[] = [];

        for (let i = 0; i < 10; i++) {
            const derivationPath = `1/${i}`;
            const currentChildPubkey = bip32.fromBase58(xpub, networks.testnet).derivePath(derivationPath);
            const currentAddress = getAddressFromChildPubkey(currentChildPubkey);
            currentChangeAddressBatch.push({
                ...currentAddress,
                derivationPath,
                masterFingerprint: node.fingerprint,
            });
        }

        const addresses: Address[] = [...currentAddressBatch, ...currentChangeAddressBatch];


        const deocratedUtxos: DecoratedUtxo[] = [];

        for (let address of addresses) {
            const utxos = await getUtxosFromAddress(address);

            for (let utxo of utxos) {
                deocratedUtxos.push({
                    ...utxo,
                    address: address,
                    bip32Derivation: [
                        {
                            pubkey: address.pubkey!,
                            path: `m/84'/0'/0'/${address.derivationPath}`,
                            masterFingerprint: node.fingerprint,
                        },
                    ],
                });
            }
        }

        responseSuccess(res, 200, 'Successfully listed utxos', deocratedUtxos);
    } catch (err) {
        next(err);
    }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const xpub: string = req.body.publicKey;

        const currentAddressBatch: Address[] = [];

        const node = bip32.fromBase58(xpub, networks.testnet).derivePath("0/0");

        for (let i = 0; i < 10; i++) {
            const derivationPath = `0/${i}`;
            const currentChildPubkey = bip32.fromBase58(xpub, networks.testnet).derivePath(derivationPath);
            const currentAddress = getAddressFromChildPubkey(currentChildPubkey);
            currentAddressBatch.push({
                ...currentAddress,
                derivationPath,
                masterFingerprint: node.fingerprint,
            });
        }


        const currentChangeAddressBatch: Address[] = [];
        for (let i = 0; i < 10; i++) {
            const derivationPath = `1/${i}`;
            const currentChildPubkey = bip32.fromBase58(xpub, networks.testnet).derivePath(derivationPath);
            const currentAddress = getAddressFromChildPubkey(currentChildPubkey);
            currentChangeAddressBatch.push({
                ...currentAddress,
                derivationPath,
                masterFingerprint: node.fingerprint,
            });
        }

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
        const mnemonic: string = req.body.mnemonic;

        const seed = await mnemonicToSeed(mnemonic);
        const root = bip32.fromSeed(seed, networks.testnet);

        const currentAddressBatch: Address[] = [];

        for (let i = 0; i < 10; i++) {
            const derivationPath = `0/${i}`;
            const currentChildPubkey = bip32.fromBase58(xpub, networks.testnet).derivePath(derivationPath);
            const currentAddress = getAddressFromChildPubkey(currentChildPubkey);
            currentAddressBatch.push({
                ...currentAddress,
                derivationPath,
                masterFingerprint: root.fingerprint,
            });
        }

        const currentChangeAddressBatch: Address[] = [];

        for (let i = 0; i < 10; i++) {
            const derivationPath = `1/${i}`;
            const currentChildPubkey = bip32.fromBase58(xpub, networks.testnet).derivePath(derivationPath);
            const currentAddress = getAddressFromChildPubkey(currentChildPubkey);
            currentChangeAddressBatch.push({
                ...currentAddress,
                derivationPath,
                masterFingerprint: root.fingerprint,
            });
        }

        const addresses: Address[] = [...currentAddressBatch, ...currentChangeAddressBatch];

        const deocratedUtxos: DecoratedUtxo[] = [];

        for (let address of addresses) {
            const utxos = await getUtxosFromAddress(address);

            for (let utxo of utxos) {
                deocratedUtxos.push({
                    ...utxo,
                    address: address,
                    bip32Derivation: [
                        {
                            pubkey: address.pubkey!,
                            path: `m/84'/0'/0'/${address.derivationPath}`,
                            masterFingerprint: root.fingerprint,
                        },
                    ],
                });
            }
        }

        const transaction: Psbt = await createTransaction(deocratedUtxos, recipientAddress, amount, currentChangeAddressBatch[0]);
        const signedTransactionHex: SignedTransactionData = await signTransaction(transaction, root);

        responseSuccess(res, 200, 'Successfully created and signed transaction', signedTransactionHex);
    } catch (err) {
        next(err);
    }
};

export const broadcastTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const txHex: string = req.body.txHex;

        const data = await broadcastTx(txHex);

        responseSuccess(res, 200, 'Successfully brodcasted transaction', data);

    } catch (err) {
        next(err);
    }
};