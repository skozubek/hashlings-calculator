import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useInventoryContext } from '../contexts/InventoryContext';
import { Tool } from '../types';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InventoryManager: React.FC = () => {
  const { inventory, removeFromInventory, updateQuantity, clearInventory } = useInventoryContext();
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const toolsData: Tool[] = await response.json();
        setTools(toolsData);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };
    fetchTools();
  }, []);

  const getToolById = (id: string) => tools.find(tool => tool.id === id);

  if (inventory.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Your Inventory</h2>
      <AnimatePresence>
        {inventory.map((item) => {
          const tool = getToolById(item.toolId);
          if (!tool) return null;
          return (
            <motion.li
              key={item.toolId}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center space-x-4 mb-4"
            >
              <div className="relative w-16 h-16">
                <Image
                  src={tool.imageUrl}
                  alt={tool.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{tool.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.toolId, Math.max(1, item.quantity - 1))}
                      className="p-1 bg-gray-200 rounded-l hover:bg-gray-300 transition-colors"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                        updateQuantity(item.toolId, newQuantity);
                      }}
                      className="w-16 text-center border-y border-gray-200"
                      min="1"
                    />
                    <button
                      onClick={() => updateQuantity(item.toolId, item.quantity + 1)}
                      className="p-1 bg-gray-200 rounded-r hover:bg-gray-300 transition-colors"
                    >
                      <ChevronUp size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p>Hashrate: {tool.hashrate * item.quantity} TH/s</p>
                <p>Monthly Power Bill: ${(tool.monthlyPowerBill * item.quantity).toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeFromInventory(item.toolId)}
                className="p-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.li>
          );
        })}
      </AnimatePresence>
      <button
        onClick={clearInventory}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Clear Inventory
      </button>
    </div>
  );
};

export default InventoryManager;