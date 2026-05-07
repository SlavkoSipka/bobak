import React from 'react';
import { Table as TableType } from '../types/table';
import { Table } from './Table';

interface TableGridProps {
  tables: TableType[];
}

export function TableGrid({ tables }: TableGridProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
      {tables.map(table => (
        <Table
          key={table.id}
          id={table.id}
          isReserved={table.isReserved}
        />
      ))}
    </div>
  );
}