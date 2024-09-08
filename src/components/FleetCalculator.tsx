import React from 'react';
import { useInventoryContext } from '../contexts/InventoryContext';
import { useBitcoinData } from '../hooks/useBitcoinData';
import { calculateFleetStats } from '../utils/calculations';
import { Tool } from '../types';

const FleetCalculator: React.FC = () => {
  const { inventory } = useInventoryContext();
  const { bitcoinData, loading, error } = useBitcoinData();
  const [tools, setTools] = React.useState<Tool[]>([]);

  React.useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const toolsData: Tool[] = await response.json();
        setTools(toolsData);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };
    fetchTools();
  }, []);

  if (inventory.length === 0) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bitcoinData) {
    return null;
  }

  const inventoryTools = inventory.map(item => {
    const tool = tools.find(t => t.id === item.toolId);
    return { ...tool!, quantity: item.quantity };
  }).filter((tool): tool is Tool & { quantity: number } => tool !== undefined);

  const fleetStats = calculateFleetStats(inventoryTools, bitcoinData);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Fleet Calculator</h2>
      <div className="space-y-2">
        <p><span className="font-bold">Total Hashrate:</span> {fleetStats.totalHashrate.toFixed(2)} TH/s</p>
        <p><span className="font-bold">Total Monthly Power Bill:</span> ${fleetStats.totalMonthlyPowerBill.toFixed(2)}</p>
        <p><span className="font-bold">Projected Daily Revenue:</span> ${fleetStats.projectedDailyRevenue.toFixed(2)}</p>
        <p><span className="font-bold">Projected Daily Power Cost:</span> ${fleetStats.projectedDailyPowerCost.toFixed(2)}</p>
        <p><span className="font-bold">Projected Daily Earnings:</span> ${fleetStats.projectedDailyEarnings.toFixed(2)}</p>
        <p><span className="font-bold">Projected Monthly Earnings:</span> ${fleetStats.projectedMonthlyEarnings.toFixed(2)}</p>
        <p><span className="font-bold">Effective Buying Price:</span> ${fleetStats.effectiveBuyingPrice.toFixed(2)} per BTC</p>
      </div>
    </div>
  );
};

export default FleetCalculator;