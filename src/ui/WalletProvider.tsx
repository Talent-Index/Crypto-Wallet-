import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  address: string | null;
  balance: string | null;
  network: 'fuji' | 'mainnet';
  isConnected: boolean;
  hasProvider: boolean;
  lastError: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTransaction: (to: string, amount: string) => Promise<string>;
}

export const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<'fuji' | 'mainnet'>('fuji');
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [hasProvider, setHasProvider] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const rpcUrl = network === 'fuji' 
    ? 'https://api.avax-test.network/ext/bc/C/rpc'
    : 'https://api.avax.network/ext/bc/C/rpc';

  const connectWallet = async () => {
    try {
      // If MetaMask or window.ethereum is available
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        setLastError(null);
        setHasProvider(true);
        // Request accounts
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const addr = accounts && accounts.length ? accounts[0] : null;
        if (!addr) throw new Error('No accounts returned from wallet');
        setAddress(addr);

        // Create ethers provider and signer
        const prov = new ethers.BrowserProvider((window as any).ethereum as any);
        setProvider(prov);
        const sig = await prov.getSigner();
        setSigner(sig);

        // Fetch balance (handle BigInt)
        const bal = await prov.getBalance(addr);
        setBalance(ethers.formatEther(bal));
      } else {
        setHasProvider(false);
        setLastError('MetaMask or Web3 wallet not found. Use CLI for non-web3 wallet operations.');
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
      setLastError((err as Error)?.message || String(err));
    }
  };

  // Detect provider on mount and subscribe to account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setHasProvider(true);

      const eth = (window as any).ethereum;

      // If the site already has permission, populate accounts immediately
      (async () => {
        try {
          const existing: string[] = await eth.request({ method: 'eth_accounts' });
          if (existing && existing.length) {
            const addr = existing[0];
            setAddress(addr);
            try {
              const prov = new ethers.BrowserProvider(eth as any);
              setProvider(prov);
              const bal = await prov.getBalance(addr);
              setBalance(ethers.formatEther(bal));
            } catch (e) {
              console.error('Error fetching balance for existing account', e);
            }
          }
        } catch (e) {
          // ignore; not fatal
        }
      })();

      const handleAccounts = async (accounts: string[]) => {
        if (accounts && accounts.length) {
          const addr = accounts[0];
          setAddress(addr);
          try {
            const prov = new ethers.BrowserProvider(eth as any);
            setProvider(prov);
            const bal = await prov.getBalance(addr);
            setBalance(ethers.formatEther(bal));
          } catch (e) {
            console.error('Error updating balance after account change', e);
          }
        } else {
          // No accounts available
          setAddress(null);
          setBalance(null);
        }
      };

      const handleChain = () => {
        // reset provider/signer so user can reconnect on chain change
        setProvider(null);
        setSigner(null);
        setAddress(null);
        setBalance(null);
      };

      eth.on && eth.on('accountsChanged', handleAccounts);
      eth.on && eth.on('chainChanged', handleChain);

      return () => {
        eth.removeListener && eth.removeListener('accountsChanged', handleAccounts);
        eth.removeListener && eth.removeListener('chainChanged', handleChain);
      };
    } else {
      setHasProvider(false);
    }
  }, []);

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
    setSigner(null);
  };

  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    if (!signer) throw new Error('No signer available');
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amount),
      gasLimit: 21000n
    });
    return tx.hash;
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        network,
        isConnected: !!address,
        hasProvider,
        lastError,
        connectWallet,
        disconnectWallet,
        sendTransaction
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = React.useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
