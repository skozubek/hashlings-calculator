import React, { useState, useEffect } from 'react';
import { Tool, FleetStats } from '../types';
import { calculateFleetStats } from '../utils/calculations';
import { useInventoryContext } from '../contexts/InventoryContext';
import { useBitcoinData } from '../hooks/useBitcoinData';

const FleetCalculator: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const { inventory } = useInventoryContext();
  const { bitcoinData, loading, error } = useBitcoinData();
  const [fleetStats, setFleetStats] = useState<FleetStats | null>(null);

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
    if (tools.length > 0 && inventory.length > 0 && bitcoinData) {
      const fleetTools = inventory.flatMap(item =>
        Array(item.quantity).fill(tools.find(tool => tool.id === item.toolId))
      ).filter((tool): tool is Tool => tool !== undefined);

      const stats = calculateFleetStats(fleetTools, bitcoinData);
      setFleetStats(stats);
    }
  }, [tools, inventory, bitcoinData]);

  if (loading) return <div>Loading Bitcoin data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Fleet Calculator</h2>
      {fleetStats ? (
        <div>
          <p>Total Hashrate: {fleetStats.totalHashrate.toFixed(2)} TH/s</p>
          <p>Total Monthly Power Bill: ${fleetStats.totalMonthlyPowerBill.toFixed(2)}</p>
          <p>Projected Daily Earnings: ${fleetStats.projectedDailyEarnings.toFixed(2)}</p>
          <p>Projected Monthly Earnings: ${fleetStats.projectedMonthlyEarnings.toFixed(2)}</p>
        </div>
      ) : (
        <p>Add tools to your inventory to see fleet statistics.</p>
      )}
    </div>
  );
};

export default FleetCalculator;