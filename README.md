# Avalanche Crypto Wallet – Comprehensive User Guide

A full-stack Avalanche wallet with **CLI tools**, **React UI**, and **TypeScript examples**. Perfect for developers, traders, and blockchain learners.

---

## 📋 Table of Contents

1. [What This Is](#what-this-is)
2. [Features](#features)
3. [Installation](#installation)
4. [Quick Start (5 minutes)](#quick-start-5-minutes)
5. [Web UI Guide](#web-ui-guide)
6. [CLI Tools Guide](#cli-tools-guide)
7. [For Developers](#for-developers)
8. [Deployment](#deployment)
9. [FAQ & Troubleshooting](#faq--troubleshooting)
10. [Security](#security)
11. [Support & Community](#support--community)

---

## What This Is

**Avalanche Crypto Wallet** is a beginner-to-advanced wallet for the Avalanche blockchain (specifically the C-Chain, which is EVM-compatible).

### You Can:
- 🔑 **Generate wallets** with secure seed phrases (mnemonics)
- 📤 **Send AVAX** tokens to other addresses
- 📥 **Receive AVAX** at your generated address
- 🔍 **View balances** and transaction history
- 💻 **Use CLI tools** for automation
- 🚀 **Deploy as a web app** for your team

### Built With:
- **React 18** – Modern UI framework
- **ethers.js 6** – Ethereum-compatible library (works with Avalanche C-Chain)
- **Vite** – Lightning-fast development server
- **TypeScript** – Type-safe code
- **MetaMask** – Hardware wallet integration

---

## Features

### 🎨 Web Interface (React UI)

| Feature | What It Does |
|---------|-------------|
| **Dashboard** | Connect MetaMask, see balance, disconnect |
| **Create Wallet** | Generate seed phrase + private key locally |
| **Send** | Transfer AVAX with MetaMask signing |
| **Receive** | Display your address for incoming payments |
| **Settings** | Network config, CLI commands, debug tools |

### 🖥️ Command-Line Tools (CLI)

| Command | Purpose |
|---------|---------|
| `npm run cli:create-wallet` | Generate encrypted wallet + mnemonic |
| `npm run cli:import-mnemonic` | Import existing mnemonic |
| `npm run cli:send-c` | Send AVAX on C-Chain (with private key) |
| `npm run cli:send-x` | Send on X-Chain (UTXO model) |

### 💪 Developer Tools

| Tool | Purpose |
|------|---------|
| `npm run test` | Run unit tests |
| `npm run test:integration` | Run Fuji testnet tests |
| TypeScript examples | `src/examples/sendC.ts`, `src/examples/sendX.ts` |
| Key manager | `src/keymanager/derive.ts` – BIP-39/44 derivation |

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Talent-Index/Crypto-Wallet-.git
cd Crypto-Wallet-
```

### Step 2: Install Dependencies

```bash
npm install
```

If you hit peer dependency warnings:
```bash
npm install --legacy-peer-deps
```

**What gets installed:**
- React, Vite, ethers.js, avalanche-js, bip39
- Jest for testing
- TypeScript support
- ~300+ dependency packages

### Step 3: Create `.env` File

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Avalanche Fuji Testnet RPC (public, free)
VITE_RPC_URL_FUJI=https://api.avax-test.network/ext/bc/C/rpc

# Avalanche Mainnet RPC (for real transactions)
VITE_RPC_URL_MAINNET=https://api.avax.network/ext/bc/C/rpc

# For CLI testing only (NEVER commit)
CLI_PASSWORD=your-secure-password-here
DEV_PRIVATE_KEY=0x...

# X-Chain testing (optional)
TEST_X_RECIPIENT=X-fuji1...
```

**Important**: `.env` is in `.gitignore` – it will NOT be committed to Git.

---

## Quick Start (5 minutes)

### For Non-Technical Users (Use Web UI)

1. **Start the server**:
   ```bash
   npm run dev
   ```
   Opens: http://localhost:5173/

2. **Connect your wallet**:
   - Install MetaMask browser extension
   - Click "Connect MetaMask / Web3 Wallet"
   - Accept permission popup

3. **Create a new wallet**:
   - Go to "Create Wallet" tab
   - Click "🔑 Generate Mnemonic"
   - **Save your seed phrase in a safe place** (write it down offline!)
   - Get the address from the "Your Wallet Address" section

4. **Get test funds**:
   - Visit [Avalanche Faucet](https://faucet.avax.network/)
   - Paste your address
   - Request 10 AVAX (free, once per 24 hours)
   - Wait 30 seconds → refresh Dashboard

5. **Send AVAX**:
   - Go to "Send" tab
   - Paste recipient address
   - Enter amount (e.g., 0.01 AVAX)
   - Click "Send"
   - Approve in MetaMask popup
   - Done! ✅

### For Developers (Use CLI)

1. **Create a wallet with password**:
   ```bash
   npm run cli:create-wallet -- --password mySecurePassword
   ```
   Output:
   ```
   Wallet created and encrypted to: wallets/wallet-1700000000000.json
   IMPORTANT: Save this mnemonic securely (offline):
   word1 word2 word3 ... word24
   ```

2. **Get testnet funds**:
   - Copy the generated address
   - Request from [Faucet](https://faucet.avax.network/)
   - Or use `node` to decrypt your keystore locally

3. **Send AVAX from CLI**:
   ```bash
   export DEV_PRIVATE_KEY=0x...
   npm run cli:send-c -- 0xRecipientAddress 0.01
   ```

---

## Web UI Guide

### Dashboard Tab

**What You See:**
- Your connected Avalanche address
- Your C-Chain AVAX balance
- "Connect MetaMask" button (if not connected)

**What You Can Do:**
- 🔗 Click "Connect MetaMask / Web3 Wallet" to authorize
- 🔌 Click "Disconnect Wallet" to revoke permission
- 📊 See real-time balance (updates every 10 seconds)

**Common Issues:**
- **"No Web3 provider detected"** → Install MetaMask
- **"User denied account access"** → Approve the popup in MetaMask
- **Wrong network?** → MetaMask Settings → Switch to Avalanche C-Chain (Fuji or Mainnet)

---

### Create Wallet Tab

**What You See:**
1. Info box explaining wallet generation
2. "🔑 Generate Mnemonic" button
3. (After click) Your address and seed phrase

**What You Can Do:**
- ✅ Generate a new wallet (completely local, no server)
- 👁️ Reveal/hide seed phrase
- 📋 Copy seed phrase or address to clipboard
- 🔐 Encrypt & download keystore (encrypted JSON file)
- 🔑 Copy private key for MetaMask import

**⚠️ Security Warnings:**
- **Never share your seed phrase** – anyone with it can steal your funds
- **Never paste it online** – use offline storage (write it down)
- For real money, use a **hardware wallet** (Ledger, Trezor)
- Keystore passwords: use strong, unique passwords (15+ characters)

**How to Import into MetaMask:**
1. Copy your **private key** from Create Wallet
2. MetaMask → Account menu → "Import Account"
3. Select "Private Key" → Paste → Import
4. Your address appears in MetaMask

---

### Send Tab

**What You See:**
- "Recipient Address" input field
- "Amount (AVAX)" input field
- "Send" button
- (On error) Error message in red

**What You Can Do:**
- 📤 Send AVAX to any Avalanche address
- 👀 See transaction hash after success
- 🔗 Click "View on Explorer" to see on SnowTrace

**How to Send:**
1. Paste recipient's Avalanche address (starts with `0x`)
2. Enter amount (e.g., `0.01` for 0.01 AVAX)
3. Click "Send"
4. MetaMask popup appears → "Confirm" signing
5. Wait 5-30 seconds for blockchain confirmation
6. ✅ Success message with link to SnowTrace

**Fees:**
- Each transaction costs a small gas fee (0.001-0.01 AVAX)
- Shown in MetaMask before you approve

**Requirements:**
- ✅ MetaMask connected
- ✅ Enough AVAX to cover amount + gas
- ✅ Valid recipient address (starts with `0x`)

---

### Receive Tab

**What You See:**
- Your connected wallet address
- ⚠️ Warning about address types

**What You Can Do:**
- 📋 Click "Copy Address" to copy to clipboard
- 🎯 Share with others for receiving payments
- ⚠️ Only send C-Chain AVAX to this address (not X-Chain or P-Chain)

**How Others Send to You:**
1. They see your address (from Receive tab)
2. They use the "Send" tab (or their own wallet)
3. Paste your address as recipient
4. You receive the AVAX in ~10 seconds

---

### Settings Tab

**Network Selector:**
- **Fuji Testnet** (recommended for testing) – Free funds from faucet
- **Mainnet** (real money!) – Use only with real funds

**CLI Commands Reference:**
```bash
# Create encrypted wallet
npm run cli:create-wallet -- --password yourpass

# Import existing mnemonic
npm run cli:import-mnemonic -- --mnemonic "..." --password pass

# Send on C-Chain
npm run cli:send-c -- 0xaddress 0.01

# Send on X-Chain
npm run cli:send-x -- X-fuji1address 1000000
```

**Debug Panel:**
- "Detect Provider" – Checks if MetaMask is installed
- "Request Accounts" – Triggers permission popup
- Shows: Has Provider, isMetaMask, Accounts, Errors

---

## CLI Tools Guide

### Command: `npm run cli:create-wallet`

**Purpose**: Generate a new wallet locally with encryption

**Usage**:
```bash
npm run cli:create-wallet -- --password mysecurepass
```

**Output**:
```
Encrypting wallet JSON (this may take a few seconds)...
Wallet created and encrypted to: wallets/wallet-1700000000000.json
IMPORTANT: Save this mnemonic securely (offline):
abandon ability able about above absent absolute absorb abstract abstract abstract ...
```

**What It Does**:
1. Generates random 24-word seed phrase
2. Derives private key (using BIP-44: `m/44'/60'/0'/0/0`)
3. Encrypts private key with your password
4. Saves encrypted keystore JSON to `wallets/`
5. Prints mnemonic (save this offline!)

**Files Created**:
- `wallets/wallet-<timestamp>.json` – Encrypted keystore (safe to commit? NO – add to .gitignore!)

**Security**:
- ✅ Mnemonic never saved to disk (printed to console only)
- ✅ Private key encrypted with your password
- ✅ All crypto done locally (no server)

---

### Command: `npm run cli:import-mnemonic`

**Purpose**: Import an existing mnemonic and encrypt it

**Usage**:
```bash
npm run cli:import-mnemonic -- --mnemonic "abandon ability able ..." --password mysecurepass
```

**Output**:
```
Mnemonic imported and wallet encrypted to: wallets/wallet-1700000000001.json
Address: 0x6D10163ABBB1A8FbF4D9Ca11DA9cCa512bc3A615
```

**What It Does**:
1. Validates your mnemonic (checks it's a valid BIP-39 phrase)
2. Derives the same address you had before
3. Encrypts with your password
4. Saves to `wallets/`

**Use Cases**:
- Restore wallet from backup mnemonic
- Import wallet from another source
- Create multiple keystores from same seed (different passwords)

---

### Command: `npm run cli:send-c`

**Purpose**: Send AVAX on C-Chain using private key (non-interactive)

**Usage**:
```bash
export DEV_PRIVATE_KEY=0xprivatekey...
npm run cli:send-c -- 0xRecipientAddress 0.01
```

**Output**:
```
Sending 0.01 AVAX to 0x6D10163ABBB1A8FbF4D9Ca11DA9cCa512bc3A615
Transaction hash: 0xabc123...
Transaction sent! https://testnet.snowtrace.io/tx/0xabc123...
```

**Requirements**:
- `DEV_PRIVATE_KEY` env var set (your private key in hex format)
- Enough AVAX for amount + gas fee
- Valid recipient address

**Security Note**:
- ⚠️ Never hardcode private key in scripts
- ⚠️ Only use for development/testing
- Use keystore encryption for production

---

### Command: `npm run cli:send-x`

**Purpose**: Send AVAX on X-Chain (UTXO model)

**Usage**:
```bash
export DEV_PRIVATE_KEY=0x...
npm run cli:send-x -- X-fuji1recipient... 1000000
```

**Note**: Requires `avalanche` npm package (installed by default)

**Use Cases**:
- Cross-subnet transfers
- Advanced UTXO management
- Staking preparation

---

## For Developers

### Project Structure

```
my-crypto-wallet/
├── src/
│   ├── cli/                    # Command-line tools
│   │   ├── createWallet.ts    # Generate wallet + mnemonic
│   │   ├── importMnemonic.ts  # Import existing mnemonic
│   │   ├── sendC.ts           # Send on C-Chain
│   │   └── sendX.ts           # Send on X-Chain
│   ├── examples/               # Runnable examples
│   │   ├── sendC.ts           # ethers.js C-Chain example
│   │   └── sendX.ts           # avalanchejs X-Chain example
│   ├── keymanager/
│   │   └── derive.ts          # BIP-39/44 key derivation
│   └── ui/                     # React components
│       ├── App.tsx            # Main app + routing
│       ├── WalletProvider.tsx  # Context + MetaMask
│       ├── Dashboard.tsx       # Connect/balance display
│       ├── SendForm.tsx        # Send transaction form
│       ├── ReceiveView.tsx     # Show address
│       ├── CreateWallet.tsx    # Generate wallet UI
│       ├── SettingsView.tsx    # Settings + CLI reference
│       ├── DebugPanel.tsx      # Provider detection
│       └── App.css             # Styling
├── tests/
│   ├── unit/                   # Unit tests (Jest)
│   │   ├── derive.test.ts
│   │   ├── cli.createWallet.test.ts
│   │   └── ...
│   ├── integration/            # Integration tests (Fuji testnet)
│   │   ├── sendC.integration.test.ts
│   │   └── sendX.integration.test.ts
│   └── __mocks__/              # Mock fs, ethers, etc
├── package.json                # Dependencies + scripts
├── tsconfig.json               # TypeScript config
├── jest.config.js              # Jest config
├── vite.config.ts              # Vite config
└── README.md                   # This file!
```

### Running Tests

**Unit Tests** (fast, no network):
```bash
npm test
```

**Integration Tests** (requires Fuji RPC):
```bash
npm run test:integration
```

**Watch Mode** (auto-rerun on file change):
```bash
npm run test:watch
```

---

### Key Classes & Functions

#### `deriveEvmFromMnemonic(mnemonic, index)`
**Location**: `src/keymanager/derive.ts`

Derives an EVM address from a mnemonic using BIP-44 standard.

**Example**:
```typescript
import { deriveEvmFromMnemonic } from './src/keymanager/derive';

const result = await deriveEvmFromMnemonic(
  'abandon ability able about above absent ...',
  0  // index
);

console.log(result);
// { 
//   path: "m/44'/60'/0'/0/0",
//   priv: "0xprivatekey...",
//   address: "0xaddress..."
// }
```

#### `ethers.Wallet`
**Location**: node_modules/ethers

Standard Ethereum wallet compatible with Avalanche C-Chain.

**Example**:
```typescript
import { Wallet, parseEther } from 'ethers';

const wallet = Wallet.createRandom();
const tx = await wallet.sendTransaction({
  to: '0xrecipient...',
  value: parseEther('0.01'),
});
```

---

### Adding New Features

**Example: Add a "Token Swap" Feature**

1. **Create component**: `src/ui/TokenSwap.tsx`
2. **Add to App.tsx**: Import + add tab
3. **Add tests**: `tests/unit/tokenSwap.test.ts`
4. **Export functions** for testing (avoid default exports mixing UI + logic)

---

## Deployment

### Option 1: Vercel (Easiest, Free)

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com/) → "New Project" → Select repo

3. Framework: **Vite** (auto-detected)

4. Deploy! Your URL: `https://my-crypto-wallet.vercel.app`

### Option 2: Netlify

1. Same Git push
2. Go to [netlify.com](https://netlify.com/) → "New Site from Git"
3. Build: `npm run build` | Publish: `dist`
4. Done!

### Option 3: Self-Hosted (AWS, DigitalOcean)

1. Build locally:
   ```bash
   npm run build
   # Creates dist/ folder
   ```

2. Upload `dist/` to web server (SCP, S3, FTP)

3. Configure HTTPS (Let's Encrypt free)

---

## FAQ & Troubleshooting

### Q: "MetaMask not detected – install extension"

**A:** 
1. Install MetaMask from [metamask.io](https://metamask.io/)
2. Pin it to your toolbar (browser extensions button)
3. Reload the page
4. Wallet should appear

---

### Q: "I sent AVAX but don't see it – where did it go?"

**A:**
- Fuji testnet is slow (5-60 seconds)
- Reload the Dashboard to refresh balance
- Check [SnowTrace Testnet](https://testnet.snowtrace.io/) with your tx hash
- If "failed" → check error message (usually "insufficient funds" or "invalid recipient")

---

### Q: "How do I import my created wallet into MetaMask?"

**A:**
1. Go to "Create Wallet" tab
2. Click "🔑 Generate Mnemonic"
3. Click "Copy private key (for MetaMask import)"
4. MetaMask → Account → "Import Account"
5. Paste key → "Import"

Or restore from seed phrase:
1. MetaMask → Settings → "Security & Privacy"
2. Click "Reveal Recovery Phrase"
3. Type your password, copy your original seed phrase
4. MetaMask → Settings → "Import mnemonic" (if available)

---

### Q: "npm install fails – what do I do?"

**A:**
```bash
# Try legacy peer deps
npm install --legacy-peer-deps

# If still failing, clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

### Q: "How do I run this on my server?"

**A:** See [Deployment](#deployment) section above.

---

### Q: "Can I use this on Mainnet with real money?"

**A:** 
- ✅ Yes, but **only if you understand the risks**
- Use a hardware wallet for real money (Ledger, Trezor)
- Test on Fuji first with small amounts
- Never share private keys
- Double-check addresses before sending

---

## Security

### 🔐 Best Practices

1. **Never commit `.env`** – It's in `.gitignore` already
2. **Never paste mnemonics online** – Write them down offline
3. **Use strong passwords** – 15+ characters, mix upper/lowercase/numbers
4. **Backup your mnemonic** – Store in safe place (safe deposit box?)
5. **Use hardware wallets for real money** – Ledger, Trezor, etc
6. **Verify addresses** – Always double-check recipient address
7. **Test small amounts first** – Verify flow before large transfers

### 🛡️ This Wallet's Security

- ✅ No server – all crypto done in browser
- ✅ No cookies – session lost on refresh
- ✅ No analytics – privacy by default
- ✅ Open source – audit the code
- ⚠️ Browser vulnerabilities – Still a risk (use hardware wallet for large sums)

### 🚨 What This Wallet Is NOT

- ❌ Not a hardware wallet (less secure for real money)
- ❌ Not audited professionally (use for learning/testing)
- ❌ Not insured (if funds stolen, they're gone)
- ❌ Not a bank (no customer support for lost keys)

---

## Support & Community

### Getting Help

1. **For bugs**: Open an issue on [GitHub](https://github.com/Talent-Index/Crypto-Wallet-)
2. **For questions**: Check [FAQ](#faq--troubleshooting) above
3. **For documentation**: Read [SETUP_AND_DEPLOYMENT.md](./SETUP_AND_DEPLOYMENT.md)

### Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open Pull Request

---

## License

MIT – Feel free to use this for learning, testing, or production (at your own risk).

---

## Resources

- 📚 [Avalanche Docs](https://docs.avax.network/)
- 🔗 [ethers.js Docs](https://docs.ethers.org/)
- ⛰️ [Avalanche Faucet](https://faucet.avax.network/)
- 🔍 [SnowTrace (Block Explorer)](https://testnet.snowtrace.io/)
- 🦊 [MetaMask](https://metamask.io/)
- 🛠️ [BuilderKit](https://build.avax.network/docs/builderkit)

---

**Happy building! 🚀 Have questions? Open an issue on GitHub!**
