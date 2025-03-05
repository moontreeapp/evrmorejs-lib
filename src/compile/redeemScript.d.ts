/**
 * This function returns the redeem script for a multisig output
 * @param required This is the number of signatures required to spend the output
 * @param pubkeys This is an array of public keys
 * @returns This returns the redeem script for a multisig output
 */
export declare const multisigRedeemScript: (required: number, pubkeys: Buffer[]) => Buffer;
