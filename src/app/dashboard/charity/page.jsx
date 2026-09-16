'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CharityPreferenceSlider } from '@/components/charities/CharityPreferenceSlider';
import { CharityDonationModal } from '@/components/charities/CharityDonationModal';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Heart, Check, Sparkles, Building2, Gift, CheckCircle2 } from 'lucide-react';

export default function MyCharityPage() {
  const { user, subscription } = useAuth();
  const [preferenceData, setPreferenceData] = useState(null);
  const [charities, setCharities] = useState([]);
  const [selectedCharityId, setSelectedCharityId] = useState('');
  const [percentage, setPercentage] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [selectedCharityForDirectDonate, setSelectedCharityForDirectDonate] = useState(null);

  const fetchCharityData = async () => {
    if (!user) return;
    try {
      const [prefRes, charitiesRes] = await Promise.all([
        fetch(`/api/charities/preference?userId=${user.id}`),
        fetch('/api/charities'),
      ]);
      const prefData = await prefRes.json();
      const charitiesData = await charitiesRes.json();

      setPreferenceData(prefData);
      setCharities(charitiesData.charities || []);
      if (prefData.preference) {
        setSelectedCharityId(prefData.preference.charityId);
        setPercentage(prefData.preference.contributionPercentage);
      } else if (charitiesData.charities?.length > 0) {
        setSelectedCharityId(charitiesData.charities[0].id);
      }
    } catch (e) {
      console.error('Error fetching charity data:', e);
    }
  };

  useEffect(() => {
    fetchCharityData();
  }, [user]);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setSaveSuccessMessage('');
    try {
      const res = await fetch('/api/charities/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          charityId: selectedCharityId,
          contributionPercentage: percentage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update preferences');

      setSaveSuccessMessage('Charity preferences updated successfully! ✓');
      fetchCharityData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const currentSelectedCharity = charities.find((c) => c.id === selectedCharityId) || preferenceData?.charity;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="rose" size="sm" className="mb-2">
          Charity System (§ 08)
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          My Charitable Giving & Impact
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Every month, a ring-fenced percentage of your subscription fee directly funds your chosen grassroots cause.
        </p>
      </div>

      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Interactive Contribution Percentage Slider (§ 08.1) */}
      <CharityPreferenceSlider
        charity={currentSelectedCharity}
        percentage={percentage}
        onChangePercentage={(newPct) => setPercentage(newPct)}
        subscriptionAmount={subscription?.priceAmount || 25.0}
        planInterval={subscription?.plan === 'yearly' ? 'year' : 'month'}
      />

      {/* Select Charity Recipient Grid (§ 08.1) */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Change Your Beneficiary Charity</CardTitle>
            <CardDescription>
              Select any accredited partner organisation to receive your subscription allocation.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {charities.map((charity) => {
            const isSelected = selectedCharityId === charity.id;

            return (
              <div
                key={charity.id}
                onClick={() => setSelectedCharityId(charity.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={charity.logoUrl} alt={charity.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{charity.name}</h4>
                    <span className="text-[11px] text-slate-400 block">{charity.category}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-0.5 block">
                      {formatCurrency(charity.totalRaised)} raised so far
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 hover:text-white">Select</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <div className="pt-6 mt-6 border-t border-slate-800 flex justify-end gap-3">
          <Button
            variant="gold"
            size="md"
            onClick={() => setSelectedCharityForDirectDonate(currentSelectedCharity)}
          >
            <Gift className="w-4 h-4 mr-1" />
            Make One-Off Direct Donation
          </Button>
          <Button variant="primary" size="md" onClick={handleSavePreferences} isLoading={isSaving}>
            Save Giving Preferences
          </Button>
        </div>
      </Card>

      {/* Personal Impact History */}
      {preferenceData?.userDonations && preferenceData.userDonations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Direct Donations History (§ 08.1)</CardTitle>
          </CardHeader>
          <div className="divide-y divide-slate-800 text-xs">
            {preferenceData.userDonations.map((d) => (
              <div key={d.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Direct Contribution</span>
                  <span className="text-slate-400">{formatDate(d.createdAt)}</span>
                </div>
                <span className="font-extrabold text-emerald-400 text-sm">{formatCurrency(d.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Direct Donate Modal */}
      {selectedCharityForDirectDonate && (
        <CharityDonationModal
          isOpen={Boolean(selectedCharityForDirectDonate)}
          onClose={() => setSelectedCharityForDirectDonate(null)}
          charity={selectedCharityForDirectDonate}
          onSuccess={() => fetchCharityData()}
        />
      )}
    </div>
  );
}
