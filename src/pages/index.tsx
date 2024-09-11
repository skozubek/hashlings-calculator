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
  const { loading: hashcraftersLoading, error: hashcraftersError } = useUserHashcrafters();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-center my-12">HashCrafters Calculator</h1>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Image src="/images/BTC.svg" alt="Bitcoin logo" width={32} height={32} />
            {bitcoinLoading ? (
              <span className="text-lg font-semibold ml-2">Loading...</span>
            ) : bitcoinError ? (
              <span className="text-lg font-semibold text-red-500 ml-2">Error loading BTC price</span>
            ) : (
              <span className="text-lg font-semibold ml-2">${bitcoinData?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            )}
          </div>
          <WalletConnect onAddressChange={handleAddressChange} tools={tools} />
        </div>
      </div>

      {hashcraftersLoading && <p className="text-center">Loading users Hashcrafters...</p>}
      {hashcraftersError && <p className="text-center text-red-500">Error: {hashcraftersError}</p>}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[65%]">
          <h2 className="text-2xl font-bold mb-4">Available HashCrafters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        <div className="lg:w-[35%]">
          <div className="sticky top-8 space-y-8">
            <FleetCalculator />
            <InventoryManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;