import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

const secretKey: string | undefined = process.env.ENCRYPT_SECRET;
const cryptr = new Cryptr(secretKey || 'SECRETKEY*888000099JJJJJJ');

export const encryptKey = (key: string): string => {
    const encryptedString = cryptr.encrypt(key);
    return encryptedString;
};

export const decryptKey = (encryptedKey: string): string => {
    const decryptedString = cryptr.decrypt(encryptedKey);
    return decryptedString;
};