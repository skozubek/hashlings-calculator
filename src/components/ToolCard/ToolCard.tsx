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

  const BoldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="font-bold">{children}</span>
  );

  return (
    <div className={styles.cardWrapper}>
      <div
        className={`${styles.cardContainer} ${isFlipped ? styles.flipped : ''}`}
        onClick={handleClick}
      >
        <div className={styles.card}>
          <div className={`${styles.cardFront} bg-white`}>
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
              <p><BoldLabel>Hashrate:</BoldLabel> {tool.hashrate} TH/s</p>
              <p><BoldLabel>Monthly Power Bill:</BoldLabel> ${tool.monthlyPowerBill}</p>
              <p><BoldLabel>Skill:</BoldLabel> {tool.skill}</p>
              <p><BoldLabel>Class:</BoldLabel> {tool.class}</p>
              <p><BoldLabel>Rarity:</BoldLabel> {tool.rarity}</p>
            </div>
          </div>
          <div className={`${styles.cardBack} bg-gray-100`}>
            <h3 className="text-xl font-semibold mb-2">Mining Calculations</h3>
            <div className={`${styles.backImageContainer} mb-2`}>
              <Image
                src={tool.imageUrl}
                alt={tool.name}
                layout="fill"
                objectFit="contain"
                className={`${styles.backCardImage} rounded-md`}
              />
            </div>
            {loading && <p>Loading calculations...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {calculationResult && (
              <div className="space-y-1 text-sm">
                <p><BoldLabel>Daily:</BoldLabel> {calculationResult.dailyBtc.toFixed(8)} BTC (${calculationResult.dailyUsd.toFixed(2)})</p>
                <p><BoldLabel>Weekly:</BoldLabel> {calculationResult.weeklyBtc.toFixed(8)} BTC (${calculationResult.weeklyUsd.toFixed(2)})</p>
                <p><BoldLabel>Monthly:</BoldLabel> {calculationResult.monthlyBtc.toFixed(8)} BTC (${calculationResult.monthlyUsd.toFixed(2)})</p>
                <p><BoldLabel>Effective Buying Price:</BoldLabel> ${calculationResult.effectiveBuyingPrice.toFixed(2)}</p>
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
        className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add to Inventory
      </button>
    </div>
  );
};

export default ToolCard;