import { Request, Response, NextFunction } from "express";
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { networks, payments } from 'bitcoinjs-lib';
import { responseSuccess } from "../helpers";
import { getTransactionsFromAddress, getUtxosFromAddress } from "../helpers/blockstream-api";
import { Address, BlockstreamAPITransactionResponse, DecoratedUtxo } from "../interfaces/blockstream";
import { deriveChildPublicKey, getAddressFromChildPubkey } from "../helpers/bitcoinlib";
import { serializeTxs } from "../helpers/transactions";

const bip32 = BIP32Factory(ecc);

const derivationPath = "m/44'/0'/0'/0/0";

// Controller for generating mnenomic seed
export const generateMnenomic = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const mnemonic = generateMnemonic(256);

        responseSuccess(res, 200, 'Successfully generated mnenomic', mnemonic);
    } catch (err) {
        next(err);
    }
};

// Controller for generating master private key
export const generateMasterKeys = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mnemonic: string = req.body.mnemonic;

        // networks.bitcoin.bip32.public

        const seed = await mnemonicToSeed(mnemonic);
        const node = bip32.fromSeed(seed, networks.testnet);
        const xprv = node.toBase58();

        const xpub = node.derivePath(derivationPath).neutered().toBase58();

        const data = {
            xprv,
            xpub,
        }

        responseSuccess(res, 200, 'Successfully generated privateKey', data);
    } catch (err) {
        next(err);
    }
};

// Controller for generating master private key
export const generateChildPubKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const xpub: string = req.body.publickey;

        const node = bip32.fromBase58(xpub, networks.testnet).derivePath("0");

        const child = node.neutered().toBase58();

        const { address } = payments.p2wpkh({
            pubkey: node.publicKey,
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
        const xpub: string = req.body.publickey;

        const currentAddressBatch: Address[] = [];

        const node = bip32.fromBase58(xpub, networks.testnet).derivePath("0");

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
            const derivationPath = `0/0/${i}`;
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

        for (let i = 0; i < addresses.length; i++) {
          const _currentAddress: Address = addresses[i];
          const utxos = await getUtxosFromAddress(_currentAddress);

          for (let j = 0; j < utxos.length; j++) {
            deocratedUtxos.push({
              ...utxos[j],
              address: _currentAddress,
              bip32Derivation: [
                {
                  pubkey: _currentAddress.pubkey!,
                  path: `m/44'/0'/0'/0/${_currentAddress.derivationPath}`,
                  masterFingerprint: node.fingerprint,
                },
              ],
            });
          }
        }

        responseSuccess(res, 200, 'Successfully generated address', deocratedUtxos);
    } catch (err) {
        next(err);
    }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const xpub: string = req.body.publickey;

        const currentAddressBatch: Address[] = [];

        const node = bip32.fromBase58(xpub, networks.testnet).derivePath("0");

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
            const derivationPath = `0/0/${i}`;
            const currentChildPubkey = bip32.fromBase58(xpub, networks.testnet).derivePath(derivationPath);
            const currentAddress = getAddressFromChildPubkey(currentChildPubkey);
            currentChangeAddressBatch.push({
            ...currentAddress,
            derivationPath,
            masterFingerprint: node.fingerprint,
            });
        }

        const addresses: Address[] = [...currentAddressBatch, ...currentChangeAddressBatch];


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

        responseSuccess(res, 200, 'Successfully generated address', serializedTxs);
    } catch (err) {
        next(err);
    }
};