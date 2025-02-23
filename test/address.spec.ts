import * as assert from 'assert';
import { describe, it } from 'mocha';
import * as ecc from 'tiny-secp256k1';
import { address as evrmoreAddress } from 'evrmorejs-lib';
import { script as evrmoreScript } from 'evrmorejs-lib';
import { networks } from 'evrmorejs-lib';
import fixtures from './fixtures/address.json';

const NETWORKS = Object.assign(
  {
    litecoin: {
      messagePrefix: '\x19Litecoin Signed Message:\n',
      bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
      },
      pubKeyHash: 0x30,
      scriptHash: 0x32,
      wif: 0xb0,
    },
  },
  networks,
);

describe('evrmoreAddress', () => {
  describe('fromBase58Check', () => {
    fixtures.standard.forEach(f => {
      if (!f.base58check) return;

      it('decodes ' + f.base58check, () => {
        const decode = evrmoreAddress.fromBase58Check(f.base58check);

        assert.strictEqual(decode.version, f.version);
        assert.strictEqual(decode.hash.toString('hex'), f.hash);
      });
    });

    fixtures.scripthash.forEach(f => {
      it('decodes ' + f.base58check, () => {
        const decode = evrmoreAddress.fromBase58Check(f.base58check);

        assert.strictEqual(decode.version, f.version);
        assert.strictEqual(decode.hash.toString('hex'), f.hash);
      });
    });

    fixtures.invalid.fromBase58Check.forEach(f => {
      it('throws on ' + f.exception, () => {
        assert.throws(() => {
          evrmoreAddress.fromBase58Check(f.address);
        }, /Non-base58 character/);
      });
    });
  });
});
