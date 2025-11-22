# React UI for Avalanche Wallet

## Overview

This React UI provides a user-friendly interface to interact with the Avalanche wallet backend. It uses BuilderKit components (references) and ethers.js for blockchain interactions.

## Features

- **Dashboard**: Connect wallet, display balance and address
- **Send**: Send AVAX on C-Chain with transaction confirmation
- **Receive**: Display your address with copy and QR placeholder
- **Settings**: Network selection, CLI reference, about info

## To Run the UI

### Option 1: Using Vite (recommended for development)

1. Install dependencies:
```bash
npm install
```

2. Add Vite config (see vite.config.ts below)

3. Start dev server:
```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser

### Option 2: Using Create React App

```bash
npx create-react-app . --template typescript
```

## File Structure

```
src/ui/
  ├── App.tsx              # Main app component with tab navigation
  ├── App.css              # Global styles
  ├── WalletProvider.tsx   # React context for wallet state
  ├── Dashboard.tsx        # Balance and wallet connection UI
  ├── SendForm.tsx         # Send transaction form
  ├── ReceiveView.tsx      # Receive address display
  ├── SettingsView.tsx     # Settings and CLI reference
  ├── index.tsx            # React DOM render
  └── ...[other components]
```

## Wallet Connection

The UI uses `window.ethereum` (MetaMask/Web3) for wallet connection. If no Web3 wallet is detected, users are directed to use CLI commands.

For non-web3 operations, use the backend CLI:
```bash
npm run cli:send-c -- <address> <amount>
npm run cli:create-wallet -- --password <pass>
```

## BuilderKit References

- Components: https://build.avax.network/docs/builderkit#ready-to-use-components
- Hooks: https://build.avax.network/docs/builderkit#powerful-hooks

Future enhancements:
- Integrate BuilderKit token components for ERC-20 display
- Use BuilderKit transaction status component
- Add hardware wallet adapter (Ledger) via BuilderKit

## Environment Variables

Create `.env.local` for Vite:
```
VITE_RPC_URL_FUJI=https://api.avax-test.network/ext/bc/C/rpc
VITE_RPC_URL_MAINNET=https://api.avax.network/ext/bc/C/rpc
```

## Security Notes

- Private keys are never stored in the UI; they remain in the backend CLI
- Web3 wallet connection uses MetaMask's secure signing
- For production, integrate with KMS or hardware wallets
- Always use HTTPS in production
