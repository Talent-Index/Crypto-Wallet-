import { deriveEvmFromMnemonic } from '../../src/keymanager/derive';

const MNEMONIC = 'test test test test test test test test test test test junk';

test('deriveEvmFromMnemonic returns deterministic address and valid format', async () => {
  const r1 = await deriveEvmFromMnemonic(MNEMONIC, 0);
  const r2 = await deriveEvmFromMnemonic(MNEMONIC, 0);
  expect(r1.address).toBe(r2.address);
  expect(r1.address.startsWith('0x')).toBeTruthy();
  expect(r1.address.length).toBe(42);
});
