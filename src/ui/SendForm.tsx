import React, { useState } from 'react';
import { useWallet } from './WalletProvider';

export function SendForm() {
  const { sendTransaction, isConnected, hasProvider, lastError } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) {
      setStatus('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setStatus('Sending transaction...');
      const hash = await sendTransaction(recipient, amount);
      setTxHash(hash);
      setStatus('✓ Transaction sent!');
      setRecipient('');
      setAmount('');
      
      // Link to explorer
      const explorerUrl = `https://testnet.snowtrace.io/tx/${hash}`;
      console.log('View on explorer:', explorerUrl);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="send-form">
        <p>Connect your wallet first to send transactions</p>
        {!hasProvider && <p className="error">No Web3 provider detected — install MetaMask.</p>}
        {lastError && <p className="error">{lastError}</p>}
      </div>
    );
  }

  return (
    <div className="send-form">
      <h2>Send AVAX (C-Chain)</h2>
      <form onSubmit={handleSend}>
        <div className="form-group">
          <label htmlFor="recipient">Recipient Address</label>
          <input
            id="recipient"
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (AVAX)</label>
          <input
            id="amount"
            type="number"
            placeholder="0.1"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {status && (
        <div className={`status ${status.includes('Error') ? 'error' : 'success'}`}>
          {status}
        </div>
      )}

      {txHash && (
        <div className="tx-link">
          <p>Transaction Hash:</p>
          <code>{txHash}</code>
          <a href={`https://testnet.snowtrace.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
            View on Explorer
          </a>
        </div>
      )}
    </div>
  );
}
