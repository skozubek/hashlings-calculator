// components/WalletConnect.tsx

import React, { useState } from 'react';
import { getAddress, GetAddressResponse, AddressPurpose, BitcoinNetworkType } from 'sats-connect';
import { useUserHashcrafters } from '../hooks/useUserHashcrafters';
import { useInventoryContext } from '../contexts/InventoryContext';
import { Tool } from '../types';
import { toast } from 'react-toastify';

interface WalletConnectProps {
  onAddressChange: (address: string | null) => void;
  tools: Tool[];
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onAddressChange, tools }) => {
  const { userHashcrafters, fetchAndFilterUserHashcrafters } = useUserHashcrafters();
  const { addToInventory } = useInventoryContext();
  const [address, setAddress] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

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
          toast.success('Wallet connected successfully!');
        },
        onCancel: () => toast.error('Wallet connection cancelled'),
      };

      await getAddress(getAddressOptions);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const verifyStoredHashcrafters = () => {
    if (userHashcrafters.length > 0) {
      setIsVerified(true);
      toast.info(`${userHashcrafters.length} Hashcrafters verified in your wallet.`);
    } else {
      toast.warn('No Hashcrafters found in your wallet.');
    }
  };

  const addUserHashcraftersToInventory = () => {
    let addedCount = 0;
    userHashcrafters.forEach((hashcrafter) => {
      const matchingTool = tools.find(tool => tool.name === hashcrafter.metadata?.Name);
      if (matchingTool) {
        addToInventory(matchingTool);
        addedCount++;
      }
    });
    toast.success(`${addedCount} Hashcrafters added to your inventory!`);
  };

  const truncateAddress = (addr: string) => {
    return addr.slice(0, 5) + '...' + addr.slice(-3);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={connectWallet}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
      >
        {address ? truncateAddress(address) : 'Connect Xverse Wallet'}
      </button>
      {address && (
        <button
          onClick={isVerified ? addUserHashcraftersToInventory : verifyStoredHashcrafters}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          {isVerified ? 'Add User Hashcrafters to Inventory' : 'Verify Stored Hashcrafters'}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;