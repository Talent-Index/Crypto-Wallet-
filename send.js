const { getDefaultProvider, Wallet, utils } = require("ethers");
const { readFileSync } = require("fs");

async function main(to, amount) {
  const provider = getDefaultProvider("goerli");

  const raw = readFileSync("account1.json");
  const data = JSON.parse(raw);

  const privateKey = "0x" + data.privateKey;

  const wallet = new Wallet(privateKey, provider);

  const tx = await wallet.sendTransaction({
    to,
    value: utils.parseEther(amount),
  });

  console.log(tx);
}

main(process.argv[2], process.argv[3]);
