import React, { useState, useEffect } from 'react';
import { Tool, FleetStats } from '../types';
import { calculateFleetStats } from '../utils/calculations';
import { useInventoryContext } from '../contexts/InventoryContext';
import { useBitcoinData } from '../contexts/BitcoinContext';

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
    if (tools.length > 0 && bitcoinData) {
      const fleetTools = inventory.flatMap(item =>
        Array(item.quantity).fill(tools.find(tool => tool.id === item.toolId))
      ).filter((tool): tool is Tool => tool !== undefined);

      if (fleetTools.length > 0) {
        const stats = calculateFleetStats(fleetTools, bitcoinData);
        setFleetStats(stats);
      } else {
        setFleetStats({
          totalHashrate: 0,
          totalMonthlyPowerBill: 0,
          projectedDailyRevenue: 0,
          projectedDailyPowerCost: 0,
          projectedDailyEarnings: 0,
          projectedMonthlyEarnings: 0,
          effectiveBuyingPrice: 0,
        });
      }
    }
  }, [tools, inventory, bitcoinData]);

  if (loading) return <div>Loading Bitcoin data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Fleet Calculator</h2>
      {fleetStats && fleetStats.totalHashrate > 0 ? (
        <div className="space-y-2 text-sm">
          <p><span className="font-bold">Total Hashrate:</span> {fleetStats.totalHashrate.toFixed(2)} TH/s</p>
          <p><span className="font-bold">Total Monthly Power Bill:</span> ${fleetStats.totalMonthlyPowerBill.toFixed(2)}</p>
          <hr className="my-3 border-gray-300" />
          <p><span className="font-bold">Daily Revenue:</span> ${fleetStats.projectedDailyRevenue.toFixed(2)}</p>
          <p><span className="font-bold">Daily Power Cost:</span> ${fleetStats.projectedDailyPowerCost.toFixed(2)}</p>
          <p><span className="font-bold">Daily Net Earnings:</span> ${fleetStats.projectedDailyEarnings.toFixed(2)}</p>
          <p><span className="font-bold">Monthly Net Earnings:</span> ${fleetStats.projectedMonthlyEarnings.toFixed(2)}</p>
          <hr className="my-3 border-gray-300" />
          <p><span className="font-bold">Effective BTC Price:</span> ${fleetStats.effectiveBuyingPrice.toFixed(2)}</p>
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-100 rounded-lg">
          <p className="text-lg font-semibold mb-2">Your mining fleet is empty!</p>
          <p className="text-gray-600">
            Add tools to your inventory to see detailed fleet calculations, including:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>Total hashrate</li>
            <li>Power consumption</li>
            <li>Projected earnings</li>
            <li>And more!</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">
            Start building your fleet to optimize your mining operations.
          </p>
        </div>
      )}
    </div>
  );
};

export default FleetCalculator;