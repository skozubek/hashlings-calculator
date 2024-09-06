import type { NextApiRequest, NextApiResponse } from 'next'
import { Tool } from '../../types'
import toolsData from '../../data/tools.json'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tool[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  res.status(200).json(toolsData)
}