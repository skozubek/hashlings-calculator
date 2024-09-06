export interface Tool {
  id: string;
  name: string;
  skill: string;
  class: string;
  rarity: string;
  hashrate: number;
  power: number;
  imageUrl: string;
}
  
  export interface BitcoinData {
    price: number;
    networkDifficulty: number;
    networkHashrate: number; // in TH/s
    blockReward: number;
    lastUpdated: number;
  }
  
  export interface InventoryItem {
    toolId: string;
    quantity: number;
  }

  export interface MiningCalculationResult {
    dailyBtc: number;
    weeklyBtc: number;
    monthlyBtc: number;
    dailyUsd: number;
    weeklyUsd: number;
    monthlyUsd: number;
  }

  export interface FleetStats {
    totalHashrate: number;
    totalPowerConsumption: number;
    projectedDailyEarnings: number;
    projectedMonthlyEarnings: number;
  }