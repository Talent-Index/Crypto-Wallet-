import * as bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet';
import { ethers } from 'ethers';

export async function deriveEvmFromMnemonic(mnemonic: string, index = 0) {
  if (!bip39.validateMnemonic(mnemonic)) throw new Error('Invalid mnemonic');
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = hdkey.fromMasterSeed(seed);
  const path = `m/44'/60'/0'/0/${index}`;
  const child = root.derivePath(path);
  const wallet = child.getWallet();
  const priv = wallet.getPrivateKeyString();
  const address = ethers.computeAddress(priv);
  return { path, priv, address };
}
