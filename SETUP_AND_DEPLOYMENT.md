# Setup & Deployment Guide

This guide covers how to set up the Avalanche Wallet project for your team and deploy it to production.

---

## Table of Contents

1. [For Team Members: Local Setup](#for-team-members-local-setup)
2. [Testing Receive Functionality](#testing-receive-functionality)
3. [Deployment Options](#deployment-options)
4. [Environment Configuration](#environment-configuration)
5. [Troubleshooting](#troubleshooting)

---

## For Team Members: Local Setup

### Prerequisites
- **Node.js** (v16+) — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)
- **MetaMask** extension (for web testing) — [Download](https://metamask.io/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_ORG/my-crypto-wallet.git
cd my-crypto-wallet
```

*(Replace `YOUR_GITHUB_ORG` with your actual GitHub organization/username.)*

### Step 2: Install Dependencies

```bash
npm install
# If you encounter peer dependency warnings, use:
npm install --legacy-peer-deps
```

This installs:
- React & Vite (UI framework)
- ethers.js & avalanche-js (blockchain libraries)
- Jest & ts-jest (testing)
- TypeScript (type safety)

### Step 3: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Fuji Testnet (default for testing)
VITE_RPC_URL_FUJI=https://api.avax-test.network/ext/bc/C/rpc
VITE_RPC_URL_MAINNET=https://api.avax.network/ext/bc/C/rpc

# For CLI wallet creation & sending (dev only)
CLI_PASSWORD=your-secure-password-here
DEV_PRIVATE_KEY=0x...  # Only for testing; never commit this

# Optional: X-Chain testing
TEST_X_RECIPIENT=X-fuji1...
```

**Important**: Never commit `.env` to Git. It's already in `.gitignore`.

### Step 4: Start the Development Server

```bash
npm run dev
```

Output:
```
  VITE v7.2.4  ready in 396 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open **http://localhost:5173/** in your browser. You should see:
- Navigation tabs: Dashboard | Send | Receive | Create Wallet | Settings
- A "Connect MetaMask / Web3 Wallet" button on Dashboard

### Step 5: Verify Setup

1. **MetaMask Connection**
   - Click "Connect MetaMask / Web3 Wallet"
   - Accept the permission popup
   - You should see your address and balance on the Dashboard

2. **Create a Test Wallet**
   - Go to "Create Wallet" tab
   - Click "🔑 Generate Mnemonic"
   - View your address and seed phrase (store securely)

3. **Send a Test Transaction** (if you have Fuji testnet AVAX)
   - Go to "Send" tab
   - Paste a recipient address
   - Enter 0.01 AVAX
   - Click "Send"
   - MetaMask will show a signing popup
   - Confirm to submit transaction

---

## Testing Receive Functionality

The "Receive" tab shows your connected wallet address. To test receiving funds:

### Option 1: Send from Another Wallet

1. **Team Member A** (receiver):
   - Open http://localhost:5173/
   - Go to Dashboard → Connect MetaMask
   - Go to Receive tab → Note your address

2. **Team Member B** (sender):
   - Use their own wallet to send AVAX to Team Member A's address
   - Or use Avalanche Faucet (see below)

### Option 2: Use Avalanche Faucet (Free Fuji AVAX)

1. Visit **[Avalanche Faucet](https://faucet.avax.network/)** (Fuji Testnet)
2. Paste your address from the "Receive" tab
3. Request 10 AVAX (once per 24 hours)
4. Check Dashboard for updated balance (may take 30 seconds)

### Option 3: Use CLI to Send Between Team Members

```bash
# Get Fuji testnet AVAX from faucet first, then:
export DEV_PRIVATE_KEY=0x<your-private-key>
export VITE_RPC_URL_FUJI=https://api.avax-test.network/ext/bc/C/rpc

npm run cli:send-c -- <recipient-address> 0.01
# Example:
npm run cli:send-c -- 0x6D10163ABBB1A8FbF4D9Ca11DA9cCa512bc3A615 0.01
```

### Testing Checklist

- [ ] All team members can clone & install
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] MetaMask connection works on Dashboard
- [ ] Create Wallet generates valid address
- [ ] Send form accepts recipient and amount
- [ ] Receive tab displays address correctly
- [ ] Each member receives from faucet successfully
- [ ] Transaction appears on [SnowTrace](https://testnet.snowtrace.io/)

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Pros**: Zero-config, automatic HTTPS, global CDN, free tier, instant rollbacks

**Steps**:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com/)
   - Sign up with GitHub
   - Click "New Project"
   - Select the `my-crypto-wallet` repository
   - Click "Import"

3. **Configure Build Settings**:
   - Framework: **Vite** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Add any secrets (e.g., API keys)

4. **Deploy**:
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Your URL will be: `https://my-crypto-wallet.vercel.app` (or custom domain)

**Post-Deployment**:
- Test wallet connection at your Vercel URL
- MetaMask will recognize the domain and grant permissions
- Share the link with your team

---

### Option 2: Netlify

**Pros**: Similar to Vercel, good free tier, CMS integration available

**Steps**:

1. **Push to GitHub** (same as above)

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com/)
   - Sign up with GitHub
   - Click "New Site from Git"
   - Select the repository

3. **Configure**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Add Environment Variables in Netlify dashboard

4. **Deploy**:
   - Netlify builds and deploys
   - Your URL: `https://my-crypto-wallet.netlify.app` (or custom domain)

---

### Option 3: GitHub Pages (Free, Static)

**Pros**: Free, built-in to GitHub, no additional account needed

**Cons**: Requires a slight config change

**Steps**:

1. **Update `vite.config.ts`**:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/my-crypto-wallet/',  // Add this line
   })
   ```

2. **Add GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install --legacy-peer-deps
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Push & Enable Pages**:
   - Commit and push to `main`
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Branch: `gh-pages`
   - Your URL: `https://YOUR_USERNAME.github.io/my-crypto-wallet/`

---

### Option 4: Self-Hosted (AWS, DigitalOcean, etc.)

**Pros**: Full control, custom domain easy, can run backend services

**Cons**: Costs $, requires DevOps knowledge

**Basic Steps**:

1. **Build the project**:
   ```bash
   npm run build
   # Output in ./dist/
   ```

2. **Upload `dist/` folder** to your server (via SCP, S3, FTP, etc.)

3. **Configure web server** (Nginx/Apache) to serve `dist/` and redirect to `index.html`:
   ```nginx
   # nginx.conf example
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

4. **Enable HTTPS** (Let's Encrypt, CloudFlare, etc.)

**Example with DigitalOcean App Platform**:
- Create App → Connect GitHub repo
- Build Command: `npm install --legacy-peer-deps && npm run build`
- Output Dir: `dist`
- Deploy (auto-HTTPS included)

---

## Environment Configuration

### For Local Development

Create `.env.local`:

```env
# Optional: Override defaults for testing
VITE_RPC_URL_FUJI=https://api.avax-test.network/ext/bc/C/rpc
VITE_RPC_URL_MAINNET=https://api.avax.network/ext/bc/C/rpc

# For CLI testing only (never commit)
CLI_PASSWORD=test-password-only
DEV_PRIVATE_KEY=0x...
```

### For Production (Vercel/Netlify)

1. Go to your deployment dashboard (Vercel/Netlify Settings)
2. Add Environment Variables:
   - `VITE_RPC_URL_FUJI` (optional; defaults to public Fuji RPC)
   - Any API keys or secrets (these are NOT exposed to client-side in Vite unless prefixed with `VITE_`)

**Note**: Because this is a client-side React app, all `VITE_*` variables are embedded in the bundle and visible to users. Do NOT put sensitive API keys or private keys here.

---

## Troubleshooting

### Issue: `npm install` fails with peer dependency errors

**Solution**:
```bash
npm install --legacy-peer-deps
```

---

### Issue: MetaMask connection fails with "No Web3 provider detected"

**Solution**:
1. Ensure MetaMask extension is installed and enabled
2. Reload the page (Ctrl+R)
3. Check MetaMask is connected to **Fuji Testnet** (or Mainnet)
   - MetaMask → Network selector → Select Avalanche C-Chain

---

### Issue: Send transaction fails with "No signer available"

**Solution**:
1. Disconnect MetaMask (Dashboard → Disconnect)
2. Reload page
3. Reconnect wallet
4. Try sending again

---

### Issue: "Transaction failed" or "Insufficient funds"

**Solution**:
1. You need Fuji testnet AVAX (get from faucet: https://faucet.avax.network/)
2. Allow 30-60 seconds for the faucet transfer to arrive
3. Reload Dashboard to see updated balance

---

### Issue: Deploy to Vercel/Netlify fails with build errors

**Solution**:
1. Check build logs in deployment dashboard
2. Ensure Node version is 16+
3. Ensure `npm run build` works locally first:
   ```bash
   npm run build
   # Should create ./dist/ without errors
   ```

---

## Next Steps

1. **For Team Testing**:
   - Each member clones & runs locally
   - All connect to Fuji Testnet via MetaMask
   - Test sending AVAX between addresses
   - Verify Receive tab shows correct address

2. **For Production Deployment**:
   - Choose a deployment platform (Vercel recommended)
   - Push code to GitHub
   - Connect repo to deployment service
   - Share public URL with users

3. **Security Checklist Before Production**:
   - [ ] No `.env` file committed to Git
   - [ ] `.gitignore` includes `.env*`
   - [ ] No private keys in code
   - [ ] Use MetaMask for key management (user's responsibility)
   - [ ] HTTPS enabled on deployed site
   - [ ] Review wallet security practices in docs

---

## Support

For issues or questions:
- Check browser console for errors (F12 → Console)
- Run `npm run test` to verify local setup
- Open an issue on GitHub with:
  - Error message / screenshot
  - Steps to reproduce
  - Node version (`node -v`)
  - Browser + extension versions

---

**Happy testing! 🚀**
