import React from 'react';
import { Table as TableType } from '../types/table';
import { Table } from './Table';

interface BarSectionProps {
  tables: TableType[];
}

export function BarSection({ tables }: BarSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#4a4a4a] p-3 rounded-lg">
        <h2 className="text-xl text-white text-center font-bold">ŠANK</h2>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="grid grid-cols-3 gap-4">
          {tables.map(table => (
            <Table
              key={table.id}
              id={table.id}
              isReserved={table.isReserved}
            />
          ))}
        </div>
      </div>
    </div>
  );
}