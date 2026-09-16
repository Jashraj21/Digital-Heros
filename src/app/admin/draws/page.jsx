'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LotteryBalls } from '@/components/draws/LotteryBalls';
import { DrawSimulatorModal } from '@/components/draws/DrawSimulatorModal';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Sparkles, Dices, BrainCircuit, Zap, CheckCircle2, History } from 'lucide-react';

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState([]);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDraws = () => {
    setIsLoading(true);
    fetch('/api/draws')
      .then((res) => res.json())
      .then((data) => {
        if (data.draws) setDraws(data.draws);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="emerald" size="sm" className="mb-2">
            Control Surface 02 (§ 11)
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Draw Engine & Prize Allocation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure draw mechanics, execute pre-publish simulations, manage rollover jackpots, and publish monthly
            results.
          </p>
        </div>

        <Button variant="cyan" size="md" onClick={() => setIsSimulatorOpen(true)}>
          <Sparkles className="w-4 h-4 mr-1" />
          <span>Launch Draw Simulation</span>
        </Button>
      </div>

      {/* Published Draws List */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Conducted & Published Draws History</CardTitle>
            <CardDescription>
              Review all historical draws, winning numbers, tier allocations, and rollover carry-forwards.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="space-y-6 p-6 pt-0">
          {draws.map((draw) => (
            <div
              key={draw.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-lg">
                      Draw #{draw.drawNumber} — {draw.monthYear}
                    </h3>
                    <Badge variant={draw.drawType === 'algorithmic' ? 'cyan' : 'emerald'} size="sm">
                      {draw.drawType.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400">
                    Conducted: {formatDate(draw.drawDate)} · {draw.subscribersCount} active participants
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase block">Total Effective Pool</span>
                  <span className="text-xl font-black text-emerald-400">
                    {formatCurrency(draw.totalPoolAmount)}
                  </span>
                </div>
              </div>

              {/* Winning Numbers */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Winning Numbers</span>
                <LotteryBalls numbers={draw.winningNumbers} size="md" showLabels={true} />
              </div>

              {/* Tier Breakdown Table (§ 07) */}
              {draw.tierSummaries && (
                <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Tier</th>
                        <th className="py-2.5 px-3">Share</th>
                        <th className="py-2.5 px-3">Tier Pool</th>
                        <th className="py-2.5 px-3">Winners</th>
                        <th className="py-2.5 px-3">Payout / Winner</th>
                        <th className="py-2.5 px-3 text-right">Rollover Carry</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {Object.values(draw.tierSummaries).map((tier) => (
                        <tr key={tier.tier} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-bold text-white">{tier.label}</td>
                          <td className="py-2.5 px-3 text-slate-300">{tier.sharePercentage}%</td>
                          <td className="py-2.5 px-3 font-semibold text-white">{formatCurrency(tier.totalTierPool)}</td>
                          <td className="py-2.5 px-3">
                            <Badge variant={tier.winnerCount > 0 ? 'emerald' : 'default'} size="sm">
                              {tier.winnerCount} winner{tier.winnerCount !== 1 ? 's' : ''}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-400">
                            {tier.winnerCount > 0 ? formatCurrency(tier.payoutPerWinner) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                            {tier.carriedForward > 0 ? formatCurrency(tier.carriedForward) : 'None'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Simulator Modal */}
      <DrawSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onPublishSuccess={() => fetchDraws()}
      />
    </div>
  );
}
