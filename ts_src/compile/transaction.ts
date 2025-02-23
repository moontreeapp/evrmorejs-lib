import { networks } from '..';
import { Psbt, Signer } from '../psbt';

export interface FetchedUtxoType {
  tx_hash: string;
  tx_pos: number;
  height: number;
  asset: string;
  value: number;
}

export interface UtxoType {
  txid: string;
  vout: number;
  value: number;
  nonWitnessUtxo: Buffer;
  asset: string;
}

export interface ReceipientType {
  address: string;
  asset: string;
  amount: number;
}

export const selectUtxos = (
  utxos: FetchedUtxoType[],
  senders: ReceipientType[],
  dustThreshold: number = 546,
): { tx_hash: string; asset: string; vout: number; value: number }[] => {
  if (!utxos || utxos.length === 0) {
    throw new Error('No UTXOs found');
  }

  if (!senders || senders.length === 0) {
    throw new Error('No senders found');
  }

  if (senders.some(sender => !sender.asset || !sender.amount)) {
    throw new Error('Invalid sender');
  }

  const assetToSenders = new Map<string, ReceipientType[]>();
  senders.forEach(sender => {
    const assetKey = sender.asset;
    if (!assetToSenders.has(assetKey)) {
      assetToSenders.set(assetKey, []);
    }
    assetToSenders.get(assetKey)!.push(sender);
  });

  const selectedUtxos: {
    tx_hash: string;
    asset: string;
    vout: number;
    value: number;
  }[] = [];
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

export const createTx = (
  keypair: Signer,
  utxos: UtxoType[],
  senders: ReceipientType[],
  changeAddress: string,
  feeRate: number,
): string => {
  const psbt = new Psbt({ network: networks.evrmore });
  psbt.version = 1;
  psbt.locktime = 0;

  const totalInputValues: { [asset: string]: number } = {};
  const totalOutputValues: { [asset: string]: number } = {};

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

  utxos.forEach((_, index) => {
    try {
      psbt.signInput(index, keypair);
    } catch (error) {
      console.error(`Error signing input ${index}:`, error);
    }
  });

  try {
    psbt.finalizeAllInputs();
  } catch (error) {
    console.error('Error finalizing inputs:', error);
  }

  const tx = psbt.extractTransaction();

  return tx.toHex();
};
