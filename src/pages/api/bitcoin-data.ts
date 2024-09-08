import type { NextApiRequest, NextApiResponse } from 'next'
import { BitcoinData, MinerstatResponse } from '../../types'

const MINERSTAT_API_URL = 'https://api.minerstat.com/v2/coins?list=BTC'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BitcoinData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    console.log('Fetching Bitcoin data from Minerstat...')
    const response = await fetch(MINERSTAT_API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch Bitcoin data')
    }
    const data: MinerstatResponse[] = await response.json()

    if (data.length === 0) {
      throw new Error('No Bitcoin data received')
    }

    const btcData = data[0] // The API returns an array, but we only need the first (and only) item
    console.log('Received data from Minerstat:', btcData)

    const bitcoinData: BitcoinData = {
      price: btcData.price,
      networkDifficulty: btcData.difficulty,
      networkHashrate: btcData.network_hashrate / 1e18, // Convert to EH/s
      blockReward: btcData.reward_block,
      lastUpdated: btcData.updated
    }

    console.log('Sending Bitcoin data to client:', bitcoinData)
    res.status(200).json(bitcoinData)
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error)
    res.status(500).json({ error: 'Failed to fetch Bitcoin data' })
  }
}