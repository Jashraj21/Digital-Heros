'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SUBSCRIPTION_PLANS } from '@/constants/subscription';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { triggerRazorpayCheckout } from '@/lib/razorpay/client';
import { RazorpayPaymentModal } from '@/components/razorpay/RazorpayPaymentModal';
import { Check, Sparkles, Heart, Trophy, ShieldCheck, ArrowRight, Zap, CreditCard } from 'lucide-react';

export function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentNotification, setPaymentNotification] = useState('');
  const [activeRzpOrder, setActiveRzpOrder] = useState(null);
  const [selectedPlanForRzp, setSelectedPlanForRzp] = useState(null);
  const { isAuthenticated, user, refreshSession } = useAuth();

  const handleVerifySubscription = async (paymentRes, planKey) => {
    try {
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: paymentRes.orderId,
          paymentId: paymentRes.paymentId,
          signature: paymentRes.signature,
          plan: planKey,
          type: 'subscription',
          userId: user?.id || 'user-player',
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyRes.ok) {
        setPaymentNotification(`Payment Verified! Activated ${planKey === 'yearly' ? 'Annual' : 'Monthly'} Plan.`);
        setActiveRzpOrder(null);
        if (refreshSession) refreshSession();
        setTimeout(() => {
          router.push(`${ROUTES.DASHBOARD}?payment_status=success&plan=${planKey}`);
        }, 1200);
      } else {
        throw new Error(verifyData.error || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Subscription verification failed:', err);
    }
  };

  const handleSubscribe = async (planKey) => {
    setIsCheckingOut(true);
    setPaymentNotification('');
    setSelectedPlanForRzp(planKey);
    try {
      // 1. Create Razorpay order
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey,
          type: 'subscription',
          userId: user?.id || 'user-player',
          userEmail: user?.email || 'player@digitalheroes.co.in',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize order');

      // 2. Open Razorpay Checkout modal
      await triggerRazorpayCheckout({
        order: data.order,
        name: 'Digital Heroes Platform',
        description: `${planKey === 'yearly' ? 'Annual Champion' : 'Monthly Hero'} Membership`,
        prefill: {
          name: user?.fullName || 'Hero Golfer',
          email: user?.email || 'player@digitalheroes.co.in',
          phone: user?.phone || '+919812345678',
        },
        onSuccess: async (paymentRes) => {
          await handleVerifySubscription(paymentRes, planKey);
        },
        onFallbackModal: (ord) => {
          setActiveRzpOrder(ord);
        },
        onFailure: (err) => {
          console.warn('Payment failed or cancelled:', err);
        },
      });
    } catch (e) {
      console.error('Checkout error:', e);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="emerald" size="md">
          Transparent Membership (§ 04)
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          One Membership. Double Impact.
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Every penny funds real grassroots charities and verified cash prize pools. Choose your membership tier and
          turn every round you play into a win for good causes.
        </p>

        {paymentNotification && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2 animate-in fade-in">
            <Check className="w-5 h-5" />
            <span>{paymentNotification}</span>
          </div>
        )}

        {/* Toggle Switch */}
        <div className="inline-flex items-center p-1.5 rounded-2xl glass-panel border border-slate-800 mt-4">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <Badge variant="gold" size="sm">
              Save 20%
            </Badge>
          </button>
        </div>

        {/* Razorpay Trust Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
          <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured by Razorpay • Instant UPI, NetBanking, Debit & Credit Cards</span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Monthly Plan */}
        <Card
          className={`p-8 border flex flex-col justify-between transition-all bg-slate-900 ${
            billingCycle === 'monthly'
              ? 'border-emerald-500/50 shadow-xl scale-[1.02]'
              : 'border-slate-800 opacity-80'
          }`}
        >
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">Monthly Hero</h3>
                <p className="text-xs text-slate-400 mt-1">Flexible month-to-month subscription</p>
              </div>
              <Badge variant="default" size="sm">
                Monthly
              </Badge>
            </div>

            <div className="my-6">
              <span className="text-4xl font-black text-white">₹1,999.00</span>
              <span className="text-xs text-slate-400 font-semibold ml-2">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              {SUBSCRIPTION_PLANS.monthly.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <Button
              variant={billingCycle === 'monthly' ? 'primary' : 'secondary'}
              size="lg"
              className="w-full"
              isLoading={isCheckingOut}
              onClick={() => handleSubscribe('monthly')}
            >
              <span>Get Started Monthly</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>

        {/* Yearly Plan */}
        <Card
          className={`p-8 border flex flex-col justify-between transition-all relative bg-slate-900 ${
            billingCycle === 'yearly'
              ? 'border-amber-500/50 shadow-xl scale-[1.02]'
              : 'border-slate-800'
          }`}
        >
          <div className="absolute -top-3 right-6">
            <Badge variant="gold" size="sm" className="font-extrabold shadow-md">
              <Sparkles className="w-3 h-3 mr-1" />
              Best Value (Save ₹3,989)
            </Badge>
          </div>

          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">Annual Champion</h3>
                <p className="text-xs text-slate-400 mt-1">Full 12-month access at discounted rate</p>
              </div>
              <Badge variant="gold" size="sm">
                Yearly
              </Badge>
            </div>

            <div className="my-6">
              <span className="text-4xl font-black text-amber-400">₹19,999.00</span>
              <span className="text-xs text-slate-400 font-semibold ml-2">/ year (equiv. ₹1,666/mo)</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              {SUBSCRIPTION_PLANS.yearly.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <Button
              variant="gold"
              size="lg"
              className="w-full"
              isLoading={isCheckingOut}
              onClick={() => handleSubscribe('yearly')}
            >
              <span>Get Started Yearly (Save 17%)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Transparency Split Breakdown (§ 04, § 07, § 08) */}
      <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 border border-slate-800">
        <h3 className="text-lg font-bold text-white text-center mb-6">
          100% Transparent Fee Allocation (§ 04, § 07 & § 08)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="text-2xl font-black text-emerald-400">50%</div>
            <h4 className="font-bold text-white text-xs mt-1">Monthly Prize Pool</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Directly funds 3, 4 & 5-match jackpots with rollover accumulation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
            <div className="text-2xl font-black text-rose-400">10% - 50%</div>
            <h4 className="font-bold text-white text-xs mt-1">Charity Grant</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Ring-fenced and disbursed to your chosen grassroots beneficiary.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <div className="text-2xl font-black text-slate-300">Remainder</div>
            <h4 className="font-bold text-white text-xs mt-1">Audits & Operations</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Independent handicap audits, PCI compliance, and platform hosting.
            </p>
          </div>
        </div>
      </div>

      {/* Razorpay Interactive Payment Window */}
      {activeRzpOrder && (
        <RazorpayPaymentModal
          isOpen={Boolean(activeRzpOrder)}
          onClose={() => setActiveRzpOrder(null)}
          order={activeRzpOrder}
          name="Digital Heroes Platform"
          description={`${selectedPlanForRzp === 'yearly' ? 'Annual Champion' : 'Monthly Hero'} Membership`}
          prefill={{
            name: user?.fullName || 'Hero Golfer',
            email: user?.email || 'player@digitalheroes.co.in',
            phone: user?.phone || '+919812345678',
          }}
          onSuccess={async (paymentRes) => {
            await handleVerifySubscription(paymentRes, selectedPlanForRzp || 'monthly');
          }}
        />
      )}
    </div>
  );
}
export default PricingPage;
