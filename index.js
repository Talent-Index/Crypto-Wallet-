import { CryptoWallet } from './wallet.js';
import readline from 'readline';

class WalletCLI {
    constructor() {
        this.wallet = new CryptoWallet();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }

    async mainMenu() {
        console.log('\n=== Crypto Wallet Manager ===');
        console.log('1. Create new wallet');
        console.log('2. Restore wallet from mnemonic');
        console.log('3. Load existing wallet');
        console.log('4. List stored wallets');
        console.log('5. Send transaction');
        console.log('6. Check balance');
        console.log('7. Exit');

        const choice = await this.question('\nChoose an option: ');

        switch (choice) {
            case '1':
                await this.createNewWallet();
                break;
            case '2':
                await this.restoreWallet();
                break;
            case '3':
                await this.loadWallet();
                break;
            case '4':
                await this.listWallets();
                break;
            case '5':
                await this.sendTransaction();
                break;
            case '6':
                await this.checkBalance();
                break;
            case '7':
                this.rl.close();
                return;
            default:
                console.log('Invalid option');
        }

        await this.mainMenu();
    }

    async createNewWallet() {
        try {
            console.log('\n--- Creating New Wallet ---');
            
            const password = await this.question('Set a password for wallet encryption: ');
            const confirmPassword = await this.question('Confirm password: ');

            if (password !== confirmPassword) {
                console.log('Passwords do not match!');
                return;
            }

            const { mnemonic, address } = this.wallet.generateSeedPhrase();
            
            console.log('\n⚠️  IMPORTANT: Save your seed phrase in a secure location!');
            console.log('Seed Phrase:', mnemonic);
            console.log('Address:', address);
            
            const walletData = this.wallet.deriveKeysFromMnemonic(mnemonic);
            const storageInfo = this.wallet.storeWallet(walletData, password);

            console.log('\n✅ Wallet created and stored successfully!');
            console.log('Storage file:', storageInfo.filename);

        } catch (error) {
            console.error('Error creating wallet:', error.message);
        }
    }

    async restoreWallet() {
        try {
            console.log('\n--- Restore Wallet from Mnemonic ---');
            
            const mnemonic = await this.question('Enter your seed phrase: ');
            const password = await this.question('Set a password for wallet encryption: ');
            const index = await this.question('Enter derivation index (default 0): ') || '0';

            const walletData = await this.wallet.restoreWalletFromMnemonic(
                mnemonic, 
                password, 
                parseInt(index)
            );

            console.log('\n✅ Wallet restored successfully!');
            console.log('Address:', walletData.address);
            console.log('Storage file:', walletData.storage.filename);

        } catch (error) {
            console.error('Error restoring wallet:', error.message);
        }
    }

    async loadWallet() {
        try {
            console.log('\n--- Load Existing Wallet ---');
            
            const wallets = this.wallet.listStoredWallets();
            if (wallets.length === 0) {
                console.log('No stored wallets found.');
                return;
            }

            console.log('Stored wallets:');
            wallets.forEach((wallet, index) => {
                console.log(`${index + 1}. ${wallet}`);
            });

            const choice = await this.question('\nSelect wallet (number): ');
            const filename = wallets[parseInt(choice) - 1];
            
            if (!filename) {
                console.log('Invalid selection');
                return;
            }

            const password = await this.question('Enter password: ');
            const walletData = this.wallet.loadWallet(filename, password);

            console.log('\n✅ Wallet loaded successfully!');
            console.log('Address:', walletData.address);

        } catch (error) {
            console.error('Error loading wallet:', error.message);
        }
    }

    async listWallets() {
        try {
            console.log('\n--- Stored Wallets ---');
            
            const wallets = this.wallet.listStoredWallets();
            if (wallets.length === 0) {
                console.log('No wallets found.');
                return;
            }

            wallets.forEach((wallet, index) => {
                console.log(`${index + 1}. ${wallet}`);
            });

        } catch (error) {
            console.error('Error listing wallets:', error.message);
        }
    }

    async sendTransaction() {
        try {
            console.log('\n--- Send Transaction ---');
            
            const walletInfo = this.wallet.getWalletInfo();
            if (!walletInfo) {
                console.log('Please load a wallet first.');
                return;
            }

            const toAddress = await this.question('Recipient address: ');
            const amount = await this.question('Amount (ETH): ');
            const providerUrl = await this.question('Provider URL (optional, press enter for default): ') || null;

            console.log('Sending transaction...');

            const result = await this.wallet.sendTransaction({
                to: toAddress,
                value: ethers.parseEther(amount)
            }, providerUrl);

            console.log('\n✅ Transaction sent successfully!');
            console.log('Transaction Hash:', result.transactionHash);
            console.log('Block Number:', result.blockNumber);
            console.log('Status:', result.status);

        } catch (error) {
            console.error('Error sending transaction:', error.message);
        }
    }

    async checkBalance() {
        try {
            console.log('\n--- Check Balance ---');
            
            const walletInfo = this.wallet.getWalletInfo();
            if (!walletInfo) {
                console.log('Please load a wallet first.');
                return;
            }

            const providerUrl = await this.question('Provider URL (optional, press enter for default): ') || null;
            
            console.log('Checking balance...');
            const balance = await this.wallet.getBalance(providerUrl);

            console.log(`\nBalance: ${balance} ETH`);
            console.log('Address:', walletInfo.address);

        } catch (error) {
            console.error('Error checking balance:', error.message);
        }
    }

    start() {
        console.log('🚀 Crypto Wallet Application Started');
        this.mainMenu().catch(console.error);
    }
}

// Start the application
const cli = new WalletCLI();

cli.start();
