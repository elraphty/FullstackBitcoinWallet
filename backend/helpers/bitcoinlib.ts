import BIP32Factory, { BIP32Interface } from 'bip32';
import { networks, payments, Psbt } from 'bitcoinjs-lib';
import { generateMnemonic, mnemonicToSeed } from "bip39";
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { DecoratedUtxo } from '../interfaces';
import { Address } from '../interfaces/blockstream';
import coinSelect from 'coinselect';
import { getTransactionHex } from './blockstream-api';

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

const validator = (
  pubkey: Buffer,
  msghash: Buffer,
  signature: Buffer,
): boolean => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

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
  const privateKey = bip32.fromSeed(seed, networks.bitcoin);
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


export const createTransaction = async (
  utxos: DecoratedUtxo[],
  recipientAddress: string,
  amountInSatoshis: number,
  changeAddress: Address
) => {
  // const feeRate = await getFeeRates();

  const { inputs, outputs, fee } = coinSelect(
    utxos,
    [
      {
        address: recipientAddress,
        value: amountInSatoshis,
      },
    ],
    1
  );

  // console.log('COINSELEC INPUTS ==', inputs);

  if (!inputs || !outputs) throw new Error("Unable to construct transaction");
  if (fee > amountInSatoshis) throw new Error("Fee is too high!");

  const psbt = new Psbt({ network: networks.testnet });
  psbt.setVersion(2); // These are defaults. This line is not needed.
  psbt.setLocktime(0); // These are defaults. This line is not needed.

  for(let input of inputs) {
    const txHex = await getTransactionHex(input.txid);
    // console.log('Transaction Hex ===', txHex);
    psbt.addInput({
      hash: input.txid,
      index: input.vout,
      // sequence: 0xfffffffd, // enables RBF
      // witnessUtxo: {
      //   value: input.value,
      //   script: input.address.output!,
      // },
      nonWitnessUtxo: Buffer.from(txHex, 'hex'),
      bip32Derivation: input.bip32Derivation,
    });
  };

  outputs.forEach((output: any) => {
    // coinselect doesnt apply address to change output, so add it here
    if (!output.address) {
      output.address = changeAddress.address!;
    }

    psbt.addOutput({
      address: output.address,
      value: output.value,
    });
  });

  return psbt;
};

export const signTransaction = async (
  psbt: Psbt,
  mnemonic: string,
  node: BIP32Interface
): Promise<Psbt> => {
  const seed = await mnemonicToSeed(mnemonic);
  const root = bip32.fromSeed(seed, networks.testnet);
  // const derivationPath = "m/84'/0'/0'";
  // console.log('PUBKEY from sign ===', root.derivePath(derivationPath).neutered().toBase58());

  const key = ECPair.fromPublicKey(node.publicKey)

  await psbt.signInputHD(0, node);
  await psbt.validateSignaturesOfAllInputs(validator);
  await psbt.finalizeAllInputs();
  return psbt;
};