import * as fs from 'fs';
import * as bip39 from 'bip39';
import { ethers } from 'ethers';

jest.mock('fs');
const mockedFs = fs as unknown as {
  writeFileSync: jest.Mock;
  mkdirSync: jest.Mock;
  existsSync: jest.Mock;
};


const encryptSpy = jest.spyOn((ethers.Wallet.prototype as any), 'encrypt').mockImplementation(async function () {
  return JSON.stringify({ mock: true });
});

import { main as importMain } from '../../src/cli/importMnemonic';

describe('CLI importMnemonic', () => {
  const OLD_ARGV = process.argv;
  beforeEach(() => {
    jest.resetAllMocks();
    process.argv = [...OLD_ARGV.slice(0, 2)];
    jest.spyOn(process, 'exit').mockImplementation(((code?: number) => { throw new Error('process.exit:' + code); }) as any);
  });
  afterAll(() => {
    process.argv = OLD_ARGV;
  });

  test('fails without mnemonic', async () => {
    await expect(importMain()).rejects.toThrow();
  });

  test('imports mnemonic and writes file when mnemonic and password provided', async () => {
    const mnemonic = bip39.generateMnemonic();
    process.argv.push('--mnemonic', mnemonic, '--password', 'xpass');
    await importMain();
    expect(encryptSpy).toHaveBeenCalled();
    expect(mockedFs.mkdirSync).toHaveBeenCalled();
    expect(mockedFs.writeFileSync).toHaveBeenCalled();
  });
});
