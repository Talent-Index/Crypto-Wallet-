import React, { useState } from 'react';
import { useWallet } from './WalletProvider';

export function Dashboard() {
  const { address, balance, isConnected, connectWallet, disconnectWallet, hasProvider, lastError } = useWallet();
  const [forceResult, setForceResult] = useState<string | null>(null);
  const [forceError, setForceError] = useState<string | null>(null);
  const [isForcing, setIsForcing] = useState(false);

  const handleForceConnect = async () => {
    setForceResult(null);
    setForceError(null);
    setIsForcing(true);
    try {
      const eth = (window as any).ethereum;
      if (!eth) throw new Error('No window.ethereum provider');
      const res: string[] = await eth.request({ method: 'eth_requestAccounts' });
      setForceResult(JSON.stringify(res));
      // If accounts returned, call the normal connect flow to initialize provider/signers
      if (res && res.length) {
        await connectWallet();
      }
    } catch (e: any) {
      setForceError(e?.message || String(e));
    } finally {
      setIsForcing(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Avalanche Wallet Dashboard</h1>
      
      {isConnected ? (
        <div className="connected-state">
          <div className="address-display">
            <p>Connected Address:</p>
            <code>{address}</code>
          </div>
          
          <div className="balance-display">
            <p>C-Chain Balance (AVAX):</p>
            <h2>{balance || 'Loading...'}</h2>
          </div>

          <button onClick={disconnectWallet} className="btn btn-danger">
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="disconnected-state">
          <p>Connect your Web3 wallet to get started</p>
          {!hasProvider && (
            <p className="error">No Web3 provider detected. Install MetaMask or another Web3 wallet extension.</p>
          )}
          {lastError && <p className="error">{lastError}</p>}
          <button onClick={connectWallet} className="btn btn-primary">
            Connect MetaMask / Web3 Wallet
          </button>

          <div className="debug-inline" style={{ marginTop: 12 }}>
            <button onClick={handleForceConnect} className="btn btn-secondary" disabled={isForcing}>
              {isForcing ? 'Opening...' : 'Force Connect (popup)'}
            </button>
            {forceResult && (
              <div className="debug-result">
                <p>Force result: <code>{forceResult}</code></p>
              </div>
            )}
            {forceError && (
              <div className="debug-error">
                <p className="error">Force error: {forceError}</p>
              </div>
            )}
          </div>
          <p className="note">Or use the CLI for non-web3 operations: npm run cli:send-c</p>
        </div>
      )}
    </div>
  );
}
