import { body } from 'express-validator';

const myWhitelist: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#@';

export const generateKeys = [
  body('mnemonic')
    .not().isEmpty()
    .isString()
    .ltrim()
    .rtrim()
    .whitelist(myWhitelist)
    .escape()
    .withMessage('Send your 24 characters long mnemonic words'),
  body('password')
    .not().isEmpty()
    .isString()
    .ltrim()
    .rtrim()
    .whitelist(myWhitelist)
    .escape()
    .withMessage('Password is required'),
  body('email')
    .not().isEmpty()
    .isEmail()
    .ltrim()
    .rtrim()
    .whitelist(myWhitelist)
    .escape()
    .withMessage('Email is required')
]

export const generateAdd = [
  body('publicKey')
    .not().isEmpty()
    .isString()
    .ltrim()
    .rtrim()
    .escape()
    .withMessage('Requires public key')
]

export const broadcastTx = [
  body('txHex')
    .not().isEmpty()
    .isString()
    .ltrim()
    .rtrim()
    .escape()
    .withMessage('Requires transaction Hex')
]