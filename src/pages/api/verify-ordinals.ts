import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Inscription } from '../../types';

interface ApiResponse {
  inscriptions: {
    data: Inscription[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Valid address is required' });
  }

  const apiKey = process.env.ORDISCAN_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured' });
  }

  try {
    const response = await axios.get(`https://api.ordiscan.com/v1/address/${address}/inscriptions`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    const apiResponse: ApiResponse = response.data;

    res.status(200).json(apiResponse);
  } catch (error) {
    console.error('Error fetching inscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch inscriptions' });
  }
}