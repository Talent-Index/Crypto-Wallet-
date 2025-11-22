"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('../../src/examples/sendC', () => ({
    sendC: jest.fn().mockResolvedValue({ txHash: '0xdeadbeef' })
}));
const sendC_1 = require("../../src/cli/sendC");
const sendC_2 = require("../../src/examples/sendC");
describe('CLI sendC', () => {
    const OLD_ARGV = process.argv;
    beforeEach(() => {
        jest.resetAllMocks();
        process.argv = [...OLD_ARGV.slice(0, 2)];
        jest.spyOn(process, 'exit').mockImplementation(((code) => { throw new Error('process.exit:' + code); }));
    });
    afterAll(() => {
        process.argv = OLD_ARGV;
    });
    test('errors when no recipient provided', async () => {
        await expect((0, sendC_1.main)()).rejects.toThrow();
    });
    test('calls sendC when recipient provided', async () => {
        process.argv.push('0xabc', '0.0001');
        await (0, sendC_1.main)();
        expect(sendC_2.sendC).toHaveBeenCalledWith('0xabc', '0.0001');
    });
});
