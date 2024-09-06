import React, { useEffect, useState } from 'react';
import { useInventoryContext } from '../contexts/InventoryContext';
import { Tool } from '../types';

const InventoryManager: React.FC = () => {
  const { inventory, removeFromInventory, clearInventory } = useInventoryContext();
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchTools = async () => {
      const response = await fetch('/api/tools');
      if (response.ok) {
        const toolsData: Tool[] = await response.json();
        setTools(toolsData);
      } else {
        console.error('Failed to fetch tools');
      }
    };
    fetchTools();
  }, []);

  const getToolById = (id: string) => tools.find(tool => tool.id === id);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Inventory</h2>
      {inventory.length === 0 ? (
        <p>Your inventory is empty.</p>
      ) : (
        <ul>
          {inventory.map((item) => {
            const tool = getToolById(item.toolId);
            return tool ? (
              <li key={item.toolId} className="mb-2 flex justify-between items-center">
                <span>{tool.name} (Quantity: {item.quantity})</span>
                <div>
                  <span className="mr-4">Hashrate: {tool.hashrate} TH/s</span>
                  <span className="mr-4">Power: {tool.power} W</span>
                  <button
                    onClick={() => removeFromInventory(item.toolId)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ) : null;
          })}
        </ul>
      )}
      <button
        onClick={clearInventory}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
      >
        Clear Inventory
      </button>
    </div>
  );
};

export default InventoryManager;