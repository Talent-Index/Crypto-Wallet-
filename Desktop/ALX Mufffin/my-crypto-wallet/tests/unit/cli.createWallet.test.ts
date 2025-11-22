import * as fs from 'fs';
import { ethers } from 'ethers';

jest.mock('fs');
const mockedFs = fs as unknown as {
  writeFileSync: jest.Mock;
  mkdirSync: jest.Mock;
  existsSync: jest.Mock;
};


// Mock ethers Wallet.encrypt
const encryptSpy = jest.spyOn((ethers.Wallet.prototype as any), 'encrypt').mockImplementation(async function () {
  return JSON.stringify({ mock: true });
});

import { main as createMain } from '../../src/cli/createWallet';

describe('CLI createWallet', () => {
  const OLD_ARGV = process.argv;
  beforeEach(() => {
    jest.resetAllMocks();
    process.argv = [...OLD_ARGV.slice(0, 2)];
    jest.spyOn(process, 'exit').mockImplementation(((code?: number) => { throw new Error('process.exit:' + code); }) as any);
  });
  afterAll(() => {
    process.argv = OLD_ARGV;
  });

  test('fails without password', async () => {
    await expect(createMain()).rejects.toThrow();
  });

  test('creates wallet and writes file when password provided', async () => {
    process.argv.push('--password', 'test-pass');
    // call
    await createMain();
    expect(encryptSpy).toHaveBeenCalled();
    expect(mockedFs.mkdirSync).toHaveBeenCalled();
    expect(mockedFs.writeFileSync).toHaveBeenCalled();
  });
});
