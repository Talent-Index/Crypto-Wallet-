import React, { useState } from 'react';

export function DebugPanel() {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [isMetaMask, setIsMetaMask] = useState<boolean | null>(null);
  const [accounts, setAccounts] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detect = () => {
    try {
      const eth = (window as any).ethereum;
      setHasProvider(!!eth);
      setIsMetaMask(eth ? !!eth.isMetaMask : null);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  };

  const requestAccounts = async () => {
    try {
      setError(null);
      const eth = (window as any).ethereum;
      if (!eth) throw new Error('No window.ethereum found');
      const accs: string[] = await eth.request({ method: 'eth_requestAccounts' });
      setAccounts(accs);
    } catch (e) {
      setError((e as Error).message || String(e));
    }
  };

  return (
    <div className="debug-panel">
      <h4>Debug Panel</h4>
      <div className="debug-row">
        <button onClick={detect} className="btn btn-secondary">Detect Provider</button>
        <button onClick={requestAccounts} className="btn btn-secondary">Request Accounts</button>
      </div>

      <div className="debug-info">
        <p>Has Provider: {String(hasProvider)}</p>
        <p>isMetaMask: {String(isMetaMask)}</p>
        <p>Accounts: {accounts ? accounts.join(', ') : '—'}</p>
        {error && <p className="error">Error: {error}</p>}
      </div>
    </div>
  );
}
