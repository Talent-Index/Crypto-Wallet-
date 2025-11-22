let avalancheAvailable = true;
try {
  require.resolve('avalanche');
} catch (e) {
  avalancheAvailable = false;
}

const RPC_HOST = process.env.RPC_HOST || 'api.avax-test.network';
const PK = process.env.DEV_PRIVATE_KEY;

if (!avalancheAvailable || !PK) {
  test.skip('Integration X-Chain test skipped: missing `avalanche` package or DEV_PRIVATE_KEY', () => {});
} else {
  jest.setTimeout(180000);
  test('sendX integration - build and issue X-Chain transfer (Fuji)', async () => {
    const { sendX } = await import('../../src/examples/sendX');
    // For integration, require a valid X address in TEST_X_RECIPIENT or use derived
    const to = process.env.TEST_X_RECIPIENT;
    if (!to) throw new Error('Set TEST_X_RECIPIENT env for X-chain integration');
    const txid = await sendX(to, Number(process.env.TEST_X_AMOUNT || '1000000'));
    expect(typeof txid).toBe('string');
    expect(txid.length).toBeGreaterThan(0);
  });
}
