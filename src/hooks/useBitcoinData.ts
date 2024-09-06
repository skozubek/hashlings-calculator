import { useState, useEffect } from 'react';
import { BitcoinData } from '../types';

const REFRESH_INTERVAL = 6000000; // 100 minute

export const useBitcoinData = () => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bitcoin-data');
        if (!response.ok) {
          throw new Error('Failed to fetch Bitcoin data');
        }
        const data: BitcoinData = await response.json();
        setBitcoinData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBitcoinData();

    const intervalId = setInterval(fetchBitcoinData, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return { bitcoinData, loading, error };
};