import { ValidationError } from "express-validator";
import { Address, BlockstreamAPITransactionResponse, BlockstreamAPIUtxoResponse, Vin, Vout } from "./blockstream";
import { User } from "./knex";
import { Request } from "express";
export interface DataResponse {
    msg: string;
    data: any;
}
export interface ErrorResponse {
    msg: string;
}
export interface ErrorValidationResponse {
    msg: string;
    errors: ValidationError[];
}

export interface RequestUser extends Request {
    user: User;
}
export interface DecoratedVin extends Vin {
    isMine: boolean;
    isChange: boolean;
}
export interface DecoratedVout extends Vout {
    isMine: boolean;
    isChange: boolean;
}
export interface DecoratedTx extends BlockstreamAPITransactionResponse {
    vin: DecoratedVin[];
    vout: DecoratedVout[];
    type: "sent" | "received" | "moved";
}
export interface DecoratedUtxo extends BlockstreamAPIUtxoResponse {
    address: Address;
    bip32Derivation: {
        masterFingerprint: Buffer;
        pubkey: Buffer;
        path: string;
    }[];
}