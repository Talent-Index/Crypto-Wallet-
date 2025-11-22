import * as fs from 'fs';
import * as path from 'path';
import * as bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet';
import { ethers } from 'ethers';

function argvGet(flag: string) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

export async function main() {
  const password = argvGet('--password') || process.env.CLI_PASSWORD;
  if (!password) {
    console.error('A password is required to encrypt the wallet. Provide --password or CLI_PASSWORD env var.');
    process.exit(1);
  }

  const strengthArg = argvGet('--strength') || '256';
  const strength = Number(strengthArg);
  const mnemonic = bip39.generateMnemonic(strength);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = hdkey.fromMasterSeed(seed as any);
  const pathDerive = `m/44'/60'/0'/0/0`;
  const child = root.derivePath(pathDerive);
  const walletEth = child.getWallet();
  const priv = walletEth.getPrivateKeyString();

  const ethersWallet = new ethers.Wallet(priv);
  console.log('Encrypting wallet JSON (this may take a few seconds)...');
  const json = await ethersWallet.encrypt(password);

  const outDir = path.join(process.cwd(), 'wallets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const filename = path.join(outDir, `wallet-${Date.now()}.json`);
  fs.writeFileSync(filename, json, { encoding: 'utf8' });

  console.log('Wallet created and encrypted to:', filename);
  console.log('IMPORTANT: Save this mnemonic securely (offline):');
  console.log(mnemonic);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
