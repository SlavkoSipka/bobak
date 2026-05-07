import React from 'react';

interface TableProps {
  id: number;
  displayId?: number;
  isReserved: boolean;
}

export function Table({ id, displayId, isReserved }: TableProps) {
  return (
    <div
      className={`
        w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center will-change-transform
        text-xs font-medium
        ${isReserved ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
        text-white
      `}
      style={{ contain: 'layout style paint' }}
    >
      {displayId || id}
    </div>
  );
}