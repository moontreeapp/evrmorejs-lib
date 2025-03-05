'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.multisigRedeemScript = void 0;
const script = require('../script');
/**
 * This function returns the redeem script for a multisig output
 * @param required This is the number of signatures required to spend the output
 * @param pubkeys This is an array of public keys
 * @returns This returns the redeem script for a multisig output
 */
const multisigRedeemScript = (required, pubkeys) => {
  if (required < 1) {
    throw new Error('At least one signature is required');
  }
  if (required > pubkeys.length) {
    throw new Error(
      'Required number of signatures cannot exceed the number of public keys',
    );
  }
  if (pubkeys.length > 15) {
    throw new Error('A maximum of 15 public keys is allowed');
  }
  const opRequired = script.OPS[`OP_${required}`];
  const opTotal = script.OPS[`OP_${pubkeys.length}`];
  if (opRequired === undefined || opTotal === undefined) {
    throw new Error('Invalid number of required signatures or public keys');
  }
  return script.compile([
    opRequired,
    ...pubkeys,
    opTotal,
    script.OPS.OP_CHECKMULTISIG,
  ]);
};
exports.multisigRedeemScript = multisigRedeemScript;
