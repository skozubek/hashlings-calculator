// pages/index.tsx

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ToolCard from '../components/ToolCard/ToolCard';
import InventoryManager from '../components/InventoryManager';
import FleetCalculator from '../components/FleetCalculator';
import WalletConnect from '../components/WalletConnect';
import { Tool } from '../types';
import { useBitcoinData } from '../contexts/BitcoinContext';
import { useUserHashcrafters } from '../hooks/useUserHashcrafters';

const HomePage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const { bitcoinData, loading: bitcoinLoading, error: bitcoinError } = useBitcoinData();
  const { userHashcrafters, loading: hashcraftersLoading, error: hashcraftersError } = useUserHashcrafters();
  const [, setConnectedAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      const response = await fetch('/api/tools');
      if (response.ok) {
        const toolsData: Tool[] = await response.json();
        setTools(toolsData);
      } else {
        console.error('Failed to fetch tools');
      }
    };
    fetchTools();
  }, []);

  const handleAddressChange = (address: string | null) => {
    setConnectedAddress(address);
  };

  const verifyStoredHashcrafters = () => {
    console.log('Verifying stored Hashcrafters...');
    if (userHashcrafters.length > 0) {
      console.log('Number of stored Hashcrafters:', userHashcrafters.length);
      userHashcrafters.forEach((hashcrafter, index) => {
        console.log(`Hashcrafter ${index + 1}:`);
        console.log('  Inscription ID:', hashcrafter.inscription_id);
        console.log('  Name:', hashcrafter.metadata?.Name);
        console.log('  Model:', hashcrafter.metadata?.Model);
        console.log('  Hashrate:', hashcrafter.metadata?.Hashrate);
        console.log('  Rarity:', hashcrafter.metadata?.Rarity);
        console.log('---');
      });
    } else {
      console.log('No Hashcrafters stored.');
    }
    console.log('Verification complete.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">HashCrafters Calculator</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Image src="/images/BTC.svg" alt="Bitcoin logo" width={32} height={32} />
            {bitcoinLoading ? (
              <span className="text-lg font-semibold">Loading...</span>
            ) : bitcoinError ? (
              <span className="text-lg font-semibold text-red-500">Error loading BTC price</span>
            ) : (
              <span className="text-lg font-semibold">${bitcoinData?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            )}
          </div>
          <WalletConnect onAddressChange={handleAddressChange} tools={tools} />
        </div>
      </div>
      <button
        onClick={verifyStoredHashcrafters}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Verify Stored Hashcrafters
      </button>
      {hashcraftersLoading && <p>Loading user's Hashcrafters...</p>}
      {hashcraftersError && <p className="text-red-500">Error: {hashcraftersError}</p>}
      <h2 className="text-2xl font-bold mb-8 mt-4">Available HashCrafters</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[65%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
        <div className="lg:w-[35%]">
          <div className="sticky top-8">
            <FleetCalculator />
            <div className="mt-8">
              <InventoryManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;