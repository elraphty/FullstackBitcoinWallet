import BIP32Factory, { BIP32Interface } from 'bip32';
import { networks, payments } from 'bitcoinjs-lib';
import { generateMnemonic, mnemonicToSeed } from "bip39";
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

export const getAddressFromChildPubkey = (
    child: BIP32Interface
): payments.Payment => {
    const address = payments.p2pkh({
        pubkey: child.publicKey,
        network: networks.testnet,
    });
    return address;
};

export const getNewMnemonic = (): string => {
    const mnemonic = generateMnemonic(256);
    return mnemonic;
  };
  
  export const getMasterPrivateKey = async (
    mnemonic: string
  ): Promise<BIP32Interface> => {
    const seed = await mnemonicToSeed(mnemonic);
    const privateKey =  bip32.fromSeed(seed, networks.bitcoin);
    return privateKey;
  };
  
  export const getXpubFromPrivateKey = (
    privateKey: BIP32Interface,
    derivationPath: string
  ): string => {
    const child = privateKey.derivePath(derivationPath).neutered();
    const xpub = child.toBase58();
    return xpub;
  };
  
  export const deriveChildPublicKey = (
    xpub: string,
    derivationPath: string
  ): BIP32Interface => {
    const node = bip32.fromBase58(xpub, networks.bitcoin);
    const child = node.derivePath(derivationPath);
    return child;
  };