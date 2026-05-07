import React from 'react';
import { Table as TableType } from '../types/table';
import { Table } from './Table';

interface SmallTableGridProps {
  tables: TableType[];
}

export function SmallTableGrid({ tables }: SmallTableGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
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