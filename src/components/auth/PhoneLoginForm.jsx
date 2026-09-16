'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import { Smartphone, KeyRound, ArrowRight, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';

export function PhoneLoginForm({ onError, mode = 'login' }) {
  const router = useRouter();
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();

  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const fullPhoneNumber = `${countryCode} ${phoneNumber.trim()}`;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 7) {
      if (onError) onError('Please enter a valid mobile phone number.');
      return;
    }
    if (onError) onError('');
    setIsLoading(true);

    try {
      const res = await sendPhoneOtp(fullPhoneNumber);
      setStep('otp');
      setInfoMessage(`Verification code sent to ${fullPhoneNumber}. (Demo OTP: 123456)`);
    } catch (err) {
      if (onError) onError(err.message || 'Failed to send OTP to mobile number');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      if (onError) onError('Please enter the 6-digit OTP code.');
      return;
    }
    if (onError) onError('');
    setIsLoading(true);

    try {
      const user = await verifyPhoneOtp(fullPhoneNumber, otpCode.trim(), fullName);
      if (user.role === 'admin') {
        router.push(ROUTES.ADMIN);
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    } catch (err) {
      if (onError) onError(err.message || 'Invalid or expired OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {infoMessage && step === 'otp' && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{infoMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setOtpCode('123456')}
            className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded-lg transition-all"
          >
            Auto Fill OTP
          </button>
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tiger Woods"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Mobile Phone Number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-semibold outline-none focus:border-emerald-400"
              >
                <option value="+91">🇮🇳 +91 (IN)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+1">🇺🇸 +1 (US)</option>
                <option value="+61">🇦🇺 +61 (AU)</option>
                <option value="+971">🇦🇪 +971 (UAE)</option>
                <option value="+65">🇸🇬 +65 (SG)</option>
              </select>

              <div className="relative flex-1">
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full px-4 py-2.5 pl-9 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-mono outline-none focus:border-emerald-400"
                />
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>We will send a 6-digit SMS verification code to your number</span>
            </p>
          </div>

          <Button variant="primary" type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
            <span>Send Verification OTP</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Enter 6-Digit OTP Code
              </label>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Change Number</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full px-4 py-3 pl-10 bg-slate-900 border border-emerald-500/50 rounded-xl text-white text-lg font-mono tracking-widest text-center outline-none focus:border-emerald-400"
              />
              <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 text-center">
              Enter the code sent to <strong className="text-white">{fullPhoneNumber}</strong>
            </p>
          </div>

          <Button variant="primary" type="submit" size="lg" className="w-full" isLoading={isLoading}>
            <span>Verify & Enter Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      )}
    </div>
  );
}
