import React, { useState } from 'react';
import { Dashboard } from './Dashboard';
import { SendForm } from './SendForm';
import { ReceiveView } from './ReceiveView';
import { SettingsView } from './SettingsView';
import { CreateWallet } from './CreateWallet';
import { WalletProvider } from './WalletProvider';
import './App.css';

type TabType = 'dashboard' | 'send' | 'receive' | 'create' | 'settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <div className="app">
      <header className="app-header">
        <h1>⛓️ Avalanche Wallet</h1>
        <nav className="tab-nav">
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`tab ${activeTab === 'send' ? 'active' : ''}`}
            onClick={() => setActiveTab('send')}
          >
            Send
          </button>
          <button
            className={`tab ${activeTab === 'receive' ? 'active' : ''}`}
            onClick={() => setActiveTab('receive')}
          >
            Receive
          </button>
          <button
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Wallet
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'send' && <SendForm />}
        {activeTab === 'receive' && <ReceiveView />}
        {activeTab === 'create' && <CreateWallet />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      <footer className="app-footer">
        <p>
          Ref: BuilderKit Components — <a href="https://build.avax.network/docs/builderkit">builderkit docs</a>
        </p>
        <p>Never share your private key or mnemonic. Use hardware wallets for high-value accounts.</p>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
