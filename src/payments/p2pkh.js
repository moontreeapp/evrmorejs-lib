'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.p2pkh = p2pkh;
const bcrypto = require('../crypto');
const networks_1 = require('../networks');
const bscript = require('../script');
const types_1 = require('../types');
const lazy = require('./lazy');
const bs58check = require('bs58check');
const OPS = bscript.OPS;
// input: {signature} {pubkey} [optional asset metadata]
// output: OP_DUP OP_HASH160 {hash160(pubkey)} OP_EQUALVERIFY OP_CHECKSIG [OP_EVR_ASSET {asset metadata}]
function p2pkh(a, opts) {
  if (!a.address && !a.hash && !a.output && !a.pubkey && !a.input && !a.asset)
    throw new TypeError('Not enough data');
  opts = Object.assign({ validate: true }, opts || {});
  (0, types_1.typeforce)(
    {
      network: types_1.typeforce.maybe(types_1.typeforce.Object),
      address: types_1.typeforce.maybe(types_1.typeforce.String),
      hash: types_1.typeforce.maybe(types_1.typeforce.BufferN(20)),
      output: types_1.typeforce.maybe(types_1.typeforce.Buffer),
      pubkey: types_1.typeforce.maybe(types_1.isPoint),
      signature: types_1.typeforce.maybe(bscript.isCanonicalScriptSignature),
      input: types_1.typeforce.maybe(types_1.typeforce.Buffer),
      asset: types_1.typeforce.maybe(types_1.typeforce.Object),
    },
    a,
  );
  const _address = lazy.value(() => {
    const payload = bs58check.decode(a.address);
    const version = payload.readUInt8(0);
    const hash = payload.slice(1);
    return { version, hash };
  });
  const _chunks = lazy.value(() => {
    return bscript.decompile(a.input);
  });
  const network = a.network || networks_1.evrmore;
  const o = { name: 'p2pkh', network };
  lazy.prop(o, 'address', () => {
    if (!o.hash) return;
    const payload = Buffer.allocUnsafe(21);
    payload.writeUInt8(network.pubKeyHash, 0);
    o.hash.copy(payload, 1);
    return bs58check.encode(payload);
  });
  lazy.prop(o, 'hash', () => {
    if (a.output) return a.output.slice(3, 23);
    if (a.address) return _address().hash;
    if (a.pubkey || o.pubkey) return bcrypto.hash160(a.pubkey || o.pubkey);
  });
  lazy.prop(o, 'output', () => {
    if (!o.hash) return;
    const baseOutput = [
      OPS.OP_DUP,
      OPS.OP_HASH160,
      o.hash,
      OPS.OP_EQUALVERIFY,
      OPS.OP_CHECKSIG,
    ];
    if (a.asset) {
      const assetData = Buffer.concat([
        Buffer.from([0x13]),
        Buffer.from('65767274', 'hex'),
        Buffer.from([a.asset.name.length]),
        Buffer.from(a.asset.name, 'utf8'),
        (() => {
          const buffer = Buffer.alloc(8);
          buffer.writeBigUInt64LE(BigInt(a.asset.amount));
          return buffer;
        })(),
      ]);
      return bscript.compile([
        ...baseOutput,
        OPS.OP_EVR_ASSET,
        assetData,
        OPS.OP_DROP,
      ]);
    }
    return bscript.compile(baseOutput);
  });
  lazy.prop(o, 'pubkey', () => {
    if (!a.input) return;
    return _chunks()[1];
  });
  lazy.prop(o, 'signature', () => {
    if (!a.input) return;
    return _chunks()[0];
  });
  lazy.prop(o, 'input', () => {
    if (!a.pubkey || !a.signature) return;
    if (a.asset) {
      return bscript.compile([
        a.signature,
        a.pubkey,
        OPS.OP_EVR_ASSET,
        Buffer.from([0x13]),
        Buffer.from([0x65]),
        Buffer.from([0x76]),
        Buffer.from([0x72]),
        Buffer.from([0x74]),
        Buffer.from([a.asset.name.length]),
        Buffer.from(a.asset.name, 'utf8'),
        (() => {
          const buffer = Buffer.alloc(8);
          buffer.writeBigUInt64LE(BigInt(a.asset.amount));
          return buffer;
        })(),
      ]);
    }
    return bscript.compile([a.signature, a.pubkey]);
  });
  lazy.prop(o, 'witness', () => {
    if (!o.input) return;
    return [];
  });
  if (opts.validate) {
    let hash = Buffer.from([]);
    if (a.address) {
      if (_address().version !== network.pubKeyHash)
        throw new TypeError('Invalid version or Network mismatch');
      if (_address().hash.length !== 20) throw new TypeError('Invalid address');
      hash = _address().hash;
    }
    if (a.hash) {
      if (hash.length > 0 && !hash.equals(a.hash))
        throw new TypeError('Hash mismatch');
      else hash = a.hash;
    }
    if (a.output) {
      const output = a.output;
      if (
        output.length < 25 ||
        output[0] !== OPS.OP_DUP ||
        output[1] !== OPS.OP_HASH160
      )
        throw new TypeError('Output is invalid');
      const hash2 = output.slice(3, 23);
      if (hash.length > 0 && !hash.equals(hash2))
        throw new TypeError('Hash mismatch');
      else hash = hash2;
      if (a.asset) {
        const assetScript = output.slice(25);
        if (!assetScript.includes(OPS.OP_EVR_ASSET))
          throw new TypeError('Asset script missing OP_EVR_ASSET');
        const nameIndex = assetScript.indexOf(
          Buffer.from(a.asset.name, 'utf8'),
        );
        if (nameIndex === -1) throw new TypeError('Asset name mismatch');
        const expectedAmount = (() => {
          const buffer = Buffer.alloc(8);
          buffer.writeBigUInt64LE(BigInt(a.asset.amount));
          return buffer;
        })();
        const amountIndex = assetScript.indexOf(expectedAmount);
        if (amountIndex === -1) throw new TypeError('Asset amount mismatch');
      }
    }
    if (a.pubkey) {
      const pkh = bcrypto.hash160(a.pubkey);
      if (hash.length > 0 && !hash.equals(pkh))
        throw new TypeError('Hash mismatch');
      else hash = pkh;
    }
    if (a.input) {
      const chunks = _chunks();
      if (chunks.length < 2) throw new TypeError('Input is invalid');
      if (!bscript.isCanonicalScriptSignature(chunks[0]))
        throw new TypeError('Input has invalid signature');
      if (!(0, types_1.isPoint)(chunks[1]))
        throw new TypeError('Input has invalid pubkey');
      if (a.asset) {
        const assetChunks = chunks.slice(2);
        if (!assetChunks.includes(OPS.OP_EVR_ASSET))
          throw new TypeError('Asset script missing OP_EVR_ASSET');
      }
      const pkh = bcrypto.hash160(chunks[1]);
      if (hash.length > 0 && !hash.equals(pkh))
        throw new TypeError('Hash mismatch');
    }
  }
  return Object.assign(o, a);
}
