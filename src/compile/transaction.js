'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.finalizePsbt = exports.signPsbt = exports.createUnsignedTx = exports.selectUtxos = void 0;
const __1 = require('..');
const psbt_1 = require('../psbt');
/**
 * This function selects the UTXOs to be used for the transaction
 * @param utxos This is an array of UTXOs
 * @param senders This is an array of senders
 * @param dustThreshold This is the dust threshold
 * @returns This returns an array of UTXOs
 * UTXOs are selected based on the amount of assets and the amount of senders
 */
const selectUtxos = (utxos, senders, dustThreshold = 546) => {
  if (!utxos || utxos.length === 0) {
    throw new Error('No UTXOs found');
  }
  if (!senders || senders.length === 0) {
    throw new Error('No senders found');
  }
  if (senders.some(sender => !sender.asset || !sender.amount)) {
    throw new Error('Invalid sender');
  }
  const assetToSenders = new Map();
  senders.forEach(sender => {
    const assetKey = sender.asset;
    if (!assetToSenders.has(assetKey)) {
      assetToSenders.set(assetKey, []);
    }
    assetToSenders.get(assetKey).push(sender);
  });
  const selectedUtxos = [];
  let evrUtxoSelected = false;
  assetToSenders.forEach((sendersForAsset, asset) => {
    const totalAmountNeeded = sendersForAsset.reduce(
      (sum, sender) => sum + sender.amount,
      0,
    );
    let accumulatedValue = 0;
    const filteredUtxos = utxos
      .filter(utxo => (utxo.asset === 'None' ? 'EVR' : utxo.asset) === asset)
      .filter(utxo => utxo.value >= dustThreshold)
      .sort((a, b) => b.value - a.value);
    for (const utxo of filteredUtxos) {
      selectedUtxos.push({
        tx_hash: utxo.tx_hash,
        asset,
        vout: utxo.tx_pos,
        value: utxo.value,
      });
      accumulatedValue += utxo.value;
      if (accumulatedValue >= totalAmountNeeded) {
        break;
      }
    }
    if (accumulatedValue < totalAmountNeeded) {
      throw new Error(`Insufficient UTXOs for asset: ${asset}`);
    }
    if (asset === 'EVR') {
      evrUtxoSelected = true;
    }
  });
  if (!evrUtxoSelected) {
    const evrUtxo = utxos
      .filter(utxo => utxo.asset === 'None' && utxo.value >= dustThreshold)
      .sort((a, b) => b.value - a.value)[0];
    if (evrUtxo) {
      selectedUtxos.push({
        tx_hash: evrUtxo.tx_hash,
        asset: 'EVR',
        vout: evrUtxo.tx_pos,
        value: evrUtxo.value,
      });
    } else {
      throw new Error('No EVR UTXO available to cover transaction fees');
    }
  }
  return selectedUtxos;
};
exports.selectUtxos = selectUtxos;
/**
 * This function creates an unsigned transaction
 * @param utxos This is an array of UTXOs
 * @param senders This is an array of senders
 * @param changeAddress This is the address of the change
 * @param feeRate This is the fee rate
 * @returns This returns an unsigned transaction
 */
const createUnsignedTx = (utxos, senders, changeAddress, feeRate = 2000) => {
  const psbt = new psbt_1.Psbt({ network: __1.networks.evrmore });
  psbt.version = 1;
  psbt.locktime = 0;
  const totalInputValues = {};
  const totalOutputValues = {};
  utxos.forEach(utxo => {
    const asset = utxo.asset || 'EVR';
    if (!totalInputValues[asset]) totalInputValues[asset] = 0;
    totalInputValues[asset] += utxo.value;
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      nonWitnessUtxo: utxo.nonWitnessUtxo,
    });
  });
  senders.forEach(sender => {
    const asset = sender.asset || 'EVR';
    if (!totalOutputValues[asset]) totalOutputValues[asset] = 0;
    totalOutputValues[asset] += sender.amount;
    psbt.addOutput({
      address: sender.address,
      value: asset === 'EVR' ? sender.amount : 0,
      asset:
        asset === 'EVR' ? undefined : { name: asset, amount: sender.amount },
    });
  });
  const estimatedTxSize =
    psbt.data.inputs.length * 180 + psbt.data.outputs.length * 34 + 10;
  const fee = estimatedTxSize * feeRate;
  Object.keys(totalInputValues).forEach(asset => {
    const totalInputValue = totalInputValues[asset];
    const totalOutputValue = totalOutputValues[asset] || 0;
    const changeValue =
      totalInputValue - totalOutputValue - (asset === 'EVR' ? fee : 0);
    if (changeValue < 0) {
      throw new Error(`Insufficient funds for asset: ${asset}`);
    }
    if (changeValue > 0) {
      psbt.addOutput({
        address: changeAddress,
        value: asset === 'EVR' ? changeValue : 0,
        asset:
          asset === 'EVR' ? undefined : { name: asset, amount: changeValue },
      });
    }
  });
  return psbt.toHex();
};
exports.createUnsignedTx = createUnsignedTx;
/**
 * This function signs a PSBT
 * @param psbtBase64 This is the PSBT in base64 format
 * @param keyPair This is the keypair to sign the PSBT
 * @returns This returns a signed PSBT in base64 format
 */
const signPsbt = (unsignedTx, keyPair, redeemScript, witnessScript) => {
  const psbt = psbt_1.Psbt.fromHex(unsignedTx);
  const inputCount = psbt.inputCount;
  for (let i = 0; i < inputCount; i++) {
    try {
      if (redeemScript) {
        psbt.updateInput(i, { redeemScript });
      }
      if (witnessScript) {
        psbt.updateInput(i, { witnessScript });
      }
      psbt.signInput(i, keyPair);
    } catch (error) {
      console.error(`Error signing input ${i}:`, error);
    }
  }
  return psbt.toBase64();
};
exports.signPsbt = signPsbt;
/**
 * This function merges two PSBTs
 * @param psbtArray This is an array of PSBTs
 * @returns This returns a merged PSBT
 */
const finalizePsbt = psbtArray => {
  const psbt1Obj = psbt_1.Psbt.fromBase64(psbtArray[0]);
  if (psbtArray.length > 1) {
    for (let i = 1; i < psbtArray.length; i++) {
      const psbt2Obj = psbt_1.Psbt.fromBase64(psbtArray[i]);
      psbt1Obj.combine(psbt2Obj);
    }
  }
  psbt1Obj.finalizeAllInputs();
  const signedTx = psbt1Obj.extractTransaction().toHex();
  return signedTx;
};
exports.finalizePsbt = finalizePsbt;
