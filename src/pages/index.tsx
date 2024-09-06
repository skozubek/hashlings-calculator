import React, { useState, useEffect } from 'react';
import ToolCard from '../components/ToolCard';
import InventoryManager from '../components/InventoryManager';
import MiningCalculator from '../components/MiningCalculator';
import FleetCalculator from '../components/FleetCalculator';
import { Tool } from '../types';

const HomePage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);

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
      <h1 className="text-4xl font-bold mb-8">Hashlings Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <MiningCalculator />
        </div>
        <div>
          <FleetCalculator />
        </div>
      </div>
      <div className="mt-8">
        <InventoryManager />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Available Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;