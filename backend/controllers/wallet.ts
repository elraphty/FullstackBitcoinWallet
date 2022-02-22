import { Request, Response, NextFunction } from "express";
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { networks } from 'bitcoinjs-lib';
import { responseSuccess } from "../helpers";

const bip32 = BIP32Factory(ecc);

export const generateMnenomic = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const mnemonic = generateMnemonic(256);

        responseSuccess(res, 200, 'Successfully generated mnenomic', mnemonic);
    } catch (err) {
        next(err);
    }
};

export const generatePrivateKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mnemonic: string = req.body.mnemonic;

        const seed = await mnemonicToSeed(mnemonic); 
        const privateKey = bip32.fromSeed(seed, networks.bitcoin).toBase58();

        responseSuccess(res, 200, 'Successfully generated privateKey', privateKey);
    } catch (err) {
        next(err);
    }
};