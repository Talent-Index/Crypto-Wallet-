import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CryptoWallet {
    constructor() {
        this.wallet = null;
        this.walletData = null;
        this.storagePath = path.join(__dirname, 'wallets');
        
        // Ensure storage directory exists
        if (!fs.existsSync(this.storagePath)) {
            fs.mkdirSync(this.storagePath, { recursive: true });
        }
    }

    // Generate a new seed phrase
    generateSeedPhrase() {
        try {
            const wallet = ethers.Wallet.createRandom();
            return {
                mnemonic: wallet.mnemonic.phrase,
                address: wallet.address
            };
        } catch (error) {
            throw new Error(`Failed to generate seed phrase: ${error.message}`);
        }
    }

    // Derive private/public keys from mnemonic
    deriveKeysFromMnemonic(mnemonic, index = 0) {
        try {
            // Validate mnemonic
            if (!ethers.Mnemonic.isValidMnemonic(mnemonic)) {
                throw new Error('Invalid mnemonic phrase');
            }

            // Derive wallet from mnemonic
            const wallet = ethers.HDNodeWallet.fromPhrase(
                mnemonic.trim(),
                undefined,
                `m/44'/60'/0'/0/${index}`
            );

            return {
                privateKey: wallet.privateKey,
                publicKey: wallet.publicKey,
                address: wallet.address,
                mnemonic: mnemonic
            };
        } catch (error) {
            throw new Error(`Failed to derive keys: ${error.message}`);
        }
    }

    // Create Ethereum address from public key
    createEthereumAddress(publicKey) {
        try {
            // Remove '0x' prefix if present and ensure it's uncompressed
            let pubKey = publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey;
            
            // If it's a compressed public key (starts with 02 or 03), we need to decompress it
            // For simplicity, we'll use ethers to handle this
            const address = ethers.computeAddress('0x' + pubKey);
            return address;
        } catch (error) {
            throw new Error(`Failed to create Ethereum address: ${error.message}`);
        }
    }

    // Store wallet locally
    storeWallet(walletData, password, filename = null) {
        try {
            if (!walletData || !password) {
                throw new Error('Wallet data and password are required');
            }

            const walletName = filename || `wallet_${Date.now()}.json`;
            const filePath = path.join(this.storagePath, walletName);

            // Simple encryption (in production, use more secure methods)
            const encryptedData = this.simpleEncrypt(JSON.stringify(walletData), password);
            
            fs.writeFileSync(filePath, encryptedData);
            
            return {
                filename: walletName,
                path: filePath,
                address: walletData.address
            };
        } catch (error) {
            throw new Error(`Failed to store wallet: ${error.message}`);
        }
    }

    // Load wallet from local storage
    loadWallet(filename, password) {
        try {
            const filePath = path.join(this.storagePath, filename);
            
            if (!fs.existsSync(filePath)) {
                throw new Error('Wallet file not found');
            }

            const encryptedData = fs.readFileSync(filePath, 'utf8');
            const decryptedData = this.simpleDecrypt(encryptedData, password);
            
            this.walletData = JSON.parse(decryptedData);
            this.wallet = new ethers.Wallet(this.walletData.privateKey);
            
            return this.walletData;
        } catch (error) {
            throw new Error(`Failed to load wallet: ${error.message}`);
        }
    }

    // Restore wallet using mnemonic
    restoreWalletFromMnemonic(mnemonic, password, index = 0) {
        try {
            const walletData = this.deriveKeysFromMnemonic(mnemonic, index);
            this.walletData = walletData;
            this.wallet = new ethers.Wallet(walletData.privateKey);
            
            // Store the restored wallet
            const storageInfo = this.storeWallet(walletData, password);
            
            return {
                ...walletData,
                storage: storageInfo
            };
        } catch (error) {
            throw new Error(`Failed to restore wallet: ${error.message}`);
        }
    }

    // Send transaction using ethers.js
    async sendTransaction(transaction, providerUrl = null) {
        try {
            if (!this.wallet) {
                throw new Error('No wallet loaded. Please load or create a wallet first.');
            }

            // Connect to provider
            let provider;
            if (providerUrl) {
                provider = new ethers.JsonRpcProvider(providerUrl);
            } else {
                // Use default provider (for mainnet)
                provider = ethers.getDefaultProvider();
            }

            const connectedWallet = this.wallet.connect(provider);

            // Estimate gas (optional but recommended)
            const gasEstimate = await connectedWallet.estimateGas(transaction);
            
            // Send transaction
            const tx = await connectedWallet.sendTransaction({
                ...transaction,
                gasLimit: gasEstimate
            });

            // Wait for transaction to be mined
            const receipt = await tx.wait();
            
            return {
                transactionHash: tx.hash,
                blockNumber: receipt.blockNumber,
                status: receipt.status === 1 ? 'success' : 'failed',
                gasUsed: receipt.gasUsed.toString()
            };
        } catch (error) {
            throw new Error(`Failed to send transaction: ${error.message}`);
        }
    }

    // Get wallet balance
    async getBalance(providerUrl = null) {
        try {
            if (!this.wallet) {
                throw new Error('No wallet loaded');
            }

            let provider;
            if (providerUrl) {
                provider = new ethers.JsonRpcProvider(providerUrl);
            } else {
                provider = ethers.getDefaultProvider();
            }

            const balance = await provider.getBalance(this.wallet.address);
            return ethers.formatEther(balance);
        } catch (error) {
            throw new Error(`Failed to get balance: ${error.message}`);
        }
    }

    // List all stored wallets
    listStoredWallets() {
        try {
            if (!fs.existsSync(this.storagePath)) {
                return [];
            }

            const files = fs.readdirSync(this.storagePath);
            return files.filter(file => file.endsWith('.json'));
        } catch (error) {
            throw new Error(`Failed to list wallets: ${error.message}`);
        }
    }

    // Simple encryption (for demonstration - use more secure methods in production)
    simpleEncrypt(data, password) {
        // This is a basic example. In production, use proper encryption like AES
        return Buffer.from(data).toString('base64') + ':' + Buffer.from(password).toString('base64');
    }

    simpleDecrypt(encryptedData, password) {
        try {
            const parts = encryptedData.split(':');
            if (parts.length !== 2) {
                throw new Error('Invalid encrypted data format');
            }

            const data = Buffer.from(parts[0], 'base64').toString();
            const storedPassword = Buffer.from(parts[1], 'base64').toString();

            if (storedPassword !== password) {
                throw new Error('Incorrect password');
            }

            return data;
        } catch (error) {
            throw new Error('Decryption failed');
        }
    }

    // Get current wallet info
    getWalletInfo() {
        if (!this.walletData) {
            return null;
        }

        return {
            address: this.walletData.address,
            publicKey: this.walletData.publicKey,
            // Never expose private key in production without proper security
            hasPrivateKey: !!this.walletData.privateKey
        };
    }
}