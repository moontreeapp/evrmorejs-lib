'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.multisigRedeemScript = exports.finalizePsbt = exports.signPsbt = exports.selectUtxos = exports.createUnsignedTx = void 0;
var transaction_1 = require('./transaction');
Object.defineProperty(exports, 'createUnsignedTx', {
  enumerable: true,
  get: function() {
    return transaction_1.createUnsignedTx;
  },
});
Object.defineProperty(exports, 'selectUtxos', {
  enumerable: true,
  get: function() {
    return transaction_1.selectUtxos;
  },
});
Object.defineProperty(exports, 'signPsbt', {
  enumerable: true,
  get: function() {
    return transaction_1.signPsbt;
  },
});
Object.defineProperty(exports, 'finalizePsbt', {
  enumerable: true,
  get: function() {
    return transaction_1.finalizePsbt;
  },
});
var redeemScript_1 = require('./redeemScript');
Object.defineProperty(exports, 'multisigRedeemScript', {
  enumerable: true,
  get: function() {
    return redeemScript_1.multisigRedeemScript;
  },
});
