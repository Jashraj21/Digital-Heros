import React from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils/cn';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  glowColor = 'emerald',
  className,
}) {
  const glowStyles = {
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
    cyan: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400',
    gold: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
    purple: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
    rose: 'border-rose-500/20 bg-rose-500/5 text-rose-400',
  };

  return (
    <Card className={cn('flex flex-col justify-between', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-2xl border', glowStyles[glowColor])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {trend && <span className="font-semibold text-emerald-400">{trend}</span>}
        </div>
      )}
    </Card>
  );
}
