'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ScoreInputForm } from '@/components/scores/ScoreInputForm';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';
import { Users, Target, Search, Edit2, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userScores, setUserScores] = useState({ activeScores: [], archivedScores: [] });
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = () => {
    setIsLoading(true);
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInspectUserScores = async (user) => {
    setSelectedUser(user);
    const res = await fetch(`/api/scores?userId=${user.id}`);
    const data = await res.json();
    setUserScores(data);
  };

  const handleSaveScore = async (scoreInput) => {
    if (!selectedUser) return;
    if (editingScore) {
      await fetch('/api/scores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, scoreId: editingScore.id, ...scoreInput }),
      });
    } else {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, ...scoreInput }),
      });
    }
    setIsScoreModalOpen(false);
    setEditingScore(null);
    handleInspectUserScores(selectedUser);
    fetchUsers();
  };

  const handleDeleteScore = async (scoreId) => {
    if (!confirm('Are you sure you want to delete this score?')) return;
    await fetch(`/api/scores?userId=${selectedUser.id}&scoreId=${scoreId}`, { method: 'DELETE' });
    handleInspectUserScores(selectedUser);
    fetchUsers();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="cyan" size="sm" className="mb-2">
          Control Surface 01 (§ 11)
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          User & Score Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Inspect golfer profiles, edit Stableford rounds, and manage subscription statuses (PRD § 11).
        </p>
      </div>

      {/* Search Input */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by golfer name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-cyan-400"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold">{filteredUsers.length} Users</span>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-y border-slate-800">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Subscription</th>
                <th className="py-3.5 px-4">Selected Cause</th>
                <th className="py-3.5 px-4">Active Scores</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{u.fullName}</div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.role === 'admin' ? 'cyan' : 'default'} size="sm">
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.subscription?.status === 'active' ? 'emerald' : 'rose'} size="sm">
                      {u.subscription?.status || 'inactive'} ({u.subscription?.plan || 'none'})
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-300">
                    <div>{u.selectedCharity}</div>
                    <span className="text-emerald-400 text-[11px]">{u.charityPercentage}% allocation</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.scoresCount === 5 ? 'emerald' : 'gold'} size="sm">
                      {u.scoresCount}/5 Entered
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="secondary" size="sm" onClick={() => handleInspectUserScores(u)}>
                      <Target className="w-3.5 h-3.5 mr-1" />
                      <span>Inspect Scores</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect & Edit User Scores Modal (§ 11: Edit golf scores) */}
      {selectedUser && (
        <Modal
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          title={`Scores for ${selectedUser.fullName}`}
          description="PRD § 11: Full admin authority to view, edit, or remove golfer scores."
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">
                Active 5-Score Rolling Window
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setEditingScore(null);
                  setIsScoreModalOpen(true);
                }}
              >
                + Add Score for User
              </Button>
            </div>

            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 overflow-hidden">
              {userScores.activeScores.map((score, index) => (
                <div key={score.id} className="p-3.5 flex items-center justify-between bg-slate-900/60 text-xs">
                  <div className="flex items-center gap-3">
                    <Badge variant="emerald" size="sm">
                      Slot #{index + 1}
                    </Badge>
                    <span className="font-extrabold text-white text-sm">{score.score} pts</span>
                    <span className="text-slate-400">{formatDate(score.playedAt)}</span>
                    <span className="text-slate-500 font-medium">{score.courseName}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingScore(score);
                        setIsScoreModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteScore(score.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Form Modal */}
      {isScoreModalOpen && (
        <Modal
          isOpen={isScoreModalOpen}
          onClose={() => setIsScoreModalOpen(false)}
          title={editingScore ? 'Edit Score' : 'Add Score for User'}
        >
          <ScoreInputForm
            initialValues={editingScore}
            onSubmit={handleSaveScore}
            onCancel={() => setIsScoreModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
