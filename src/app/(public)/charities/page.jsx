'use client';

import React, { useState, useEffect } from 'react';
import { CharityCard } from '@/components/charities/CharityCard';
import { CharityDonationModal } from '@/components/charities/CharityDonationModal';
import { Badge } from '@/components/ui/Badge';
import { CHARITY_CATEGORIES } from '@/constants/charities';
import { Search, Heart, Sparkles, Filter } from 'lucide-react';

export default function CharitiesPage() {
  const [charities, setCharities] = useState([]);
  const [category, setCategory] = useState('All Categories');
  const [search, setSearch] = useState('');
  const [selectedCharityForDonation, setSelectedCharityForDonation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (category && category !== 'All Categories') params.set('category', category);
    if (search) params.set('search', search);

    fetch(`/api/charities?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.charities) setCharities(data.charities);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="emerald" size="md">
          Charity Directory (§ 08.2)
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Vetted Grassroots Charities
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Every subscription fee directly powers these accredited organisations. Explore their missions, upcoming
          charity golf days, and support them with your monthly play or direct donations.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search causes or keywords..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {CHARITY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Charities Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400">Loading directory...</div>
      ) : charities.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          No charities match your search query. Try another term or category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {charities.map((charity) => (
            <CharityCard
              key={charity.id}
              charity={charity}
              onOpenDonateModal={(c) => setSelectedCharityForDonation(c)}
            />
          ))}
        </div>
      )}

      {/* Direct Donation Modal */}
      {selectedCharityForDonation && (
        <CharityDonationModal
          isOpen={Boolean(selectedCharityForDonation)}
          onClose={() => setSelectedCharityForDonation(null)}
          charity={selectedCharityForDonation}
        />
      )}
    </div>
  );
}
