import { Tool, BitcoinData, MiningCalculationResult, FleetStats } from '../types';

export const calculateMiningRewards = (
  tool: Tool,
  bitcoinData: BitcoinData
): MiningCalculationResult => {
  const { hashrate, monthlyPowerBill } = tool;
  const { price, networkDifficulty, networkHashrate, blockReward } = bitcoinData;

  // Calculate daily Bitcoin production
  const dailyBlocks = 144; // Average number of blocks mined per day
  const networkHashrateInTH = networkHashrate; // Already in TH/s
  const toolShare = hashrate / networkHashrateInTH;
  const dailyBtc = toolShare * blockReward * dailyBlocks;

  // Calculate earnings
  const dailyUsd = dailyBtc * price;
  const weeklyBtc = dailyBtc * 7;
  const weeklyUsd = dailyUsd * 7;
  const monthlyBtc = dailyBtc * 30;
  const monthlyUsd = dailyUsd * 30;

  // Calculate power costs (now using the monthly power bill)
  const dailyPowerCost = monthlyPowerBill / 30;
  const weeklyPowerCost = monthlyPowerBill / 4;
  const monthlyPowerCost = monthlyPowerBill;

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
  let totalMonthlyPowerBill = 0;
  let projectedDailyEarnings = 0;

  tools.forEach((tool) => {
    totalHashrate += tool.hashrate;
    totalMonthlyPowerBill += tool.monthlyPowerBill;
    const toolEarnings = calculateMiningRewards(tool, bitcoinData);
    projectedDailyEarnings += toolEarnings.dailyUsd;
  });

  return {
    totalHashrate,
    totalMonthlyPowerBill,
    projectedDailyEarnings,
    projectedMonthlyEarnings: projectedDailyEarnings * 30,
  };
};