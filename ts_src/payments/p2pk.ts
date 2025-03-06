import { evrmore as EVREMORE_NETWORK } from '../networks';
import * as bscript from '../script';
import { isPoint, typeforce as typef } from '../types';
import { Payment, PaymentOpts, StackFunction } from './index';
import * as lazy from './lazy';
const OPS = bscript.OPS;

// input: {signature}
// output: {pubKey} OP_CHECKSIG
export function p2pk(a: Payment, opts?: PaymentOpts): Payment {
  if (
    !a.input &&
    !a.output &&
    !a.pubkey &&
    !a.input &&
    !a.signature &&
    !a.asset
  )
    throw new TypeError('Not enough data');
  opts = Object.assign({ validate: true }, opts || {});

  typef(
    {
      network: typef.maybe(typef.Object),
      output: typef.maybe(typef.Buffer),
      pubkey: typef.maybe(isPoint),

      signature: typef.maybe(bscript.isCanonicalScriptSignature),
      input: typef.maybe(typef.Buffer),
      asset: typef.maybe(typef.Object),
    },
    a,
  );

  const _chunks = lazy.value(() => {
    return bscript.decompile(a.input!);
  }) as StackFunction;

  const network = a.network || EVREMORE_NETWORK;
  const o: Payment = { name: 'p2pk', network };

  lazy.prop(o, 'output', () => {
    if (!a.pubkey) return;
    const baseOutput = [a.pubkey, OPS.OP_CHECKSIG];
    if (a.asset) {
      const assetData = Buffer.concat([
        Buffer.from([0x13]),
        Buffer.from('65767274', 'hex'), // Asset identifier
        Buffer.from([a.asset.name.length]), // Name length
        Buffer.from(a.asset.name, 'utf8'), // Asset name
        (() => {
          const buffer = Buffer.alloc(8);
          buffer.writeBigUInt64LE(BigInt(a.asset.amount));
          return buffer;
        })(),
      ]);
      return bscript.compile([...baseOutput, OPS.OP_EVR_ASSET, assetData]);
    }
    return bscript.compile(baseOutput);
  });
  lazy.prop(o, 'pubkey', () => {
    if (!a.output) return;
    return a.output.slice(1, -1);
  });
  lazy.prop(o, 'signature', () => {
    if (!a.input) return;
    return _chunks()[0] as Buffer;
  });
  lazy.prop(o, 'input', () => {
    if (!a.signature) return;
    return bscript.compile([a.signature]);
  });
  lazy.prop(o, 'witness', () => {
    if (!o.input) return;
    return [];
  });

  // extended validation
  if (opts.validate) {
    if (a.output) {
      if (a.output[a.output.length - 1] !== OPS.OP_CHECKSIG)
        throw new TypeError('Output is invalid');
      if (!isPoint(o.pubkey)) throw new TypeError('Output pubkey is invalid');
      if (a.pubkey && !a.pubkey.equals(o.pubkey!))
        throw new TypeError('Pubkey mismatch');
    }

    if (a.signature) {
      if (a.input && !a.input.equals(o.input!))
        throw new TypeError('Signature mismatch');
    }

    if (a.input) {
      if (_chunks().length !== 1) throw new TypeError('Input is invalid');
      if (!bscript.isCanonicalScriptSignature(o.signature!))
        throw new TypeError('Input has invalid signature');
    }
  }

  return Object.assign(o, a);
}
