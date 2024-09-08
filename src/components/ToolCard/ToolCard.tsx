import React, { useState } from 'react';
import Image from 'next/image';
import { Tool, MiningCalculationResult } from '@/types';
import { useInventoryContext } from '@/contexts/InventoryContext';
import { useBitcoinData } from '@/hooks/useBitcoinData';
import { calculateMiningRewards } from '@/utils/calculations';
import styles from './ToolCard.module.css';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { addToInventory } = useInventoryContext();
  const { bitcoinData, loading, error } = useBitcoinData();
  const [calculationResult, setCalculationResult] = useState<MiningCalculationResult | null>(null);

  const handleClick = () => {
    if (bitcoinData) {
      const result = calculateMiningRewards(tool, bitcoinData);
      setCalculationResult(result);
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={styles.cardWrapper}>
      <div
        className={`${styles.cardContainer} ${isFlipped ? styles.flipped : ''}`}
        onClick={handleClick}
      >
        <div className={styles.card}>
          <div className={styles.cardFront}>
            <h2 className="text-xl font-bold mb-2">{tool.name}</h2>
            <div className="relative w-full h-48 mb-2">
              <Image
                src={tool.imageUrl}
                alt={tool.name}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <p className="mb-1">Hashrate: {tool.hashrate} TH/s</p>
            <p className="mb-1">Monthly Power Bill: ${tool.monthlyPowerBill}</p>
            <p className="mb-1">Skill: {tool.skill}</p>
            <p className="mb-1">Class: {tool.class}</p>
            <p className="mb-2">Rarity: {tool.rarity}</p>
          </div>
          <div className={styles.cardBack}>
            <h3 className="text-xl font-semibold mb-2">Mining Calculations</h3>
            {loading && <p>Loading calculations...</p>}
            {error && <p>Error: {error}</p>}
            {calculationResult && (
              <>
                <p>Daily: {calculationResult.dailyBtc.toFixed(8)} BTC (${calculationResult.dailyUsd.toFixed(2)})</p>
                <p>Weekly: {calculationResult.weeklyBtc.toFixed(8)} BTC (${calculationResult.weeklyUsd.toFixed(2)})</p>
                <p>Monthly: {calculationResult.monthlyBtc.toFixed(8)} BTC (${calculationResult.monthlyUsd.toFixed(2)})</p>
                <p>Effective Buying Price: ${calculationResult.effectiveBuyingPrice.toFixed(2)}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToInventory(tool);
        }}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add to Inventory
      </button>
    </div>
  );
};

export default ToolCard;