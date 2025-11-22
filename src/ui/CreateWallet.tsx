import React, { useState } from 'react';
import { ethers } from 'ethers';

export function CreateWallet() {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [privKey, setPrivKey] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    setIsGenerating(true);
    setStatus(null);
    try {
      const w = ethers.Wallet.createRandom();
      const m = (w as any).mnemonic?.phrase || null;
      setMnemonic(m);
      setAddress(w.address);
      setPrivKey(w.privateKey);
      setRevealed(false);
    } catch (e: any) {
      setStatus(`Generate error: ${e?.message || String(e)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyMnemonic = async () => {
    if (!mnemonic) return;
    await navigator.clipboard.writeText(mnemonic);
    setStatus('Mnemonic copied to clipboard (dangerous — copy only to a safe place)');
  };

  const copyPrivateKey = async () => {
    if (!privKey) return setStatus('No private key available. Generate a mnemonic first.');
    const ok = window.confirm('Expose private key to clipboard? This is extremely sensitive. Only do this in a secure environment. Continue?');
    if (!ok) return;
    try {
      await navigator.clipboard.writeText(privKey.replace(/^0x/, ''));
      setStatus('Private key copied to clipboard. Use MetaMask Import Account → Private Key.');
    } catch (e: any) {
      setStatus(`Clipboard error: ${e?.message || String(e)}`);
    }
  };

  const downloadKeystore = async () => {
    if (!mnemonic) return setStatus('Generate mnemonic first');
    if (!password || password.length < 8) return setStatus('Password must be at least 8 characters');

    try {
      setStatus('Encrypting keystore...');
      const w = new ethers.Wallet(privKey || '');
      const json = await w.encrypt(password);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallet-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus('Keystore prepared for download. Store it securely.');
    } catch (e: any) {
      setStatus(`Encryption error: ${e?.message || String(e)}`);
    }
  };

  return (
    <div className="create-wallet">
      <h1>Create Wallet</h1>

      <p><strong>Generate a new Avalanche C-Chain wallet</strong> with a 24-word seed phrase (mnemonic) and private key. You can then import it into MetaMask or encrypt it for offline storage.</p>

      <div className="info-box">
        <p><strong>What happens:</strong></p>
        <ul>
          <li>Generate a random 24-word mnemonic (seed phrase).</li>
          <li>Derive your Avalanche C-Chain address and private key from the mnemonic.</li>
          <li>Optionally encrypt with a password and download a keystore file.</li>
          <li>Import the wallet into MetaMask or use the private key directly.</li>
        </ul>
      </div>

      <p className="warning"><strong>⚠️ Security Warning:</strong> Browser-generated wallets are convenient for testing. For real funds, use a hardware wallet (e.g., Ledger, Trezor). Never share your mnemonic or private key.</p>

      <div className="controls">
        <button className="btn btn-primary" onClick={generate} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : '🔑 Generate Mnemonic'}
        </button>
      </div>

      {mnemonic && (
        <div className="mnemonic-block">
          <div className="section">
            <h3>Your Wallet Address</h3>
            <p className="note">Use this address to receive funds on Avalanche C-Chain:</p>
            <div className="address-display">
              <code>{address}</code>
              <button className="btn btn-small" onClick={() => { navigator.clipboard.writeText(address || ''); setStatus('Address copied to clipboard'); }}>Copy</button>
            </div>
          </div>

          <div className="section">
            <h3>Seed Phrase (Mnemonic)</h3>
            <p className="note">Your 24-word seed phrase. NEVER share this with anyone. Anyone with this phrase can access your funds.</p>
            <div className="mnemonic-display">
              {revealed ? (
                <div className="mnemonic-revealed">
                  <code>{mnemonic}</code>
                </div>
              ) : (
                <div className="mnemonic-hidden">
                  <code>•••• •••• •••• •••• •••• •••• •••• ••••</code>
                </div>
              )}
            </div>

            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => setRevealed(!revealed)}>
                {revealed ? '👁️ Hide' : '👁️ Reveal'} Seed Phrase
              </button>
              <button className="btn btn-secondary" onClick={copyMnemonic}>
                📋 Copy Seed Phrase
              </button>
            </div>
          </div>

          <div className="section">
            <h3>Private Key (Advanced)</h3>
            <p className="note">Your private key controls access to your funds. Only use this for testing or if you understand the risks.</p>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-danger" onClick={copyPrivateKey}>
                🔑 Copy Private Key (for MetaMask Import)
              </button>
            </div>
          </div>

          <div className="section">
            <h3>Encrypt & Backup</h3>
            <p className="note">Optional: Encrypt your private key with a password and download a keystore file for offline storage.</p>
            <input 
              type="password" 
              placeholder="Enter password (min 8 characters)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ marginTop: 8 }}
            />
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" onClick={downloadKeystore}>
                💾 Encrypt & Download Keystore
              </button>
            </div>
          </div>
        </div>
      )}

      {status && <p className="status">{status}</p>}
    </div>
  );
}
