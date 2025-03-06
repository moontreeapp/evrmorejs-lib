import {
  createUnsignedTx,
  signPsbt,
  finalizePsbt,
  networks,
  payments,
  selectUtxos,
} from 'evrmorejs-lib';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);
const keyPair = ECPair.fromWIF(
  'Kx8CrP9rBUzQ36USMLAcfJgDDAogpPmpG2ejnQhnrEV4bvCptaNP',
  networks.evrmore,
);
const { address } = payments.p2pkh({
  pubkey: keyPair.publicKey,
  network: networks.evrmore,
});

console.log('Address from WIF:', address);

function createTransaction() {
  const recepients = [
    {
      address: 'eEY5brnAULc9wnr2Evfr31rdUHpoZbn1Uq',
      amount: 2000000,
      asset: 'SATORI',
    },
    {
      address: 'eEY5brnAULc9wnr2Evfr31rdUHpoZbn1Uq',
      amount: 100000,
      asset: 'EVR',
    },
  ];
  const fetchedUtxos = [
    {
      tx_hash:
        'd6bed12f3836b0a5af737c8485f30886b54b3812c84e01de0da53a0fa58fa3eb',
      tx_pos: 0,
      height: 1157742,
      asset: 'SATORI',
      value: 10000000,
    },
    {
      tx_hash:
        '9bdfcbabd8a902f96812057adc91cab7701ce4b275a9b16d3d97140ef1d1f7d5',
      tx_pos: 0,
      height: 1157744,
      asset: 'CHUPPA_CHUB',
      value: 100000000,
    },
    {
      tx_hash:
        'ed64805fdf9a36db1a428ce13bf118fa5b221f705d31d031776424b66c7ff8fb',
      tx_pos: 0,
      height: 1157804,
      asset: 'SATORI',
      value: 1,
    },
    {
      tx_hash:
        '1e966f715c61d54787c1a14f7e5ef5eb2186766e2e0e136dab564c9d5aebd25c',
      tx_pos: 0,
      height: 1162594,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        '5fad01567c804e8152ba191bce7bca13fcf79f654a402a564adc74308907e2a7',
      tx_pos: 0,
      height: 1163817,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        '7cee8385baec429fce36acae76e7a83471f1752070f31ca866174668e4199537',
      tx_pos: 0,
      height: 1163860,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        '46fddf717ff8129e3f2aa07baac30a2563db2b28544b5393e0f3d8d2615095eb',
      tx_pos: 0,
      height: 1163937,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        '3e607e28d105b50317ed02b91b242772f63d073c7c6e80a7dab0b200379397b8',
      tx_pos: 0,
      height: 1163945,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        'da024691a5f5fee489161b3f5d38ed50061ed2de260167844a2e26e253f0679d',
      tx_pos: 0,
      height: 1163955,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        '4dd89b193e81831524eb11a7f4f6a33d7ef3a33098ced726ea92100b7f0f5655',
      tx_pos: 0,
      height: 1163968,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        '7775ecd5410013372325f1616b6c7dcd1c9b786660cb677a172f4d519f6a813b',
      tx_pos: 0,
      height: 1164001,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        '645deb3354bcdb1b4070be92d38789e9123a0883f40eafff76b6f26868da9492',
      tx_pos: 0,
      height: 1164001,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        'c19d27c4bbba868e4304cdd1550f63ad6accebd23b35d25dc7c74bd02b141793',
      tx_pos: 0,
      height: 1164154,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        'd530b9e30855263ede11d704fb54644e467c48dcd0a2259b73bfc32a2393e9ca',
      tx_pos: 0,
      height: 1164650,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        '7de16f9e0a8903aac34cb548edbcd86366235485af3104c945137f8003274f09',
      tx_pos: 0,
      height: 1164699,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        'fe567c6f515673e129691bc85617d65074982a2f049c491855eec9522858f434',
      tx_pos: 0,
      height: 1165111,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        'dc826d280db4ef72d01ea8789b2aa792b39dddd009d9a995479dcc1f6e047f85',
      tx_pos: 0,
      height: 1165116,
      asset: 'SATORI',
      value: 1000000,
    },
    {
      tx_hash:
        'd6f6b2c070430c12fbc5dae6b78794700aa7924a658001086c0d4c53296db248',
      tx_pos: 0,
      height: 1165309,
      asset: 'SATORI',
      value: 1000000,
    },
    {
      tx_hash:
        '3ae925f6b01b5105cc6183e25a8f1d7e9c2f20167e886a6f30414a78bf420db6',
      tx_pos: 0,
      height: 1165317,
      asset: 'None',
      value: 1000000,
    },
    {
      tx_hash:
        '3ae925f6b01b5105cc6183e25a8f1d7e9c2f20167e886a6f30414a78bf420db6',
      tx_pos: 1,
      height: 1165317,
      asset: 'SATORI',
      value: 1000000,
    },
    {
      tx_hash:
        'c25b5c39e03b28bebe5e4c072597942e6d0a834be82c7fd36cd72a02b4607690',
      tx_pos: 1,
      height: 1165411,
      asset: 'SATORI',
      value: 20000000,
    },
    {
      tx_hash:
        '2e8c66a11d8cc7b1ed10a952da0573b4474f43d322e59fdf3999240a05ae127c',
      tx_pos: 0,
      height: 1202645,
      asset: 'None',
      value: 600000,
    },
    {
      tx_hash:
        '38bb346a8ba44a93b637063cb4295329c870a20c349dcd1806d97165ca2625a5',
      tx_pos: 0,
      height: 1206792,
      asset: 'None',
      value: 10000000,
    },
    {
      tx_hash:
        '8e83ecfa83a8fe172e9930631c7a75108cc287945af548cdf98d756c88c79e58',
      tx_pos: 0,
      height: 1207469,
      asset: 'SATORI',
      value: 2000000,
    },
  ];
  const selectedUtxos = selectUtxos(fetchedUtxos, recepients);
  console.log('Selected Utxos:', selectedUtxos);
  const utxos = [
    {
      txid: '38bb346a8ba44a93b637063cb4295329c870a20c349dcd1806d97165ca2625a5',
      vout: 0,
      value: 10000000,
      nonWitnessUtxo: Buffer.from(
        '0200000001713481c4fd595a9576076042884fa6824ca547a8ba0e5530410369dc0d52a0ea010000006b483045022100c27e0b39148222578eb86f1f5edfdf60c733400225ea6004104da311ace75d810220085570685567ddc45a1e76b37a150a36b0f745ca2a94e1dcb723b0851670995301210236e89b04579f4c031e80a26c8aca1c683b1d29691f2371b041591f6efb6d0d1efeffffff0280969800000000001976a91431b935055f9bcb2fd2192a932c449c5f0f5291e088acbf459cee030000001976a914923e937f03b5c09751b848308420d04daf80e64f88ac076a1200',
        'hex',
      ),
      asset: 'EVR',
    },
    {
      txid: 'c25b5c39e03b28bebe5e4c072597942e6d0a834be82c7fd36cd72a02b4607690',
      vout: 1,
      value: 20000000,
      nonWitnessUtxo: Buffer.from(
        '0100000004e3e699e54d9b70e9c0aabf2ed8ec01081e35462dfa0060a4f02a12c239b12cc302000000fdfd0000473044022022db0975b40176a7dabe99f4c0970043f15cd01c6252ee467306b35face2c7b802202e1713995c6e7a0ab5f80e3d09a2d83d32a4694e33935e37efd35227216e5b4401483045022100b8570921ce662802e1f578885c6eba5f9d248267933c6e28a769b84a568eefec022038c976aa98d79b2b78467a374dd8e2743475652248f52941f106fce2c7979595014c69522103b09319bfaebf50c353c72c34a32d58265751842b7817b8d452e87cec5431de772102a587b1cf3ef003b0662b167da5cdd2c908ca84af1298a9f3a9c7a33ce2a848cc2102126c7a85c29a53c9066574dde31762cea724c3cacf0fbd6ce7fb00315847992c53aeffffffff461bccd4a72afd3d04e49fb08be3cda60b8538ed6752d3a52d373b708284c75300000000fdfd00004730440220106959afd882e8431237b161cbe466e5a47b833fc11066d194946fcfbc9a82ef0220271b02fd0c9be5a865a4f01ace6acdf2274e1a6117b22d64ba4f2d621808727901483045022100d86bae17be332f08b6925ce511931607f1c2284c957c325f6dbf6dba4c6f6fec022071df966d38dc6f5a94880acb164e85172815ae0c5da3f0efa84926efb23b77c1014c69522103b09319bfaebf50c353c72c34a32d58265751842b7817b8d452e87cec5431de772102a587b1cf3ef003b0662b167da5cdd2c908ca84af1298a9f3a9c7a33ce2a848cc2102126c7a85c29a53c9066574dde31762cea724c3cacf0fbd6ce7fb00315847992c53aeffffffffd158de3af89c69784e72255972f68039b01f0411ececd5cb7da519a4a3e840fd00000000fdfd0000483045022100a79a880c8cdb48bcbb3116177c707a3ea21345a2f44873acc06bbdff131e303a02207b00623f095b8e1bd33cb96c9ab54b89dff2b9e388f1a688fd748c228100a91b01473044022062f1e82312dd165a3731d9f78fb28185de548137c78d597026235584353529f3022055f4bbb469b54bc743049589ab52071af13c64150a7a08bafade5aa878b21485014c69522103b09319bfaebf50c353c72c34a32d58265751842b7817b8d452e87cec5431de772102a587b1cf3ef003b0662b167da5cdd2c908ca84af1298a9f3a9c7a33ce2a848cc2102126c7a85c29a53c9066574dde31762cea724c3cacf0fbd6ce7fb00315847992c53aeffffffff48b26d29534c0d6c080180654a92a70a709487b7e6dac5fb120c4370c0b2f6d601000000fdfe0000483045022100a9010700c6009d2da31742df238bf42d7349554456306da9d492b3f99263a4ff022054291e13bccb056562bb7e381f2d903980f5001ff9a8553a0bc6b0f7c076788301483045022100c35d25b74ee2a852e045d32dac051493d1450f25a676ea2f94eb4c3fd007f7aa02204c61069f873988cd717163932808208d294053c255fde37ce7b14a722de04409014c69522103b09319bfaebf50c353c72c34a32d58265751842b7817b8d452e87cec5431de772102a587b1cf3ef003b0662b167da5cdd2c908ca84af1298a9f3a9c7a33ce2a848cc2102126c7a85c29a53c9066574dde31762cea724c3cacf0fbd6ce7fb00315847992c53aeffffffff0440420f00000000001976a91431b935055f9bcb2fd2192a932c449c5f0f5291e088ac00000000000000002f76a91431b935055f9bcb2fd2192a932c449c5f0f5291e088acc01365767274065341544f5249002d31010000000075b0d2e0000000000017a91488784d7ed1f337eb57d01162d0ab4014c6598c0a8700000000000000002da91488784d7ed1f337eb57d01162d0ab4014c6598c0a87c01365767274065341544f5249404b4c00000000007500000000',
        'hex',
      ),
      asset: 'SATORI',
    },
  ];
  const changeAddress = 'EQ2dsWBZAJCUJsNTFm1aDY4BQHXTmFRGK5';
  const feeRate = 2000;
  const unsignedTx = createUnsignedTx(
    utxos,
    recepients,
    changeAddress,
    feeRate,
  );
  console.log('Unsigned Tx Hex:', unsignedTx);
  const signedTxHex = signPsbt(unsignedTx, keyPair);
  console.log('Signed Tx Hex:', signedTxHex);
  const finalizedTxHex = finalizePsbt([signedTxHex]);
  console.log('Finalized Tx Hex:', finalizedTxHex);
}

createTransaction();
