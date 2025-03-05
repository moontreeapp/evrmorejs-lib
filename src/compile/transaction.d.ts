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
/**
 * This function selects the UTXOs to be used for the transaction
 * @param utxos This is an array of UTXOs
 * @param senders This is an array of senders
 * @param dustThreshold This is the dust threshold
 * @returns This returns an array of UTXOs
 * UTXOs are selected based on the amount of assets and the amount of senders
 */
export declare const selectUtxos: (utxos: FetchedUtxoType[], senders: ReceipientType[], dustThreshold?: number) => {
    tx_hash: string;
    asset: string;
    vout: number;
    value: number;
}[];
/**
 * This function creates an unsigned transaction
 * @param utxos This is an array of UTXOs
 * @param senders This is an array of senders
 * @param changeAddress This is the address of the change
 * @param feeRate This is the fee rate
 * @returns This returns an unsigned transaction
 */
export declare const createUnsignedTx: (utxos: UtxoType[], senders: ReceipientType[], changeAddress: string, feeRate?: number) => string;
/**
 * This function signs a PSBT
 * @param psbtBase64 This is the PSBT in base64 format
 * @param keyPair This is the keypair to sign the PSBT
 * @returns This returns a signed PSBT in base64 format
 */
export declare const signPsbt: (unsignedTx: string, keyPair: Signer, redeemScript?: Buffer, witnessScript?: Buffer) => string;
/**
 * This function merges two PSBTs
 * @param psbtArray This is an array of PSBTs
 * @returns This returns a merged PSBT
 */
export declare const finalizePsbt: (psbtArray: string[]) => string;
