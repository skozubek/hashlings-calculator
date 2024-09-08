import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { BitcoinData } from '../types';

interface BitcoinContextType {
  bitcoinData: BitcoinData | null;
  loading: boolean;
  error: string | null;
}

const BitcoinContext = createContext<BitcoinContextType | undefined>(undefined);

const REFRESH_INTERVAL = 6000000; // 100 minutes

export const BitcoinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      console.log('Fetching Bitcoin data...');
      try {
        setLoading(true);
        const response = await fetch('/api/bitcoin-data');
        if (!response.ok) {
          throw new Error('Failed to fetch Bitcoin data');
        }
        const data: BitcoinData = await response.json();
        console.log('Bitcoin data fetched:', data);
        setBitcoinData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching Bitcoin data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBitcoinData();
    const intervalId = setInterval(fetchBitcoinData, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <BitcoinContext.Provider value={{ bitcoinData, loading, error }}>
      {children}
    </BitcoinContext.Provider>
  );
};

export const useBitcoinData = () => {
  const context = useContext(BitcoinContext);
  if (context === undefined) {
    throw new Error('useBitcoinData must be used within a BitcoinProvider');
  }
  return context;
};