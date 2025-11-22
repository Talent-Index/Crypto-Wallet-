import React, { useState } from 'react';
import { DebugPanel } from './DebugPanel';

export function SettingsView() {
  const [network, setNetwork] = useState<'fuji' | 'mainnet'>('fuji');

  return (
    <div className="settings-view">
      <h2>Settings</h2>

      <div className="setting-group">
        <label>Network</label>
        <select value={network} onChange={(e) => setNetwork(e.target.value as any)}>
          <option value="fuji">Fuji Testnet</option>
          <option value="mainnet">Avalanche Mainnet</option>
        </select>
        <p className="note">
          ⚠️ Mainnet uses real funds. Be careful when sending transactions.
        </p>
      </div>

      <div className="setting-group">
        <h3>CLI Commands Reference</h3>
        <p>Use these commands for advanced operations:</p>
        <code className="code-block">
          npm run cli:create-wallet -- --password yourpass
        </code>
        <code className="code-block">
          npm run cli:send-c -- &lt;address&gt; &lt;amount&gt;
        </code>
        <code className="code-block">
          npm run cli:import-mnemonic -- --mnemonic "..." --password pass
        </code>
      </div>

      <div className="setting-group">
        <h3>About</h3>
        <p>
          Avalanche Crypto Wallet v0.1.0
        </p>
        <p>
          Built with ethers.js, avalanche-js, and React
        </p>
      </div>

      <div className="setting-group">
        <h3>Debug</h3>
        <p>Quick checks to diagnose wallet/provider connectivity from the browser.</p>
        <DebugPanel />
      </div>
    </div>
  );
}
