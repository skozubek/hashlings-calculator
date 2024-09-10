// hooks/useUserHashcrafters.ts

import { useCallback } from 'react';
import { useUserHashcraftersContext } from '../contexts/UserHashcraftersContext';
import { Inscription, Tool } from '../types';

export const useUserHashcrafters = () => {
  const { 
    userHashcrafters, 
    setUserHashcrafters, 
    loading, 
    setLoading, 
    error, 
    setError 
  } = useUserHashcraftersContext();

  const fetchAndFilterUserHashcrafters = useCallback(async (address: string, tools: Tool[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/verify-ordinals?address=${address}`);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.data && Array.isArray(responseData.data)) {
          const filteredHashcrafters = filterHashcrafters(responseData.data, tools);
          setUserHashcrafters(filteredHashcrafters);
          console.log('Hashcrafters found:', filteredHashcrafters);
        } else {
          throw new Error('Inscriptions data is not in the expected format');
        }
      } else {
        throw new Error('Failed to fetch inscriptions');
      }
    } catch (error) {
      console.error('Error fetching inscriptions:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [setUserHashcrafters, setLoading, setError]);

  const filterHashcrafters = (inscriptions: Inscription[], tools: Tool[]): Inscription[] => {
    const toolNames = tools.map(tool => tool.name);
    return inscriptions.filter(inscription =>
      inscription.metadata &&
      inscription.metadata.Name &&
      toolNames.includes(inscription.metadata.Name)
    );
  };

  return { 
    userHashcrafters, 
    loading, 
    error, 
    fetchAndFilterUserHashcrafters 
  };
};