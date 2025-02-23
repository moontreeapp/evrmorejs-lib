import { Transaction, Input, Output } from '../../src/transaction';
import * as crypto from 'crypto';
import * as assert from 'assert';
import { describe, it } from 'mocha';

describe('Transaction', () => {
  it('should create a new transaction', () => {
    const tx = new Transaction();
    assert.strictEqual(tx.version, 1);
    assert.strictEqual(tx.locktime, 0);
    assert.strictEqual(tx.ins.length, 0);
    assert.strictEqual(tx.outs.length, 0);
  });

  it('should add an input to the transaction', () => {
    const tx = new Transaction();
    const hash = crypto.randomBytes(32);
    const index = 0;
    const sequence = Transaction.DEFAULT_SEQUENCE;
    const scriptSig = Buffer.from('00112233445566778899aabbccddeeff', 'hex');

    const inputIndex = tx.addInput(hash, index, sequence, scriptSig);
    assert.strictEqual(inputIndex, 0);
    assert.strictEqual(tx.ins.length, 1);

    const input: Input = tx.ins[0];
    assert.deepStrictEqual(input.hash, hash);
    assert.strictEqual(input.index, index);
    assert.strictEqual(input.sequence, sequence);
    assert.deepStrictEqual(input.script, scriptSig);
  });

  it('should add an output to the transaction', () => {
    const tx = new Transaction();
    const scriptPubKey = Buffer.from('00112233445566778899aabbccddeeff', 'hex');
    const value = 1000;

    const outputIndex = tx.addOutput(scriptPubKey, value);
    assert.strictEqual(outputIndex, 0);
    assert.strictEqual(tx.outs.length, 1);

    const output: Output = tx.outs[0];
    assert.deepStrictEqual(output.script, scriptPubKey);
    assert.strictEqual(output.value, value);
  });

  it('should calculate the transaction ID', () => {
    const tx = new Transaction();
    const hash = crypto.randomBytes(32);
    const index = 0;
    const scriptSig = Buffer.from('00112233445566778899aabbccddeeff', 'hex');
    tx.addInput(hash, index, undefined, scriptSig);

    const scriptPubKey = Buffer.from('00112233445566778899aabbccddeeff', 'hex');
    const value = 1000;
    tx.addOutput(scriptPubKey, value);

    const txId = tx.getId();
    assert.strictEqual(typeof txId, 'string');
    assert.strictEqual(txId.length, 64);
  });

  it('should correctly identify a coinbase transaction', () => {
    const tx = new Transaction();
    const coinbaseHash = Buffer.alloc(32, 0);
    tx.addInput(coinbaseHash, 0);

    assert.strictEqual(tx.isCoinbase(), true);
  });

  it('should correctly identify a non-coinbase transaction', () => {
    const tx = new Transaction();
    const hash = crypto.randomBytes(32);
    tx.addInput(hash, 0);

    assert.strictEqual(tx.isCoinbase(), false);
  });
});
