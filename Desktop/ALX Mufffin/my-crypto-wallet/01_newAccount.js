const { generateMnemonic, mnemonicToEntropy } = require("ethereum-cryptography/bip39");
const { wordlist } = require("ethereum-cryptography/bip39/wordlists/english");
const { HDKey } = require("ethereum-cryptography/hdkey");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { writeFileSync } = require("fs");

function _generateMnemonic() {
  const strength = 256;
  const mnemonic = generateMnemonic(wordlist, strength);
  const entropy = mnemonicToEntropy(mnemonic, wordlist);
  return { mnemonic, entropy };
}

function _getHdRootKey(_entropy) {
  return HDKey.fromMasterSeed(_entropy);
}

function _generatePrivateKey(hdRoot, index) {
  return hdRoot.deriveChild(index).privateKey;
}

function _getPublicKey(privateKey) {
  return secp256k1.getPublicKey(privateKey, false); // <--- FIXED
}

function _getEthAddress(publicKey) {
  return keccak256(publicKey).slice(-20);
}

function _store(privateKey, publicKey, address) {
  const data = {
    privateKey: bytesToHex(privateKey),
    publicKey: bytesToHex(publicKey),
    address: "0x" + bytesToHex(address),
  };

  writeFileSync("account1.json", JSON.stringify(data, null, 2));
}

async function main() {
  const { mnemonic, entropy } = _generateMnemonic();
  console.log(`WARNING! Never disclose your seed phrase:\n${mnemonic}`);

  const hdRoot = _getHdRootKey(entropy);

  const privateKey = _generatePrivateKey(hdRoot, 0);
  const publicKey = _getPublicKey(privateKey);
  const address = _getEthAddress(publicKey);

  console.log("Account Address: 0x" + bytesToHex(address));

  _store(privateKey, publicKey, address);
}

main();
