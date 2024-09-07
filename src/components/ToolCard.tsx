import React from 'react';
import Image from 'next/image';
import { Tool } from '../types';
import { useInventoryContext } from '../contexts/InventoryContext';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { addToInventory } = useInventoryContext();

  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col">
      <h2 className="text-xl font-bold mb-2">{tool.name}</h2>
      <div className="relative w-full h-48 mb-2">
        <Image
          src={tool.imageUrl}
          alt={tool.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>
      <p className="mb-1">Hashrate: {tool.hashrate} TH/s</p>
      <p className="mb-1">Monthly Power Bill: ${tool.monthlyPowerBill}</p>
      <p className="mb-1">Skill: {tool.skill}</p>
      <p className="mb-1">Class: {tool.class}</p>
      <p className="mb-2">Rarity: {tool.rarity}</p>
      <button
        onClick={() => addToInventory(tool)}
        className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add to Inventory
      </button>
    </div>
  );
};

export default ToolCard;