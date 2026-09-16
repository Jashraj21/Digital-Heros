'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CharityDonationModal } from '@/components/charities/CharityDonationModal';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils/formatters';
import { ROUTES } from '@/constants/routes';
import {
  Heart,
  Calendar,
  MapPin,
  Globe,
  Users,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export default function CharityDetailPage() {
  const params = useParams();
  const [charity, setCharity] = useState(null);
  const [donations, setDonations] = useState([]);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    setIsLoading(true);
    fetch(`/api/charities/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.charity) {
          setCharity(data.charity);
          setDonations(data.donations || []);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading cause profile...</div>;
  }

  if (!charity) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Charity Not Found</h2>
        <Link href={ROUTES.CHARITIES}>
          <Button variant="secondary">Back to Charity Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back button */}
      <Link
        href={ROUTES.CHARITIES}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </Link>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800">
        <div className="h-64 sm:h-80 w-full relative">
          <img src={charity.coverImageUrl} alt={charity.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="p-6 sm:p-10 relative -mt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 p-1 border-2 border-emerald-500/40 shadow-2xl shrink-0 overflow-hidden">
              <img src={charity.logoUrl} alt={charity.name} className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="emerald" size="sm">
                  {charity.category}
                </Badge>
                {charity.featured && (
                  <Badge variant="gold" size="sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured Partner
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">{charity.name}</h1>
              {charity.websiteUrl && (
                <a
                  href={charity.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-emerald-400 mt-1 inline-flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{charity.websiteUrl.replace('https://', '')}</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="gold" size="lg" className="flex-1 sm:flex-initial" onClick={() => setIsDonateModalOpen(true)}>
              <Heart className="w-4 h-4 fill-current" />
              <span>Direct Donate</span>
            </Button>
            <Link href={ROUTES.REGISTER} className="flex-1 sm:flex-initial">
              <Button variant="primary" size="lg" className="w-full">
                Choose for Subscription
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Mission & Events */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mission & Story */}
          <Card className="p-8 space-y-4">
            <h2 className="text-xl font-bold text-white">Mission & Community Impact</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{charity.missionStatement}</p>
            <div className="pt-2 text-xs text-slate-400 leading-relaxed">{charity.description}</div>
          </Card>

          {/* Upcoming Events / Golf Days (§ 08.2) */}
          <Card className="p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Upcoming Charity Golf Days & Events</span>
            </h2>
            <p className="text-xs text-slate-400">
              Join upcoming community tournaments, scrambles, and fundraisers organized by {charity.name}.
            </p>

            {charity.events && charity.events.length > 0 ? (
              <div className="space-y-4 pt-2">
                {charity.events.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="cyan" size="sm">
                          {event.eventType === 'golf_day' ? 'Charity Golf Day' : 'Community Event'}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-400">{formatDate(event.date)}</span>
                      </div>
                      <h4 className="font-bold text-white text-base">{event.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{event.location}</span>
                      </p>
                      <p className="text-xs text-slate-300 mt-2">{event.description}</p>
                    </div>

                    <Button variant="secondary" size="sm" className="shrink-0">
                      Register Interest
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No upcoming events scheduled right now.</p>
            )}
          </Card>
        </div>

        {/* Right Column: Stats & Recent Donors */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 border border-emerald-500/20">
            <h3 className="text-base font-bold text-white">Impact Funding</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400">Total Funds Raised</span>
                <p className="text-3xl font-black text-emerald-400 mt-0.5">
                  {formatCurrency(charity.totalRaised)}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Active Golfer Supporters</span>
                <p className="text-xl font-bold text-white mt-0.5">
                  {formatNumber(charity.supporterCount)} heroes
                </p>
              </div>
            </div>
            <Button
              variant="gold"
              className="w-full mt-2"
              onClick={() => setIsDonateModalOpen(true)}
            >
              Make a Direct Donation
            </Button>
          </Card>

          {/* Recent Direct Donations */}
          <Card className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-white">Recent Hero Donations</h3>
            {donations.length > 0 ? (
              <div className="divide-y divide-slate-800 text-xs">
                {donations.slice(0, 5).map((d) => (
                  <div key={d.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-200 block">{d.donorName}</span>
                      <span className="text-[10px] text-slate-500">{formatDate(d.createdAt)}</span>
                    </div>
                    <span className="font-extrabold text-emerald-400">{formatCurrency(d.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Be the first to make a direct contribution today!</p>
            )}
          </Card>
        </div>
      </div>

      {/* Donate Modal */}
      {isDonateModalOpen && (
        <CharityDonationModal
          isOpen={isDonateModalOpen}
          onClose={() => setIsDonateModalOpen(false)}
          charity={charity}
          onSuccess={(newDonation) => {
            setDonations([newDonation, ...donations]);
            setCharity((prev) => ({
              ...prev,
              totalRaised: prev.totalRaised + newDonation.amount,
            }));
          }}
        />
      )}
    </div>
  );
}
