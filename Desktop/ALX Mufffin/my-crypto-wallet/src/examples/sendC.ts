import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const RPC = process.env.RPC_URL_FUJI || '';
const PRIVATE_KEY = process.env.DEV_PRIVATE_KEY || '';

export async function sendC(to: string, amountAvax: string) {
  if (!RPC) throw new Error('RPC_URL_FUJI not set in env');
  if (!PRIVATE_KEY) throw new Error('DEV_PRIVATE_KEY not set in env');

  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountAvax),
    gasLimit: 21000n
  });
  console.log('txHash', tx.hash);
  const receipt = await tx.wait(1);
  const blockNum = receipt && (receipt as any).blockNumber ? String((receipt as any).blockNumber) : 'unknown';
  console.log('confirmed in block', blockNum);
  return { txHash: tx.hash, receipt };
}

if (require.main === module) {
  const to = process.argv[2];
  const amount = process.argv[3] || '0.0001';
  if (!to) {
    console.error('Usage: ts-node src/examples/sendC.ts <to> [amount]');
    process.exit(1);
  }
  sendC(to, amount).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
