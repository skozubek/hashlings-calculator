export interface Tool {
  id: string;
  name: string;
  skill: string;
  class: string;
  rarity: string;
  hashrate: number;
  monthlyPowerBill: number;
  imageUrl: string;
}

export interface BitcoinData {
  price: number;
  networkDifficulty: number;
  networkHashrate: number; // in EH/s
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
  effectiveBuyingPrice: number;
  dailyPowerCost: number;
}

export interface FleetStats {
  totalHashrate: number;
  totalMonthlyPowerBill: number;
  projectedDailyRevenue: number;
  projectedDailyPowerCost: number;
  projectedDailyEarnings: number;
  projectedMonthlyEarnings: number;
  effectiveBuyingPrice: number;
}

export interface MinerstatResponse {
  id: string;
  coin: string;
  name: string;
  type: string;
  algorithm: string;
  network_hashrate: number;
  difficulty: number;
  reward: number;
  reward_unit: string;
  reward_block: number;
  price: number;
  volume: number;
  updated: number;
}