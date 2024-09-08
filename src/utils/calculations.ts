import { Tool, BitcoinData, MiningCalculationResult, FleetStats } from '../types';

export const calculateMiningRewards = (
  tool: Tool,
  bitcoinData: BitcoinData
): MiningCalculationResult => {
  const { hashrate, monthlyPowerBill } = tool;
  const { price, networkDifficulty, blockReward } = bitcoinData;
  const poolFee = 2; // Pool fee in percentage (you might want to make this configurable)

  // Constants
  const secondsPerDay = 86400;
  const normalizationFactor = 65535;
  const difficultyNormalization = Math.pow(2, 48);

  // Convert hashrate to H/s
  const hashrateHps = hashrate * 1e12;

  // Calculate daily BTC reward
  const dailyBtc = (hashrateHps * secondsPerDay * blockReward * normalizationFactor) / (networkDifficulty * difficultyNormalization);

  // Calculate power costs
  const dailyPowerCost = monthlyPowerBill / 30.44;

  // Calculate earnings (including pool fee)
  const dailyUsd = (dailyBtc * price - dailyPowerCost) * (1 - poolFee / 100);
  const weeklyBtc = dailyBtc * 7;
  const weeklyUsd = dailyUsd * 7;
  const monthlyBtc = dailyBtc * 30.44;
  const monthlyUsd = dailyUsd * 30.44;

  // Calculate effective buying price
  const effectiveBuyingPrice = dailyPowerCost / dailyBtc;

  return {
    dailyBtc,
    weeklyBtc,
    monthlyBtc,
    dailyUsd,
    weeklyUsd,
    monthlyUsd,
    effectiveBuyingPrice,
    dailyPowerCost,
  };
};


export const calculateFleetStats = (
  tools: Tool[],
  bitcoinData: BitcoinData
): FleetStats => {
  let totalHashrate = 0;
  let totalMonthlyPowerBill = 0;
  let projectedDailyRevenue = 0;
  let projectedDailyPowerCost = 0;
  let totalDailyBtc = 0;

  tools.forEach((tool) => {
    totalHashrate += tool.hashrate;
    totalMonthlyPowerBill += tool.monthlyPowerBill;
    const toolEarnings = calculateMiningRewards(tool, bitcoinData);
    projectedDailyRevenue += toolEarnings.dailyUsd + toolEarnings.dailyPowerCost; // Revenue before subtracting power cost
    projectedDailyPowerCost += toolEarnings.dailyPowerCost;
    totalDailyBtc += toolEarnings.dailyBtc;
  });

  const projectedDailyEarnings = projectedDailyRevenue - projectedDailyPowerCost;
  const projectedMonthlyEarnings = projectedDailyEarnings * 30.44;
  const effectiveBuyingPrice = projectedDailyPowerCost / totalDailyBtc;

  return {
    totalHashrate,
    totalMonthlyPowerBill,
    projectedDailyRevenue,
    projectedDailyPowerCost,
    projectedDailyEarnings,
    projectedMonthlyEarnings,
    effectiveBuyingPrice,
  };
};