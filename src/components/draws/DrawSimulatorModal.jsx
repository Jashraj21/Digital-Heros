'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LotteryBalls } from './LotteryBalls';
import { formatCurrency } from '@/lib/utils/formatters';
import { DRAW_TYPES, PRIZE_TIERS } from '@/constants/draw';
import { Sparkles, Dices, BrainCircuit, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function DrawSimulatorModal({ isOpen, onClose, onPublishSuccess }) {
  const [drawType, setDrawType] = useState(DRAW_TYPES.RANDOM);
  const [monthlyPrizePool, setMonthlyPrizePool] = useState(150000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const runSimulation = async () => {
    setIsSimulating(true);
    setStatusMessage('');
    try {
      const res = await fetch('/api/draws/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drawType,
          monthlyPrizePool: Number(monthlyPrizePool),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Simulation failed');
      setSimulationResult(data.simulation);
    } catch (err) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePublish = async () => {
    if (!simulationResult) return;
    setIsPublishing(true);
    try {
      const res = await fetch('/api/draws/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drawType: simulationResult.drawType,
          monthlyPrizePool: simulationResult.totalFreshPool,
          winningNumbers: simulationResult.winningNumbers,
          monthYear: 'April 2026',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish draw');

      if (onPublishSuccess) onPublishSuccess(data.draw);
      onClose();
    } catch (err) {
      setStatusMessage(`Publish Error: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Draw Engine: Pre-Publish Simulation (§ 06)"
      description="Configure draw logic, execute Monte Carlo / score-weighted simulations, and preview prize tier splits before publishing official results."
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          {/* Draw Logic Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Draw Logic Mechanism
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDrawType(DRAW_TYPES.RANDOM)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  drawType === DRAW_TYPES.RANDOM
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Dices className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">Random</span>
                </div>
                <p className="text-[11px] font-normal opacity-80">Uniform lottery RNG</p>
              </button>

              <button
                type="button"
                onClick={() => setDrawType(DRAW_TYPES.ALGORITHMIC)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  drawType === DRAW_TYPES.ALGORITHMIC
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 font-bold'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BrainCircuit className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">Algorithmic</span>
                </div>
                <p className="text-[11px] font-normal opacity-80">Score frequency-weighted</p>
              </button>
            </div>
          </div>

          {/* Monthly Fresh Prize Pool Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Fresh Monthly Prize Pool (₹)
            </label>
            <input
              type="number"
              step="5000"
              value={monthlyPrizePool}
              onChange={(e) => setMonthlyPrizePool(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl text-white font-bold text-lg outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Auto-calculated from active subscriber fees (e.g. ₹999.50/subscriber).
            </p>
          </div>
        </div>

        {/* Run Simulation Trigger */}
        <div className="flex justify-center">
          <Button
            variant="cyan"
            size="lg"
            onClick={runSimulation}
            isLoading={isSimulating}
            className="w-full sm:w-auto"
          >
            <Sparkles className="w-5 h-5" />
            <span>Execute Simulation Run</span>
          </Button>
        </div>

        {statusMessage && <p className="text-center text-xs text-rose-400">{statusMessage}</p>}

        {/* Simulation Results Section */}
        {simulationResult && (
          <div className="space-y-6 pt-4 border-t border-slate-800 animate-in fade-in duration-300">
            {/* Generated Winning Balls */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Simulated Winning Numbers
              </span>
              <LotteryBalls numbers={simulationResult.winningNumbers} size="lg" showLabels={true} />
            </div>

            {/* Financial Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Eligible Entries</p>
                <p className="text-lg font-black text-white mt-1">{simulationResult.eligibleEntriesCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Rollover In</p>
                <p className="text-lg font-black text-amber-400 mt-1">
                  {formatCurrency(simulationResult.jackpotBroughtForward)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Prize Pool</p>
                <p className="text-lg font-black text-emerald-400 mt-1">
                  {formatCurrency(simulationResult.totalEffectivePool)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Rollover Out</p>
                <p className="text-lg font-black text-amber-400 mt-1">
                  {formatCurrency(simulationResult.jackpotCarriedForward)}
                </p>
              </div>
            </div>

            {/* Tier Splits Breakdown Table (§ 07) */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3">Share</th>
                    <th className="py-2.5 px-3">Tier Pool</th>
                    <th className="py-2.5 px-3">Winners</th>
                    <th className="py-2.5 px-3 text-right">Payout / Winner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {Object.values(simulationResult.tierSummaries).map((tier) => (
                    <tr key={tier.tier} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold text-white">{tier.label}</td>
                      <td className="py-2.5 px-3 text-slate-300">{tier.sharePercentage}%</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{formatCurrency(tier.totalTierPool)}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={tier.winnerCount > 0 ? 'emerald' : 'default'} size="sm">
                          {tier.winnerCount} winner{tier.winnerCount !== 1 ? 's' : ''}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                        {tier.winnerCount > 0 ? formatCurrency(tier.payoutPerWinner) : 'Rollover'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Publish Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                <span>Simulated result ready. Publishing will assign prizes and open verification queue.</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button variant="ghost" onClick={onClose} disabled={isPublishing}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handlePublish} isLoading={isPublishing}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Official Draw</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
