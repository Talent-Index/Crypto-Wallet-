"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const ethers_1 = require("ethers");
jest.mock('fs');
const mockedFs = fs;
// Mock ethers Wallet.encrypt
const encryptSpy = jest.spyOn(ethers_1.ethers.Wallet.prototype, 'encrypt').mockImplementation(async function () {
    return JSON.stringify({ mock: true });
});
const createWallet_1 = require("../../src/cli/createWallet");
describe('CLI createWallet', () => {
    const OLD_ARGV = process.argv;
    beforeEach(() => {
        jest.resetAllMocks();
        process.argv = [...OLD_ARGV.slice(0, 2)];
        jest.spyOn(process, 'exit').mockImplementation(((code) => { throw new Error('process.exit:' + code); }));
    });
    afterAll(() => {
        process.argv = OLD_ARGV;
    });
    test('fails without password', async () => {
        await expect((0, createWallet_1.main)()).rejects.toThrow();
    });
    test('creates wallet and writes file when password provided', async () => {
        process.argv.push('--password', 'test-pass');
        // call
        await (0, createWallet_1.main)();
        expect(encryptSpy).toHaveBeenCalled();
        expect(mockedFs.mkdirSync).toHaveBeenCalled();
        expect(mockedFs.writeFileSync).toHaveBeenCalled();
    });
});
