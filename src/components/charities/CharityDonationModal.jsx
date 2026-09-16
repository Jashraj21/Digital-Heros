'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatters';
import { triggerRazorpayCheckout } from '@/lib/razorpay/client';
import { RazorpayPaymentModal } from '@/components/razorpay/RazorpayPaymentModal';
import { Heart, CheckCircle2, AlertCircle, ShieldCheck, CreditCard } from 'lucide-react';

export function CharityDonationModal({ isOpen, onClose, charity, onSuccess }) {
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [activeRzpOrder, setActiveRzpOrder] = useState(null);

  const quickAmounts = [250, 500, 1000, 2500];
  const finalAmount = customAmount ? Number(customAmount) : amount;

  const verifyAndCompleteDonation = async (paymentRes) => {
    try {
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: paymentRes.orderId,
          paymentId: paymentRes.paymentId,
          signature: paymentRes.signature,
          type: 'donation',
          charityId: charity.id,
          amount: finalAmount,
          donorName: donorName.trim() || 'Anonymous Hero',
          message: message.trim(),
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyRes.ok) {
        setPaymentReceipt(verifyData);
        setSuccess(true);
        setActiveRzpOrder(null);
        if (onSuccess) onSuccess(verifyData.donation);
      } else {
        throw new Error(verifyData.error || 'Payment verification failed');
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!charity || finalAmount <= 0) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      // 1. Create Razorpay donation order
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'donation',
          amount: finalAmount,
          charityId: charity.id,
          userEmail: donorEmail.trim() || 'player@digitalheroes.co.in',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize donation order');

      // 2. Open Razorpay Checkout modal
      await triggerRazorpayCheckout({
        order: data.order,
        name: `Donation to ${charity.name}`,
        description: '100% Ring-Fenced Direct Charity Support',
        prefill: {
          name: donorName.trim() || 'Hero Golfer',
          email: donorEmail.trim() || 'player@digitalheroes.co.in',
        },
        theme: { color: '#f59e0b' },
        onSuccess: (paymentRes) => {
          verifyAndCompleteDonation(paymentRes);
        },
        onFallbackModal: (ord) => {
          setActiveRzpOrder(ord);
        },
        onFailure: (err) => {
          setErrorMsg(err.message || 'Payment was cancelled');
        },
      });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !activeRzpOrder}
        onClose={handleClose}
        title={success ? 'Donation Successful!' : `Direct Donation to ${charity?.name || 'Charity'}`}
        description={
          success
            ? 'Thank you for your generous contribution. 100% of direct donations go straight to the charity.'
            : 'PRD § 08: Independent donation option not tied to subscription gameplay.'
        }
      >
        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-xl font-bold text-white">
              {formatCurrency(finalAmount)} Donated
            </p>
            {paymentReceipt?.paymentId && (
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-mono">
                Razorpay Ref: {paymentReceipt.paymentId}
              </div>
            )}
            <p className="text-xs text-slate-400">
              A confirmation receipt and impact summary will be sent to your email.
            </p>
            <Button variant="primary" onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleDonate} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Select Amount (₹)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setAmount(q);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${
                      amount === q && !customAmount
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm'
                        : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    ₹{q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Or Custom Amount (₹)
              </label>
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(0);
                }}
                placeholder="Enter custom amount (e.g. ₹1,500)"
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
              />
            </div>

            {/* Donor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Encouragement Message (Optional)
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add an encouraging note to the charity team"
                className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm outline-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button variant="gold" type="submit" isLoading={isLoading} className="gap-2">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Donate {formatCurrency(finalAmount)} via Razorpay</span>
                </Button>
              </div>
              <p className="text-[11px] text-center text-slate-400">
                Secured by Razorpay • UPI, NetBanking, Debit & Credit Cards
              </p>
            </div>
          </form>
        )}
      </Modal>

      {/* Interactive Razorpay Payment Window */}
      {activeRzpOrder && (
        <RazorpayPaymentModal
          isOpen={Boolean(activeRzpOrder)}
          onClose={() => setActiveRzpOrder(null)}
          order={activeRzpOrder}
          name={`Donation to ${charity?.name}`}
          description="Direct Charity Support"
          prefill={{
            name: donorName,
            email: donorEmail,
          }}
          onSuccess={(paymentRes) => {
            verifyAndCompleteDonation(paymentRes);
          }}
        />
      )}
    </>
  );
}
