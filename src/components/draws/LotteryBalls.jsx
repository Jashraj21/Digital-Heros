'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export function LotteryBalls({
  numbers = [],
  matchedNumbers = [],
  size = 'md',
  showLabels = false,
  className,
}) {
  const matchedSet = new Set((matchedNumbers || []).map(Number));

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs font-bold',
    md: 'w-11 h-11 text-sm font-extrabold',
    lg: 'w-14 h-14 text-lg font-black shadow-lg',
    xl: 'w-16 h-16 text-2xl font-black shadow-xl',
  };

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-2 sm:gap-3', className)}>
      {numbers.map((num, idx) => {
        const isMatched = matchedSet.has(Number(num));

        return (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={cn(
                'rounded-full flex items-center justify-center transition-all duration-300 select-none relative',
                sizeClasses[size],
                isMatched
                  ? 'bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 text-slate-950 ring-4 ring-amber-400/40 shadow-glow-gold scale-105'
                  : 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white border border-white/20 shadow-glow'
              )}
            >
              {num}
              {isMatched && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
            {showLabels && (
              <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase">
                {isMatched ? 'MATCH' : `Ball ${idx + 1}`}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
