jest.mock('../../src/examples/sendC', () => ({
  sendC: jest.fn().mockResolvedValue({ txHash: '0xdeadbeef' })
}));

import { main as sendCMain } from '../../src/cli/sendC';
import { sendC } from '../../src/examples/sendC';

describe('CLI sendC', () => {
  const OLD_ARGV = process.argv;
  beforeEach(() => {
    jest.resetAllMocks();
    process.argv = [...OLD_ARGV.slice(0, 2)];
    jest.spyOn(process, 'exit').mockImplementation(((code?: number) => { throw new Error('process.exit:' + code); }) as any);
  });
  afterAll(() => {
    process.argv = OLD_ARGV;
  });

  test('errors when no recipient provided', async () => {
    await expect(sendCMain()).rejects.toThrow();
  });

  test('calls sendC when recipient provided', async () => {
    process.argv.push('0xabc', '0.0001');
    await sendCMain();
    expect(sendC).toHaveBeenCalledWith('0xabc', '0.0001');
  });
});
