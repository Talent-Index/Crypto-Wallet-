# Avalanche Crypto Wallet

A full-stack Avalanche wallet implementation with CLI tools and a React UI, referencing BuilderKit components for blockchain interactions.

## Quick Start

### 1. Setup

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in:
```bash
cp .env.example .env
```

Edit `.env`:
```
RPC_URL_FUJI=https://api.avax-test.network/ext/bc/C/rpc
RPC_URL_MAINNET=https://api.avax.network/ext/bc/C/rpc
DEV_PRIVATE_KEY=<your_fuji_test_key>
```

### 3. Run CLI Commands

Create a new wallet:
```bash
npm run cli:create-wallet -- --password mysecurepass
```

Send AVAX on C-Chain (requires funded testnet account):
```bash
npm run cli:send-c -- 0xRecipientAddress 0.001
```

Import a mnemonic:
```bash
npm run cli:import-mnemonic -- --mnemonic "word word ..." --password pass
```

### 4. Run Tests

Unit tests:
```bash
npm test
```

Integration tests (requires `.env` with RPC + DEV_PRIVATE_KEY):
```bash
npm run test:integration
```

### 5. Start React UI (Development)

Requires Vite and React plugins. Install:
```bash
npm install -D @vitejs/plugin-react vite
```

Then start dev server:
```bash
npm run dev
# or if not configured, run:
npx vite src/ui/index.html --port 5173 --open
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
.
├── src/
│   ├── cli/                 # CLI commands (create, import, send)
│   ├── examples/            # Example scripts (sendC, sendX, derive)
│   ├── keymanager/          # Key derivation and storage
│   ├── ui/                  # React UI with BuilderKit
│   └── ...
├── tests/
│   ├── unit/                # Unit tests (derive, CLI mocks)
│   └── integration/         # Integration tests (live Fuji)
├── doc/                     # Documentation (placeholder)
├── package.json
├── tsconfig.json
├── jest.config.js
└── vite.config.ts
```

## Key Features

### CLI
- ✅ Create encrypted wallet with BIP-39 mnemonic
- ✅ Import mnemonic and export encrypted JSON
- ✅ Send AVAX on C-Chain (ethers.js)
- ✅ Send on X-Chain (avalanchejs - optional)
- ✅ Unit tests with mocked fs and ethers

### React UI
- 🔧 Dashboard: wallet connect, balance display
- 🔧 Send form: recipient, amount, explorer link
- 🔧 Receive: address display + copy button (QR placeholder)
- 🔧 Settings: network selection, CLI reference
- 🔧 BuilderKit component references

### Examples & Tests
- ✅ Derive EVM addresses from mnemonic (BIP-39/44)
- ✅ Unit test for deterministic derivation
- ✅ Integration tests (C-Chain, X-Chain on Fuji)
- ✅ Conditional skips for missing packages/env

## Development Roadmap

### MVP (Current)
- [x] CLI wallet creation and send
- [x] TypeScript examples (sendC, sendX, derive)
- [x] Unit tests with mocks
- [x] React UI scaffolding

### v1 (In Progress)
- [ ] Full doc/ folder (16 markdown files)
- [ ] BuilderKit component integration
- [ ] Cross-chain export/import (C ↔ X)

### v2 (Future)
- [ ] Ledger / hardware wallet support
- [ ] KMS-backed server signing
- [ ] Token list and ERC-20 display
- [ ] Mobile deep linking

## Documentation

See `src/ui/README.md` for UI setup and usage.
Full docs will be in `doc/` folder.

Reference: [BuilderKit Components](https://build.avax.network/docs/builderkit#ready-to-use-components)

## Security

⚠️ **Important:**
- **Never commit `.env` with private keys to git**
- Use `.env.example` as a template
- Only use testnet keys for local development
- Consider Ledger for mainnet operations
- Encrypt sensitive data (KMS, secure enclave)

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run cli:create-wallet` | Generate new wallet |
| `npm run cli:import-mnemonic` | Import from mnemonic |
| `npm run cli:send-c` | Send on C-Chain |
| `npm run cli:send-x` | Send on X-Chain |
| `npm test` | Run unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run build` | Compile TypeScript |
| `npm run dev` | Start React dev server (Vite) |

## Troubleshooting

**MetaMask not found in React UI?**
- Ensure MetaMask browser extension is installed
- Or use CLI commands: `npm run cli:send-c`

**RPC timeout?**
- Check `RPC_URL_FUJI` in `.env`
- Verify Fuji testnet is available

**Nonce too low on C-Chain?**
- Manually set a higher nonce (backend will auto-recover)
- Or reset the account

**`avalanche` package not found?**
- Optional for X-Chain. Install if needed: `npm install avalanche`
- X-Chain tests will be skipped without it

## References

- Avalanche Docs: https://docs.avax.network/
- BuilderKit: https://build.avax.network/docs/builderkit/
- Ethers.js: https://docs.ethers.org/
- BIP-39 Derivation: https://github.com/trezor/python-mnemonic

## License

MIT
