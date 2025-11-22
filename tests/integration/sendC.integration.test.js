"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendC_1 = require("../../src/examples/sendC");
const RPC = process.env.RPC_URL_FUJI;
const PK = process.env.DEV_PRIVATE_KEY;
// Skip integration tests unless env variables provided
if (!RPC || !PK) {
    test.skip('Integration test skipped: missing RPC_URL_FUJI or DEV_PRIVATE_KEY', () => { });
}
else {
    jest.setTimeout(120000); // 2 minutes
    test('sendC integration - send tiny self-transfer on Fuji', async () => {
        const providerTo = process.env.TEST_RECIPIENT || undefined;
        // Default to self-transfer
        const provider = require('ethers').providers.JsonRpcProvider;
        const address = (await require('ethers').Wallet.fromEncryptedJson) ? null : null;
        // send to own address derived from private key
        const { ethers } = require('ethers');
        const wallet = new ethers.Wallet(PK, new ethers.providers.JsonRpcProvider(RPC));
        const to = providerTo || wallet.address;
        const res = await (0, sendC_1.sendC)(to, '0.0001');
        expect(res.txHash).toMatch(/^0x[0-9a-fA-F]{64}$/);
    });
}
