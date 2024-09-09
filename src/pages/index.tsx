import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ToolCard from '../components/ToolCard/ToolCard';
import InventoryManager from '../components/InventoryManager';
import FleetCalculator from '../components/FleetCalculator';
import WalletConnect from '../components/WalletConnect';
import { Tool, Inscription } from '../types';
import { useBitcoinData } from '../contexts/BitcoinContext';

const HomePage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const { bitcoinData, loading, error } = useBitcoinData();
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [fetchedAddresses, setFetchedAddresses] = useState<Set<string>>(new Set());

  const filterHashcrafters = useCallback((inscriptions: Inscription[]): Inscription[] => {
    const toolNames = tools.map(tool => tool.name);
    return inscriptions.filter(inscription =>
      inscription.metadata &&
      toolNames.includes(inscription.metadata.Name)
    );
  }, [tools]);

  const fetchInscriptions = useCallback(async (address: string) => {
    if (fetchedAddresses.has(address)) return;
    try {
      const response = await fetch(`/api/verify-ordinals?address=${address}`);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.data && Array.isArray(responseData.data)) {
          const hashcrafters = filterHashcrafters(responseData.data);
          console.log('Hashcrafters found:', hashcrafters);
          setFetchedAddresses(prev => new Set(prev).add(address));
        } else {
          console.error('Inscriptions data is not in the expected format:', responseData);
        }
      } else {
        console.error('Failed to fetch inscriptions');
      }
    } catch (error) {
      console.error('Error fetching inscriptions:', error);
    }
  }, [filterHashcrafters, fetchedAddresses]);

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

  useEffect(() => {
    if (connectedAddress) {
      fetchInscriptions(connectedAddress);
    }
  }, [connectedAddress, fetchInscriptions]);

  const handleAddressChange = (address: string | null) => {
    setConnectedAddress(address);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">HashCrafters Calculator</h1>
        <div className="flex items-center space-x-2">
          <Image src="/images/BTC.svg" alt="Bitcoin logo" width={32} height={32} />
          {loading ? (
            <span className="text-lg font-semibold">Loading...</span>
          ) : error ? (
            <span className="text-lg font-semibold text-red-500">Error loading BTC price</span>
          ) : (
            <span className="text-lg font-semibold">${bitcoinData?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          )}
        </div>
      </div>
      <WalletConnect onAddressChange={handleAddressChange} />
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