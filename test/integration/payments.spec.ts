import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
// import { describe, it } from 'mocha';
import * as evrmore from '../..';
import { hash160 } from '../../src/crypto';
import { regtestUtils } from './_regtest';
const OPS = evrmore.script.OPS;

const ECPair = ECPairFactory(ecc);
console.log(regtestUtils.network, 'network');
const NETWORK = evrmore.networks;
const keyPairs = [
  ECPair.makeRandom({ network: NETWORK.evrmore }),
  ECPair.makeRandom({ network: NETWORK.evrmore }),
];
// Hash the public key to get a 20-byte hash
const pubKeyHash = hash160(keyPairs[0].publicKey);

console.log(pubKeyHash.toString('hex'), 'pubkey hash');

const address = evrmore.payments.p2pkh({ pubkey: keyPairs[0].publicKey });

console.log(address.address);
console.log(address.output);
console.log(address.input);
console.log(address.witness, OPS.OP_PUSHNUM);

const scriptPubKey = evrmore.script.compile([
  OPS.OP_DUP,
  OPS.OP_HASH160,
  pubKeyHash,
  OPS.OP_EQUALVERIFY,
  OPS.OP_CHECKSIG,
]);
console.log(scriptPubKey.toString('hex'), 'scriptPubKey');
