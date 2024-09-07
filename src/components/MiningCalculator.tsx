import React, { useState, useEffect } from 'react';
import { Tool, MiningCalculationResult } from '../types';
import { calculateMiningRewards } from '../utils/calculations';
import { useBitcoinData } from '../hooks/useBitcoinData';

const MiningCalculator: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [calculationResult, setCalculationResult] = useState<MiningCalculationResult | null>(null);
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

  useEffect(() => {
    if (selectedTool && bitcoinData) {
      const result = calculateMiningRewards(selectedTool, bitcoinData);
      setCalculationResult(result);
    }
  }, [selectedTool, bitcoinData]);

  if (loading) return <div>Loading Bitcoin data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Mining Calculator</h2>
      <select
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setSelectedTool(tools.find(tool => tool.id === e.target.value) || null)}
        value={selectedTool?.id || ''}
      >
        <option value="">Select a tool</option>
        {tools.map((tool) => (
          <option key={tool.id} value={tool.id}>{tool.name}</option>
        ))}
      </select>
      {selectedTool && calculationResult && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Potential Earnings</h3>
          <p>Daily: {calculationResult.dailyBtc.toFixed(8)} BTC (${calculationResult.dailyUsd.toFixed(2)})</p>
          <p>Weekly: {calculationResult.weeklyBtc.toFixed(8)} BTC (${calculationResult.weeklyUsd.toFixed(2)})</p>
          <p>Monthly: {calculationResult.monthlyBtc.toFixed(8)} BTC (${calculationResult.monthlyUsd.toFixed(2)})</p>
        </div>
      )}
      {bitcoinData && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Current Bitcoin Data</h3>
          <p>Price: ${bitcoinData.price.toFixed(2)}</p>
          <p>Network Difficulty: {bitcoinData.networkDifficulty.toExponential(2)}</p>
          <p>Network Hashrate: {bitcoinData.networkHashrate.toFixed(2)} EH/s</p>
        </div>
      )}
    </div>
  );
};

export default MiningCalculator;