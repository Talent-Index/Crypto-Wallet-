import dotenv from 'dotenv';
dotenv.config();

const RPC_HOST = process.env.RPC_HOST || 'api.avax-test.network';
const RPC_PORT = Number(process.env.RPC_PORT || 443);
const PROTOCOL = process.env.RPC_PROTOCOL || 'https';

export async function sendX(toAddress: string, amountNAvax: number) {
  let avalanche: any;
  try {
    avalanche = await import('avalanche');
  } catch (err) {
    throw new Error('`avalanche` package not installed. Run `npm install avalanche` to use X-Chain examples');
  }

  const { Avalanche } = avalanche;
  const ava = new Avalanche(RPC_HOST, RPC_PORT, PROTOCOL);
  const xchain = ava.XChain();
  const keyChain = xchain.keyChain();

  const priv = process.env.DEV_PRIVATE_KEY;
  if (!priv) throw new Error('DEV_PRIVATE_KEY not set in env');
  keyChain.importKey(priv.replace(/^0x/, ''));

  const fromAddresses = keyChain.getAddresses();
  const toAddrs = [toAddress];

  const assetID = await xchain.getAVAXAssetID();
  const utxos = await xchain.getUTXOs(fromAddresses);

  const unsignedTx = await xchain.buildBaseTx(
    amountNAvax,
    assetID,
    toAddrs,
    fromAddresses,
    fromAddresses,
    utxos
  );
  const signed = unsignedTx.sign(keyChain);
  const txid = await xchain.issueTx(signed);
  console.log('xchain txid', txid);
  return txid;
}

if (require.main === module) {
  const to = process.argv[2];
  const amount = Number(process.argv[3] || '1000000');
  if (!to) {
    console.error('Usage: ts-node src/examples/sendX.ts <X-address> [amountNAvax]');
    process.exit(1);
  }
  sendX(to, amount).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
