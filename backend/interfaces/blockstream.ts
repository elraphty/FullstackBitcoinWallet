import { payments } from "bitcoinjs-lib";

export interface Address extends payments.Payment {
  derivationPath: string;
  masterFingerprint: Buffer;
  type?: "used" | "unused";
}

export interface DecoratedUtxo extends BlockstreamAPIUtxoResponse {
  address: Address;
  bip32Derivation: {
    masterFingerprint: Buffer;
    pubkey: Buffer;
    path: string;
  }[];
}

export interface Vin {
  txid: string;
  vout: number;
  prevout: {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: number;
  };
  scriptsig: string;
  scriptsig_asm: string;
  witness: string[];
  is_coinbase: boolean;
  sequence: number;
}

export interface Vout {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address: string;
  value: number;
}

export interface BlockstreamAPITransactionResponse {
  txid: string;
  version: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
}

export interface BlockstreamAPIUtxoResponse {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
}

export interface BlockstreamApiFeeEstimatesResponse {
  [targetBlocks: string]: number;
}

export interface SignedTransactionData {
  txHex: string;
  txId: string;
}
