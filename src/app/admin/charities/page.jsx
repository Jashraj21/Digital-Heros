'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { CHARITY_CATEGORIES } from '@/constants/charities';
import { Heart, Plus, Edit2, Trash2, Calendar, Sparkles } from 'lucide-react';

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Youth & Grassroots');
  const [description, setDescription] = useState('');
  const [missionStatement, setMissionStatement] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  const fetchCharities = () => {
    fetch('/api/charities')
      .then((res) => res.json())
      .then((data) => {
        if (data.charities) setCharities(data.charities);
      });
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const openAddModal = () => {
    setEditingCharity(null);
    setName('');
    setCategory('Youth & Grassroots');
    setDescription('');
    setMissionStatement('');
    setLogoUrl('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=200&auto=format&fit=crop&q=80');
    setCoverImageUrl('https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=1200&auto=format&fit=crop&q=80');
    setFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (charity) => {
    setEditingCharity(charity);
    setName(charity.name);
    setCategory(charity.category);
    setDescription(charity.description);
    setMissionStatement(charity.missionStatement);
    setLogoUrl(charity.logoUrl);
    setCoverImageUrl(charity.coverImageUrl);
    setFeatured(charity.featured);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingCharity) {
      await fetch(`/api/charities/${editingCharity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          description,
          missionStatement,
          logoUrl,
          coverImageUrl,
          featured,
        }),
      });
    } else {
      await fetch('/api/charities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          description,
          missionStatement,
          logoUrl,
          coverImageUrl,
          featured,
        }),
      });
    }

    setIsModalOpen(false);
    fetchCharities();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this charity?')) return;
    await fetch(`/api/charities/${id}`, { method: 'DELETE' });
    fetchCharities();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="rose" size="sm" className="mb-2">
            Control Surface 03 (§ 11)
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Charity & Event Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add, update, or remove vetted partner organisations, mission profiles, and upcoming charity golf days (PRD
            § 11).
          </p>
        </div>

        <Button variant="primary" size="md" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-1" />
          <span>Add New Charity</span>
        </Button>
      </div>

      {/* Charities List Card */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-y border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Charity Organisation</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Total Raised</th>
                <th className="py-3.5 px-4">Supporters</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {charities.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={c.logoUrl} alt={c.name} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{c.missionStatement}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-300">{c.category}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-400">{formatCurrency(c.totalRaised)}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-300">{formatNumber(c.supporterCount)} golfers</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={c.featured ? 'gold' : 'default'} size="sm">
                      {c.featured ? 'Featured' : 'Active'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800"
                        title="Edit Charity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                        title="Delete Charity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Charity Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCharity ? 'Edit Charity Partner' : 'Add New Charity Partner'}
        description="PRD § 08 & § 11: Configure beneficiary details and impact storytelling."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Charity Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fairways for Youth"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
              >
                {CHARITY_CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <label htmlFor="featuredCheck" className="text-xs font-bold text-slate-300 cursor-pointer">
                Spotlight on Homepage (§ 08.2)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Mission Statement (Short Impact Hook)
            </label>
            <input
              type="text"
              required
              value={missionStatement}
              onChange={(e) => setMissionStatement(e.target.value)}
              placeholder="e.g. Breaking down economic barriers to open golf to thousands of underprivileged youth."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Full Description & Story
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe ongoing projects, community equipment grants, and life skill coaching..."
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Logo URL</label>
              <input
                type="url"
                required
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Cover Photo URL
              </label>
              <input
                type="url"
                required
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCharity ? 'Update Charity' : 'Create Charity Listing'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
