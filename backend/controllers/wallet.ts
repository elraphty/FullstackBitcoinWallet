import { Request, Response, NextFunction } from "express";
import { generateMnemonic } from 'bip39';
import { responseSuccess } from "../helpers";

export const generateMnenomic = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const mnemonic = generateMnemonic(256);

        responseSuccess(res, 200, 'Successfully generated mnenomic', mnemonic);
    } catch (err) {
        next(err);
    }
};