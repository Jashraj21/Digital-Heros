'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { RollingScoreVisualizer } from '@/components/scores/RollingScoreVisualizer';
import { ScoreHistoryTable } from '@/components/scores/ScoreHistoryTable';
import { ScoreInputForm } from '@/components/scores/ScoreInputForm';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Target, Info, Sparkles } from 'lucide-react';

export default function MyScoresPage() {
  const { user } = useAuth();
  const [scoresData, setScoresData] = useState({ activeScores: [], archivedScores: [], metrics: {} });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const fetchScores = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/scores?userId=${user.id}`);
      const data = await res.json();
      setScoresData(data);
    } catch (e) {
      console.error('Error fetching scores:', e);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [user]);

  const handleSaveScore = async (scoreInput) => {
    setIsSubmitting(true);
    try {
      if (editingScore) {
        const res = await fetch('/api/scores', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            scoreId: editingScore.id,
            ...scoreInput,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update score');
      } else {
        const res = await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            ...scoreInput,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add score');
      }

      setIsAddModalOpen(false);
      setEditingScore(null);
      fetchScores();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteScore = async (scoreId) => {
    if (!confirm('Are you sure you want to delete this score entry?')) return;
    setIsDeletingId(scoreId);
    try {
      const res = await fetch(`/api/scores?userId=${user.id}&scoreId=${scoreId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete score');
      fetchScores();
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Badge variant="emerald" size="sm" className="mb-2">
          Score Management (§ 05)
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Stableford Scores & Rolling Set
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Maintain your 5 rolling Stableford scores. The latest 5 dated rounds automatically represent your numbers in
          the monthly prize draws.
        </p>
      </div>

      {/* 5-Score Rolling Visualizer (§ 05) */}
      <RollingScoreVisualizer
        activeScores={scoresData.activeScores}
        metrics={scoresData.metrics}
        onOpenAddModal={() => {
          setEditingScore(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Score History & Archives */}
      <ScoreHistoryTable
        activeScores={scoresData.activeScores}
        archivedScores={scoresData.archivedScores}
        onEdit={(score) => {
          setEditingScore(score);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteScore}
        isDeletingId={isDeletingId}
      />

      {/* Add / Edit Score Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingScore(null);
        }}
        title={editingScore ? 'Edit Score Entry (§ 05)' : 'Log Stableford Score (§ 05)'}
        description="Enter whole score between 1 and 45 with round date. Duplicate dates are prevented."
      >
        <ScoreInputForm
          initialValues={editingScore}
          onSubmit={handleSaveScore}
          onCancel={() => {
            setIsAddModalOpen(false);
            setEditingScore(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}
