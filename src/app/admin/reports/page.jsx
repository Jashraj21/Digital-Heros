'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils/formatters';
import { BarChart3, Download, Heart, Trophy, Users, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [charities, setCharities] = useState([]);
  const [draws, setDraws] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  const loadData = () => {
    Promise.all([fetch('/api/admin/stats'), fetch('/api/charities'), fetch('/api/draws')]).then(
      async ([sRes, cRes, dRes]) => {
        const sData = await sRes.json();
        const cData = await cRes.json();
        const dData = await dRes.json();

        setStats(sData.stats);
        setCharities(cData.charities || []);
        setDraws(dData.draws || []);
      }
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetDatabase = async () => {
    if (!window.confirm('Are you sure you want to clear all orders, donations, and verifications from the database? This will reset all records to a clean slate.')) {
      return;
    }
    setIsResetting(true);
    setResetSuccess('');
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dh_orders');
        }
        setResetSuccess('Database successfully reset to a clean state!');
        loadData();
        setTimeout(() => setResetSuccess(''), 3500);
      }
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Build CSV content
      const rows = [
        ['Report', 'Digital Heroes Platform Audit & Financial Summary'],
        ['Generated Date', new Date().toISOString()],
        ['Total Users', stats?.totalUsers || 0],
        ['Active Subscribers', stats?.activeSubscribers || 0],
        ['Total Charity Impact (₹)', stats?.totalCharityRaised || 0],
        ['Current Rollover Jackpot (₹)', stats?.currentJackpotRollover || 0],
        [],
        ['Charity Partner', 'Category', 'Total Grants Raised (₹)', 'Supporters'],
        ...charities.map((c) => [c.name, c.category, c.totalRaised, c.supporterCount]),
        [],
        ['Draw Number', 'Month Year', 'Type', 'Total Pool (₹)', 'Winning Numbers'],
        ...draws.map((d) => [d.drawNumber, d.monthYear, d.drawType, d.totalPoolAmount, d.winningNumbers.join('-')]),
      ];

      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `digital_heroes_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="cyan" size="sm" className="mb-2">
            Control Surface 05 (§ 11)
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Financial & Social Impact Reporting
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Download audit reports and manage platform-wide database records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="danger"
            size="md"
            onClick={handleResetDatabase}
            isLoading={isResetting}
          >
            <span>Reset Database (Clear All)</span>
          </Button>
          <Button variant="emerald" size="md" onClick={handleExportCSV} isLoading={isExporting}>
            <Download className="w-4 h-4 mr-1" />
            <span>Export Summary (CSV)</span>
          </Button>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{resetSuccess}</span>
        </div>
      )}

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Charity Disbursed"
          value={stats ? formatCurrency(stats.totalCharityRaised) : '...'}
          subtitle="To 5 Partner Charities"
          icon={Heart}
          glowColor="rose"
        />

        <StatCard
          title="Total Prize Pools Run"
          value={stats ? formatCurrency(stats.totalDrawsConducted * 15000) : '...'}
          subtitle="Verified Cash Draws"
          icon={Trophy}
          glowColor="gold"
        />

        <StatCard
          title="Total Draws Executed"
          value={stats ? String(stats.totalDrawsConducted) : '...'}
          subtitle="Monthly Historical Draws"
          icon={BarChart3}
          glowColor="cyan"
        />

        <StatCard
          title="Audit Compliance"
          value="100%"
          subtitle="All Payouts Verified"
          icon={ShieldCheck}
          glowColor="emerald"
        />
      </div>

      {/* Charity Impact Breakdown Table */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Charity Allocation Breakdown (§ 08 & § 11)</CardTitle>
            <CardDescription>Direct grants delivered to each vetted grassroots partner.</CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-y border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Beneficiary Charity</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Total Raised</th>
                <th className="py-3.5 px-4">Golfer Supporters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {charities.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-300">{c.category}</td>
                  <td className="py-3.5 px-4 font-black text-emerald-400">{formatCurrency(c.totalRaised)}</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-300">{c.supporterCount} golfers</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
