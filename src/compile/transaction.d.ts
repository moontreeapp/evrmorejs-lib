import { Signer } from '../psbt';
export interface FetchedUtxoType {
    tx_hash: string;
    tx_pos: number;
    height: number;
    asset: string;
    value: number;
}
export interface UtxoType {
    txid: string;
    vout: number;
    value: number;
    nonWitnessUtxo: Buffer;
    asset: string;
}
export interface ReceipientType {
    address: string;
    asset: string;
    amount: number;
}
export declare const selectUtxos: (utxos: FetchedUtxoType[], senders: ReceipientType[], dustThreshold?: number) => {
    tx_hash: string;
    asset: string;
    vout: number;
    value: number;
}[];
export declare const createTx: (keypair: Signer, utxos: UtxoType[], senders: ReceipientType[], changeAddress: string, feeRate: number) => string;
