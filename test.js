import { CryptoWallet } from './wallet.js';

async function testWallet() {
    console.log('🧪 Testing Crypto Wallet Implementation\n');

    const wallet = new CryptoWallet();

    try {
        // Test 1: Generate seed phrase
        console.log('1. Testing seed phrase generation...');
        const { mnemonic, address } = wallet.generateSeedPhrase();
        console.log('✅ Seed phrase generated');
        console.log('   Mnemonic:', mnemonic);
        console.log('   Address:', address);

        // Test 2: Derive keys
        console.log('\n2. Testing key derivation...');
        const keys = wallet.deriveKeysFromMnemonic(mnemonic);
        console.log('✅ Keys derived successfully');
        console.log('   Private Key:', keys.privateKey.substring(0, 20) + '...');
        console.log('   Public Key:', keys.publicKey.substring(0, 20) + '...');
        console.log('   Address:', keys.address);

        // Test 3: Create Ethereum address from public key
        console.log('\n3. Testing address creation from public key...');
        const createdAddress = wallet.createEthereumAddress(keys.publicKey);
        console.log('✅ Address created from public key');
        console.log('   Original Address:', keys.address);
        console.log('   Created Address:', createdAddress);
        console.log('   Match:', keys.address === createdAddress);

        // Test 4: Store wallet
        console.log('\n4. Testing wallet storage...');
        const storageInfo = wallet.storeWallet(keys, 'testpassword123');
        console.log('✅ Wallet stored successfully');
        console.log('   File:', storageInfo.filename);

        // Test 5: Load wallet
        console.log('\n5. Testing wallet loading...');
        const loadedWallet = wallet.loadWallet(storageInfo.filename, 'testpassword123');
        console.log('✅ Wallet loaded successfully');
        console.log('   Address:', loadedWallet.address);

        // Test 6: Restore from mnemonic
        console.log('\n6. Testing wallet restoration...');
        const restoredWallet = wallet.restoreWalletFromMnemonic(mnemonic, 'newpassword123');
        console.log('✅ Wallet restored successfully');
        console.log('   Address:', restoredWallet.address);

        // Test 7: List stored wallets
        console.log('\n7. Testing wallet listing...');
        const wallets = wallet.listStoredWallets();
        console.log('✅ Wallets listed successfully');
        console.log('   Found wallets:', wallets.length);

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testWallet();