import { createTx, networks, payments, selectUtxos } from 'evrmorejs-lib';
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
      address: 'EMgpUQ8ucUSnZnrpYvD2n7na48LfSbZHti',
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
        '1aa6d6af716d8d04592e8bbcaa5d5f26de3651426cba28db777c2c548a20939a',
      tx_pos: 0,
      height: 1162497,
      asset: 'None',
      value: 1000000,
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
        'dc826d280db4ef72d01ea8789b2aa792b39dddd009d9a995479dcc1f6e047f85',
      tx_pos: 1,
      height: 1165116,
      asset: 'SATORI',
      value: 49000000,
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
  ];
  const selectedUtxos = selectUtxos(fetchedUtxos, recepients);
  console.log('Selected Utxos:', selectedUtxos);
  const utxos = [
    {
      txid: '1aa6d6af716d8d04592e8bbcaa5d5f26de3651426cba28db777c2c548a20939a',
      vout: 0,
      value: 1000000,
      nonWitnessUtxo: Buffer.from(
        '010000000157b750b8a0172e05c76b40a525fceb1035f0b964f3ad8f4299d02cbae674d49500000000fdfe0000483045022100fa4755411bb017eef8c109c777b254a00850105266144ef9dbd90ec76c343f4402206f162ca2680e2c41cf44671605c59d51819ecf5ccac48b3e697b3d30a15c82c301483045022100adae89b0d0a648c4188c49d67f38b40607efd839909fea176d56816cc6fe22700220612a262b29ac37c0b87db60fe81627dbc9bb666076cf5ac83d461e43ce2a69d6014c69522103b09319bfaebf50c353c72c34a32d58265751842b7817b8d452e87cec5431de772102a587b1cf3ef003b0662b167da5cdd2c908ca84af1298a9f3a9c7a33ce2a848cc2102126c7a85c29a53c9066574dde31762cea724c3cacf0fbd6ce7fb00315847992c53aeffffffff0240420f00000000001976a91431b935055f9bcb2fd2192a932c449c5f0f5291e088ac60b0ce020000000017a91488784d7ed1f337eb57d01162d0ab4014c6598c0a8700000000',
        'hex',
      ),
      asset: 'EVR',
    },
    {
      txid: 'dc826d280db4ef72d01ea8789b2aa792b39dddd009d9a995479dcc1f6e047f85',
      vout: 1,
      value: 49000000,
      nonWitnessUtxo: Buffer.from(
        '01000000028d7709f9b87b700b3adb6125dd529e1ca4158a6c1e5096dc1697dd185d1179a700000000fdfe0000483045022100b66df0bd0449f0dcff588efc5e8e5e1e353c08f733d3f972b0d97ed082f3d526022025bd0ae08bb5d182fa609919a01bece4263bffadb5283e3078c5d5d0f7651aa7014830450221009b1ec97e0ccfc6a2884362246b4443106f01118f9e0dba001c53ccbe04450e420220337aae1073a3718d03b4f3a9b53664b3b5b5a70ea040ad4a82847a701f4d3dbb014c69522103b09319bfaebf50c353c72c34a32d58265751842b7817b8d452e87cec5431de772102a587b1cf3ef003b0662b167da5cdd2c908ca84af1298a9f3a9c7a33ce2a848cc2102126c7a85c29a53c9066574dde31762cea724c3cacf0fbd6ce7fb00315847992c53aeffffffff34f4582852c9ee5518499c042f2a987450d61756c81b6929e17356516f7c56fe02000000fc0047304402204faf0e596697f97c756fd13555861a7e8b5bdac081d649a51327ee2c5e8656b202202655bdcd17105dd613333d7adc163e1721292a00d8c012ebc10f584cca57cad001473044022047076c5faae05b3dc1e3a09093b5498128e2a9ba4fe0968d02146dac0f713f7502206e518878bd7c07a0612dda0c715e7ec7dba8b2fc97a9c4207b94ea547bc56350014c69522103b09319bfaebf50c353c72c34a32d58265751842b7817b8d452e87cec5431de772102a587b1cf3ef003b0662b167da5cdd2c908ca84af1298a9f3a9c7a33ce2a848cc2102126c7a85c29a53c9066574dde31762cea724c3cacf0fbd6ce7fb00315847992c53aeffffffff0300000000000000002f76a91431b935055f9bcb2fd2192a932c449c5f0f5291e088acc01365767274065341544f524940420f00000000007500000000000000002f76a91431b935055f9bcb2fd2192a932c449c5f0f5291e088acc01365767274065341544f524940aeeb020000000075682652010000000017a91488784d7ed1f337eb57d01162d0ab4014c6598c0a8700000000',
        'hex',
      ),
      asset: 'SATORI',
    },
  ];
  const changeAddress = 'EQ2dsWBZAJCUJsNTFm1aDY4BQHXTmFRGK5';
  const feeRate = 2000;
  const txHexByFunction = createTx(
    keyPair,
    utxos,
    recepients,
    changeAddress,
    feeRate,
  );
  console.log('Tx Hex by function:', txHexByFunction);
}

createTransaction();
