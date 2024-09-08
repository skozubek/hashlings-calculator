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
            <motion.div
              key={item.toolId}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-wrap items-center justify-between space-y-2 sm:space-y-0 mb-4 pb-4 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={tool.imageUrl}
                    alt={tool.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div className="flex-grow min-w-0 max-w-full">
                  <h3 className="font-semibold truncate">{tool.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.toolId, Math.max(1, item.quantity - 1))}
                        className="p-1 bg-gray-200 rounded-l hover:bg-gray-300 transition-colors"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                          updateQuantity(item.toolId, newQuantity);
                        }}
                        className="w-12 text-center border-y border-gray-200 text-sm"
                        min="1"
                      />
                      <button
                        onClick={() => updateQuantity(item.toolId, item.quantity + 1)}
                        className="p-1 bg-gray-200 rounded-r hover:bg-gray-300 transition-colors"
                      >
                        <ChevronUp size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
                <div className="text-sm">
                  <p><span className="font-bold">HR:</span> {tool.hashrate * item.quantity} TH/s</p>
                  <p><span className="font-bold">MPB:</span> ${(tool.monthlyPowerBill * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeFromInventory(item.toolId)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <button
        onClick={clearInventory}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors w-full sm:w-auto"
      >
        Clear Inventory
      </button>
    </div>
  );
};

export default InventoryManager;