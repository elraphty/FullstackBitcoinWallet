import { Request, Response, NextFunction } from "express";
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { networks, payments } from 'bitcoinjs-lib';
import { responseSuccess } from "../helpers";

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
        const xpriv: string  = req.body.publickey;

        const node = bip32.fromBase58(xpriv, networks.testnet);

        const child = node.neutered().toBase58();

        const { address } = payments.p2wpkh({
            pubkey: bip32.fromBase58(xpriv,  networks.testnet).derive(0).derive(1).publicKey,
        });

        const data = {
            child,
            address
        };
      
        responseSuccess(res, 200, 'Successfully generated address', data);
    } catch (err) {
        next(err);
    }
};