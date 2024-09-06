import { Tool, BitcoinData, MiningCalculationResult, FleetStats } from '../types';

export const calculateMiningRewards = (
  tool: Tool,
  bitcoinData: BitcoinData
): MiningCalculationResult => {
  const { hashrate, power } = tool;
  const { price, networkDifficulty, networkHashrate, blockReward } = bitcoinData;

  // Calculate daily Bitcoin production
  const dailyBlocks = 144; // Average number of blocks mined per day
  const networkHashrateInTH = networkHashrate / 1e12; // Convert to TH/s
  const toolShare = hashrate / networkHashrateInTH;
  const dailyBtc = toolShare * blockReward * dailyBlocks;

  // Calculate earnings
  const dailyUsd = dailyBtc * price;
  const weeklyBtc = dailyBtc * 7;
  const weeklyUsd = dailyUsd * 7;
  const monthlyBtc = dailyBtc * 30;
  const monthlyUsd = dailyUsd * 30;

  // Calculate power costs (assuming $0.10 per kWh)
  const dailyPowerCost = (power / 1000) * 24 * 0.10;
  const weeklyPowerCost = dailyPowerCost * 7;
  const monthlyPowerCost = dailyPowerCost * 30;

  return {
    dailyBtc,
    weeklyBtc,
    monthlyBtc,
    dailyUsd: dailyUsd - dailyPowerCost,
    weeklyUsd: weeklyUsd - weeklyPowerCost,
    monthlyUsd: monthlyUsd - monthlyPowerCost,
  };
};

export const calculateFleetStats = (
  tools: Tool[],
  bitcoinData: BitcoinData
): FleetStats => {
  let totalHashrate = 0;
  let totalPowerConsumption = 0;
  let projectedDailyEarnings = 0;

  tools.forEach((tool) => {
    totalHashrate += tool.hashrate;
    totalPowerConsumption += tool.power;
    const toolEarnings = calculateMiningRewards(tool, bitcoinData);
    projectedDailyEarnings += toolEarnings.dailyUsd;
  });

  return {
    totalHashrate,
    totalPowerConsumption,
    projectedDailyEarnings,
    projectedMonthlyEarnings: projectedDailyEarnings * 30,
  };
};