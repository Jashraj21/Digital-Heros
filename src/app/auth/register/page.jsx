'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import { Trophy, Heart, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

export default function RegisterPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [step, setStep] = useState(1); // 1: Info, 2: Charity & Plan
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('monthly');
  const [charities, setCharities] = useState([]);
  const [selectedCharityId, setSelectedCharityId] = useState('charity-1');
  const [contributionPercentage, setContributionPercentage] = useState(15);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/charities')
      .then((res) => res.json())
      .then((data) => {
        if (data.charities && data.charities.length > 0) {
          setCharities(data.charities);
          setSelectedCharityId(data.charities[0].id);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await signup({
        fullName,
        email,
        password,
        phone,
        plan,
        charityId: selectedCharityId,
        contributionPercentage,
      });
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white">
              DIGITAL<span className="text-emerald-400">HEROES</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-white">Become a Digital Hero</h2>
          <p className="text-xs text-slate-400">
            Step {step} of 2 — {step === 1 ? 'Your Account Details' : 'Select Charity & Membership Plan'}
          </p>
        </div>

        <Card className="p-6 sm:p-8 border border-slate-800">
          <form onSubmit={handleRegister} className="space-y-6">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <SocialLoginButtons onError={(err) => setErrorMessage(err)} />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="James MacIntyre"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@example.com"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7700 900123"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-4"
                  onClick={() => {
                    if (!fullName || !email || !password) {
                      setErrorMessage('Please fill in name, email, and password.');
                      return;
                    }
                    setErrorMessage('');
                    setStep(2);
                  }}
                >
                  <span>Continue to Charity Selection</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* STEP 2: Charity & Plan Selection (§ 04 & § 08.1) */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in">
                {/* Membership Plan Choice */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Select Plan
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPlan('monthly')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        plan === 'monthly'
                          ? 'border-emerald-500 bg-emerald-500/20 text-white shadow-md'
                          : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">Monthly Hero</span>
                      <span className="text-lg font-black text-emerald-400">₹1,999.00/mo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlan('yearly')}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                        plan === 'yearly'
                          ? 'border-amber-500 bg-amber-500/20 text-white shadow-md'
                          : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Badge variant="gold" size="sm" className="absolute -top-2 right-2">
                        Save 17%
                      </Badge>
                      <span className="text-xs font-bold block">Annual Champion</span>
                      <span className="text-lg font-black text-amber-400">₹19,999.00/yr</span>
                    </button>
                  </div>
                </div>

                {/* Charity Selection (§ 08.1) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Choose Your Grassroots Charity Recipient (§ 08.1)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {charities.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCharityId(c.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedCharityId === c.id
                            ? 'border-emerald-500 bg-emerald-500/15 text-white'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={c.logoUrl} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-xs block">{c.name}</span>
                            <span className="text-[10px] text-slate-400">{c.category}</span>
                          </div>
                        </div>
                        {selectedCharityId === c.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contribution Slider (§ 08.1: Minimum 10%, user may voluntarily increase) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Charity Contribution Level (Min 10%)
                    </label>
                    <span className="text-base font-black text-emerald-400">{contributionPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={contributionPercentage}
                    onChange={(e) => setContributionPercentage(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg accent-emerald-400 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {plan === 'yearly'
                      ? `₹${((19999 * contributionPercentage) / 100).toFixed(2)}/year will directly fund this cause.`
                      : `₹${((1999 * contributionPercentage) / 100).toFixed(2)}/month will directly fund this cause.`}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="ghost" size="md" onClick={() => setStep(1)} disabled={isLoading}>
                    Back
                  </Button>
                  <Button variant="primary" type="submit" size="lg" className="flex-1" isLoading={isLoading}>
                    <span>Complete Membership Setup</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link href={ROUTES.LOGIN} className="font-bold text-emerald-400 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
