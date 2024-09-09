import React, { useState } from 'react';
import { getAddress } from 'sats-connect';

interface WalletConnectProps {
  onAddressChange: (address: string | null) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onAddressChange }) => {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const getAddressOptions = {
        payload: {
          purposes: ['ordinals', 'payment'],
          message: 'Address for HashCrafters',
          network: {
            type: 'Mainnet'
          },
        },
        onFinish: (response: any) => {
          const newAddress = response.addresses[0].address;
          setAddress(newAddress);
          onAddressChange(newAddress);
        },
        onCancel: () => alert('Wallet connection cancelled'),
      };

      await getAddress(getAddressOptions);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  return (
    <div>
      {address ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded">
          Connect Xverse Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;