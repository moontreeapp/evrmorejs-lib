import * as assert from 'assert';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { describe, it } from 'mocha';
import * as evrmore from '../..';

const ECPair = ECPairFactory(ecc);

describe('evrmorejs-lib (addresses)', () => {
  it('can generate a random address', async () => {
    try {
      const keyPair = ECPair.makeRandom();
      const { address } = evrmore.payments.p2pkh({
        pubkey: keyPair.publicKey,
      });
      const pubkeys = [keyPair.publicKey, keyPair.publicKey, keyPair.publicKey];

      const redeemScript = evrmore.multisigRedeemScript(2, pubkeys);
      console.log(redeemScript.toString('hex'));
      const { address: p2shAddress } = evrmore.payments.p2sh({
        hash: evrmore.crypto.hash160(redeemScript),
      });
      console.log(p2shAddress);
      // evrmore P2PKH addresses start with a 'E'
      assert.strictEqual(address!.startsWith('E'), true);
      // evrmore P2SH addresses start with a 'e'
      assert.strictEqual(p2shAddress!.startsWith('e'), true);
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  it('can import an address via WIF', () => {
    const keyPair = ECPair.fromWIF(
      'L2bXGsqsqkzzRYJVv5xrVxCZi47J6CnrRnTsayRXMBuTmdhmE9j4',
    );
    const { address } = evrmore.payments.p2pkh({ pubkey: keyPair.publicKey });
    assert.strictEqual(address, 'EdhAQgbRDR91ffUhWrqbPQG8ZkVdu4x6Ex');
  });
});
