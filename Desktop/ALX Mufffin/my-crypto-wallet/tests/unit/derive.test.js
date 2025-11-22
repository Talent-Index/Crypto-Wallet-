"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const derive_1 = require("../../src/keymanager/derive");
const MNEMONIC = 'test test test test test test test test test test test junk';
test('deriveEvmFromMnemonic returns deterministic address and valid format', async () => {
    const r1 = await (0, derive_1.deriveEvmFromMnemonic)(MNEMONIC, 0);
    const r2 = await (0, derive_1.deriveEvmFromMnemonic)(MNEMONIC, 0);
    expect(r1.address).toBe(r2.address);
    expect(r1.address.startsWith('0x')).toBeTruthy();
    expect(r1.address.length).toBe(42);
});
