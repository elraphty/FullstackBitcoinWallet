import { payments } from 'bitcoinjs-lib';

export interface Address extends payments.Payment {
    derivationPath: string;
    masterFingerprint: Buffer;
    type?: "used" | "unused";
}