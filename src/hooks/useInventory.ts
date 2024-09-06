import { useState, useCallback } from 'react';
import { Tool, InventoryItem } from '../types';

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const addToInventory = useCallback((tool: Tool) => {
    setInventory((prevInventory) => {
      const existingItem = prevInventory.find(item => item.toolId === tool.id);
      if (existingItem) {
        return prevInventory.map(item =>
          item.toolId === tool.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevInventory, { toolId: tool.id, quantity: 1 }];
      }
    });
  }, []);

  const removeFromInventory = useCallback((toolId: string) => {
    setInventory((prevInventory) => {
      const existingItem = prevInventory.find(item => item.toolId === toolId);
      if (existingItem && existingItem.quantity > 1) {
        return prevInventory.map(item =>
          item.toolId === toolId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevInventory.filter(item => item.toolId !== toolId);
      }
    });
  }, []);

  const clearInventory = useCallback(() => {
    setInventory([]);
  }, []);

  return {
    inventory,
    addToInventory,
    removeFromInventory,
    clearInventory,
  };
};