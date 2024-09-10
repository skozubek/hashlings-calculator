// components/WalletConnect.tsx

import React from 'react';
import { getAddress, GetAddressResponse, AddressPurpose, BitcoinNetworkType } from 'sats-connect';
import { useUserHashcrafters } from '../hooks/useUserHashcrafters';
import { Tool } from '../types';

interface WalletConnectProps {
  onAddressChange: (address: string | null) => void;
  tools: Tool[];
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onAddressChange, tools }) => {
  const { fetchAndFilterUserHashcrafters } = useUserHashcrafters();
  const [address, setAddress] = React.useState<string | null>(null);

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
        onFinish: async (response: GetAddressResponse) => {
          const newAddress = response.addresses[0].address;
          setAddress(newAddress);
          onAddressChange(newAddress);
          await fetchAndFilterUserHashcrafters(newAddress, tools);
        },
        onCancel: () => alert('Wallet connection cancelled'),
      };

      await getAddress(getAddressOptions);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  const truncateAddress = (addr: string) => {
    return addr.slice(0, 5) + '...' + addr.slice(-3);
  };

  return (
    <button
      onClick={connectWallet}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
    >
      {address ? truncateAddress(address) : 'Connect Xverse Wallet'}
    </button>
  );
};

export default WalletConnect;