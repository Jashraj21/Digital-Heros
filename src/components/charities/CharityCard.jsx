'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { HeartHandshake, Calendar, Users, ArrowUpRight, Sparkles } from 'lucide-react';

export function CharityCard({ charity, onSelect, isSelected = false, onOpenDonateModal }) {
  const upcomingEvent = charity.events && charity.events.length > 0 ? charity.events[0] : null;

  return (
    <Card className="flex flex-col justify-between group overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all p-0">
      {/* Cover Image & Category */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img
          src={charity.coverImageUrl}
          alt={charity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge variant="emerald" size="sm" className="backdrop-blur-md">
            {charity.category}
          </Badge>
          {charity.featured && (
            <Badge variant="gold" size="sm" className="backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Charity Logo */}
        <div className="absolute -bottom-4 left-5 w-14 h-14 rounded-2xl bg-slate-900 p-1 border-2 border-emerald-500/40 shadow-xl overflow-hidden">
          <img src={charity.logoUrl} alt={charity.name} className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-7 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
            {charity.name}
          </h3>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {charity.missionStatement || charity.description}
          </p>

          {/* Upcoming Event Tag */}
          {upcomingEvent && (
            <div className="mt-4 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs flex items-center gap-2 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate font-medium">{upcomingEvent.title}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 block">Total Raised</span>
            <span className="font-extrabold text-white text-sm">{formatCurrency(charity.totalRaised)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Supporters</span>
            <span className="font-extrabold text-slate-200 text-sm">{formatNumber(charity.supporterCount)} heroes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 flex items-center gap-2">
          {onSelect ? (
            <Button
              variant={isSelected ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onSelect(charity)}
              className="flex-1"
            >
              {isSelected ? 'Selected Cause ✓' : 'Select for Subscription'}
            </Button>
          ) : (
            <Link href={`/charities/${charity.slug || charity.id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                <span>View Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          )}

          {onOpenDonateModal && (
            <Button variant="gold" size="sm" onClick={() => onOpenDonateModal(charity)}>
              Direct Donate
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
