import React, { createContext, useContext, ReactNode } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Tool, InventoryItem } from '../types';

interface InventoryContextType {
  inventory: InventoryItem[];
  addToInventory: (tool: Tool) => void;
  removeFromInventory: (toolId: string) => void;
  clearInventory: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventoryContext must be used within an InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const inventoryHook = useInventory();

  return (
    <InventoryContext.Provider value={inventoryHook}>
      {children}
    </InventoryContext.Provider>
  );
};