import React from 'react';
import { useWallet } from './WalletProvider';

export function ReceiveView() {
  const { address, hasProvider, lastError } = useWallet();

  const generateQR = (addr: string) => {
    // Simple placeholder - in production use qrcode.react
    return `QR Code for: ${addr}`;
  };

  return (
    <div className="receive-view">
      <h2>Receive AVAX</h2>
      
      {address ? (
        <div className="receive-content">
          <p>Share your address to receive funds:</p>
          
          <div className="address-box">
            <code>{address}</code>
            <button
              onClick={() => navigator.clipboard.writeText(address || '')}
              className="btn btn-small"
            >
              Copy Address
            </button>
          </div>

          <div className="qr-placeholder">
            <p>{generateQR(address)}</p>
            <p className="note">QR code will be displayed here</p>
          </div>

          <p className="warning">
            ⚠️ Only send AVAX on the C-Chain (EVM) to this address. 
            Use different addresses for X-Chain or P-Chain transfers.
          </p>
        </div>
      ) : (
        <div>
          <p>Connect wallet first to see your address</p>
          {!hasProvider && <p className="error">No Web3 provider detected — install MetaMask.</p>}
          {lastError && <p className="error">{lastError}</p>}
        </div>
      )}
    </div>
  );
}
