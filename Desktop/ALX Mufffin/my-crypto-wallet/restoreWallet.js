const { mnemonicToEntropy } = require("ethereum-cryptography/bip39");
const { wordlist } = require("ethereum-cryptography/bip39/wordlists/english");
const { HDKey } = require("ethereum-cryptography/hdkey");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { writeFileSync } = require("fs");

async function main(mnemonic) {
  const entropy = mnemonicToEntropy(mnemonic, wordlist);
  const hdRoot = HDKey.fromMasterSeed(entropy);

  const privateKey = hdRoot.deriveChild(0).privateKey;
  const publicKey = secp256k1.getPublicKey(privateKey, false);
  const address = keccak256(publicKey).slice(-20);

  console.log("Restored Address: 0x" + bytesToHex(address));
}

main(process.argv[2]);
