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
let avalancheAvailable = true;
try {
    require.resolve('avalanche');
}
catch (e) {
    avalancheAvailable = false;
}
const RPC_HOST = process.env.RPC_HOST || 'api.avax-test.network';
const PK = process.env.DEV_PRIVATE_KEY;
if (!avalancheAvailable || !PK) {
    test.skip('Integration X-Chain test skipped: missing `avalanche` package or DEV_PRIVATE_KEY', () => { });
}
else {
    jest.setTimeout(180000);
    test('sendX integration - build and issue X-Chain transfer (Fuji)', async () => {
        const { sendX } = await Promise.resolve().then(() => __importStar(require('../../src/examples/sendX')));
        // For integration, require a valid X address in TEST_X_RECIPIENT or use derived
        const to = process.env.TEST_X_RECIPIENT;
        if (!to)
            throw new Error('Set TEST_X_RECIPIENT env for X-chain integration');
        const txid = await sendX(to, Number(process.env.TEST_X_AMOUNT || '1000000'));
        expect(typeof txid).toBe('string');
        expect(txid.length).toBeGreaterThan(0);
    });
}
