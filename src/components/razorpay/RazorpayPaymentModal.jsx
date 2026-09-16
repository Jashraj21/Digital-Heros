'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils/formatters';
import { ShieldCheck, CheckCircle2, CreditCard, Smartphone, Building2, X, Lock, QrCode, Sparkles } from 'lucide-react';

export function RazorpayPaymentModal({ isOpen, onClose, order, name, description, prefill = {}, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState(prefill?.email ? prefill.email.split('@')[0] + '@okhdfcbank' : 'hero.golfer@okhdfcbank');
  const [selectedApp, setSelectedApp] = useState('gpay');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardHolder, setCardHolder] = useState(prefill?.name || 'Hero Golfer');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !order) return null;

  const amountInRupees = order.amount ? order.amount / 100 : 500;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const paymentId = `pay_${Date.now()}`;
      const signature = `sig_${Math.random().toString(36).substring(2, 12)}`;
      setIsProcessing(false);
      if (onSuccess) {
        onSuccess({
          orderId: order.id,
          paymentId,
          signature,
          isSimulated: true,
        });
      }
      onClose();
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0c2340] text-white p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                ₹
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-tight text-white">{name || 'Digital Heroes'}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                    Test Mode
                  </span>
                </div>
                <p className="text-[11px] text-blue-200 mt-0.5">{description || 'Razorpay INR Gateway'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">Amount</span>
                <p className="text-lg font-black text-emerald-400">{formatCurrency(amountInRupees)}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods Bar */}
        <div className="bg-slate-100 p-2 flex gap-1 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedMethod('upi')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              selectedMethod === 'upi' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>UPI / QR</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('card')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              selectedMethod === 'card' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('netbanking')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              selectedMethod === 'netbanking' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>NetBanking</span>
          </button>
        </div>

        {/* Method Details */}
        <div className="p-6 space-y-4">
          {selectedMethod === 'upi' && (
            <div className="space-y-3">
              {/* Quick App Badges */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select UPI App
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'gpay', label: 'Google Pay', icon: '🟢' },
                    { id: 'phonepe', label: 'PhonePe', icon: '🟣' },
                    { id: 'paytm', label: 'Paytm', icon: '🔵' },
                    { id: 'qr', label: 'Scan QR', icon: '⬛' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => {
                        setSelectedApp(app.id);
                        if (app.id === 'gpay') setUpiId('hero@okhdfcbank');
                        if (app.id === 'phonepe') setUpiId('hero@ybl');
                        if (app.id === 'paytm') setUpiId('hero@paytm');
                        if (app.id === 'qr') setUpiId('razorpay.test@icici');
                      }}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        selectedApp === app.id
                          ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm">{app.icon}</span>
                      <span className="text-[10px] font-bold">{app.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Virtual Payment Address (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 font-mono outline-none focus:border-blue-600 transition-colors"
                  placeholder="name@upi"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Test Mode: Auto-approved instant simulation</span>
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 outline-none focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Select Popular Bank
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'Yes Bank'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBank(b)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all ${
                      selectedBank === b
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePay}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0c2340] hover:bg-[#13335a] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Test Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Pay {formatCurrency(amountInRupees)} Securely</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Cancel Payment
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>256-bit Encrypted • Razorpay Certified Payment Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}
