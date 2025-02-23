'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ripemd160 = ripemd160;
exports.sha1 = sha1;
exports.sha256 = sha256;
exports.hash160 = hash160;
exports.hash256 = hash256;
exports.taggedHash = taggedHash;
const createHash = require('create-hash');
function ripemd160(buffer) {
  try {
    return createHash('rmd160')
      .update(buffer)
      .digest();
  } catch (err) {
    return createHash('ripemd160')
      .update(buffer)
      .digest();
  }
}
function sha1(buffer) {
  return createHash('sha1')
    .update(buffer)
    .digest();
}
function sha256(buffer) {
  return createHash('sha256')
    .update(buffer)
    .digest();
}
function hash160(buffer) {
  return ripemd160(sha256(buffer));
}
function hash256(buffer) {
  return sha256(sha256(buffer));
}
const TAGS = [
  'BIP0340/challenge',
  'BIP0340/aux',
  'BIP0340/nonce',
  'TapLeaf',
  'TapBranch',
  'TapSighash',
  'TapTweak',
  'KeyAgg list',
  'KeyAgg coefficient',
];
/** An object mapping tags to their tagged hash prefix of [SHA256(tag) | SHA256(tag)] */
const TAGGED_HASH_PREFIXES = Object.fromEntries(
  TAGS.map(tag => {
    const tagHash = sha256(Buffer.from(tag));
    return [tag, Buffer.concat([tagHash, tagHash])];
  }),
);
function taggedHash(prefix, data) {
  return sha256(Buffer.concat([TAGGED_HASH_PREFIXES[prefix], data]));
}
