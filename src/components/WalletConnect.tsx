import React, { useState } from 'react';
import { getAddress, GetAddressResponse, AddressPurpose, BitcoinNetworkType } from 'sats-connect';

interface WalletConnectProps {
  onAddressChange: (address: string | null) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onAddressChange }) => {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const getAddressOptions = {
        payload: {
          purposes: ['ordinals', 'payment'] as AddressPurpose[],
          message: 'Address for HashCrafters',
          network: {
            type: 'Mainnet' as BitcoinNetworkType,
          },
        },
        onFinish: (response: GetAddressResponse) => {
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 5)}...${address.slice(-3)}`;
  };

  const showHashCrafters = () => {
    // This is a placeholder. You should implement the actual functionality here.
    alert('Showing HashCrafters (to be implemented)');
  };

  return (
    <div>
      {!address ? (
        <button
          onClick={connectWallet}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Connect Xverse Wallet
        </button>
      ) : (
        <button
          onClick={showHashCrafters}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          {truncateAddress(address)}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;