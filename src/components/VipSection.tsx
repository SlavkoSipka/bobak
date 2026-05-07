import React from 'react';

interface VipSectionProps {
  side: 'left' | 'right';
}

export function VipSection({ side }: VipSectionProps) {
  return (
    <div className="hidden sm:flex flex-col gap-2">
      <div className={`bg-purple-600 w-16 h-32 rounded-lg shadow-lg flex items-center justify-center ${side === 'left' ? 'rounded-r-none' : 'rounded-l-none'}`}>
        <span className="text-white font-bold text-sm rotate-90">VIP</span>
      </div>
      <div className={`bg-purple-600 w-16 h-32 rounded-lg shadow-lg flex items-center justify-center ${side === 'left' ? 'rounded-r-none' : 'rounded-l-none'}`}>
        <span className="text-white font-bold text-sm rotate-90">VIP</span>
      </div>
    </div>
  );
}