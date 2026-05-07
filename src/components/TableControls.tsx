import React, { useState } from 'react';
import { Table } from '../types/table';

interface TableControlsProps {
  tables: Table[];
  setTables: (tables: Table[]) => void;
}

export function TableControls({ tables, setTables }: TableControlsProps) {
  const [selectedId, setSelectedId] = useState<string>('');

  const handleReserveTable = (reserve: boolean) => {
    const id = parseInt(selectedId);
    if (!id || isNaN(id)) return;

    setTables(
      tables.map(table =>
        table.id === id ? { ...table, isReserved: reserve } : table
      )
    );
    setSelectedId('');
  };

  const handleResetAll = () => {
    setTables(tables.map(table => ({ ...table, isReserved: false })));
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md p-6 bg-white rounded-lg shadow-lg mb-8">
      <div className="flex gap-4">
        <input
          type="number"
          min="1"
          max="35"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          placeholder="Table ID (1-35)"
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={() => handleReserveTable(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Reserve
        </button>
        <button
          onClick={() => handleReserveTable(false)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Free
        </button>
      </div>
      <button
        onClick={handleResetAll}
        className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Reset All Tables
      </button>
    </div>
  );
}