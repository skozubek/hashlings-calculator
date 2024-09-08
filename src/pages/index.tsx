import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ToolCard from '../components/ToolCard/ToolCard';
import InventoryManager from '../components/InventoryManager';
import FleetCalculator from '../components/FleetCalculator';
import { Tool } from '../types';
import { useBitcoinData } from '../contexts/BitcoinContext';

const HomePage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const { bitcoinData, loading, error } = useBitcoinData();

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
      <h2 className="text-2xl font-bold mb-8">Available HashCrafters</h2>
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