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
        <div className={`${styles.card} ${styles.hoverEffect}`}>
          <div className={styles.cardFront}>
            <h2 className="text-xl font-bold mb-2">{tool.name}</h2>
            <div className={`${styles.imageContainer} relative w-full h-48 mb-2`}>
              <Image
                src={tool.imageUrl}
                alt={tool.name}
                layout="fill"
                objectFit="cover"
                className={`${styles.cardImage} rounded-md`}
              />
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-bold">Hashrate:</span> {tool.hashrate} TH/s</p>
              <p><span className="font-bold">Monthly Power Bill:</span> ${tool.monthlyPowerBill}</p>
              <p><span className="font-bold">Skill:</span> {tool.skill}</p>
              <p><span className="font-bold">Class:</span> {tool.class}</p>
              <p><span className="font-bold">Rarity:</span> {tool.rarity}</p>
            </div>
          </div>
          <div className={`${styles.cardBack} bg-gray-100`}>
            <h3 className="text-xl font-semibold mb-4">Mining Calculations</h3>
            <div className="relative w-full h-36 mb-4">
              <Image
                src={tool.imageUrl}
                alt={tool.name}
                layout="fill"
                objectFit="contain"
                className="rounded-md"
              />
            </div>
            {loading && <p>Loading calculations...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {calculationResult && (
              <div className="space-y-1 text-sm">
                <p><span className="font-bold">Daily:</span> {calculationResult.dailyBtc.toFixed(8)} BTC (${calculationResult.dailyUsd.toFixed(2)})</p>
                <p><span className="font-bold">Weekly:</span> {calculationResult.weeklyBtc.toFixed(8)} BTC (${calculationResult.weeklyUsd.toFixed(2)})</p>
                <p><span className="font-bold">Monthly:</span> {calculationResult.monthlyBtc.toFixed(8)} BTC (${calculationResult.monthlyUsd.toFixed(2)})</p>
                <p><span className="font-bold">Effective Buying Price:</span> ${calculationResult.effectiveBuyingPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToInventory(tool);
        }}
        className="mt-2 w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
      >
        Add to Inventory
      </button>
    </div>
  );
};

export default ToolCard;