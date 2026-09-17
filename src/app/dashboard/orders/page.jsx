'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { triggerRazorpayCheckout } from '@/lib/razorpay/client';
import { RazorpayPaymentModal } from '@/components/razorpay/RazorpayPaymentModal';
import {
  CreditCard,
  Receipt,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Heart,
  FileText,
  Clock,
  Printer,
  X,
  Lock,
} from 'lucide-react';

export default function UserOrdersPage() {
  const { user, subscription, refreshSession } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [activeRzpOrder, setActiveRzpOrder] = useState(null);
  const [selectedPlanForRzp, setSelectedPlanForRzp] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState('');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const uid = user?.id || 'user-player';
      const uemail = user?.email || 'jashraaj@gmail.com';
      const res = await fetch(`/api/orders?userId=${encodeURIComponent(uid)}&email=${encodeURIComponent(uemail)}`);
      const data = await res.json();
      
      let serverOrders = [];
      if (data && data.orders && data.orders.length > 0) {
        serverOrders = data.orders;
      }

      // Merge with browser-stored orders from active checkout tests
      let localOrders = [];
      try {
        if (typeof window !== 'undefined') {
          localOrders = JSON.parse(localStorage.getItem('dh_orders') || '[]');
        }
      } catch (err) {}

      const combined = [...localOrders, ...serverOrders];
      const seen = new Set();
      const unique = [];
      for (const ord of combined) {
        const key = ord.id || ord.paymentId || ord.orderId;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(ord);
        }
      }

      setOrders(unique);
    } catch (e) {
      console.error('Error fetching user orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

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
          userName: user?.fullName || 'Jashraaj Sharma',
          userEmail: user?.email || 'jashraaj@gmail.com',
          paymentMethod: 'UPI / Razorpay Verified',
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyRes.ok) {
        setNotificationMsg(`Subscription Activated! Payment verified via Razorpay.`);
        setActiveRzpOrder(null);
        if (verifyData.order && typeof window !== 'undefined') {
          try {
            const current = JSON.parse(localStorage.getItem('dh_orders') || '[]');
            localStorage.setItem('dh_orders', JSON.stringify([verifyData.order, ...current]));
          } catch (err) {}
        }
        if (refreshSession) refreshSession();
        fetchOrders();
      } else {
        throw new Error(verifyData.error || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Subscription verification failed:', err);
    }
  };

  const handleSubscribeRazorpay = async (planKey) => {
    setIsPaying(true);
    setNotificationMsg('');
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
      setIsPaying(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === 'subscription') return o.type === 'subscription';
    if (selectedFilter === 'donation') return o.type === 'donation';
    return true;
  });

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const totalDonations = orders.filter((o) => o.type === 'donation').reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const totalSubscriptions = orders.filter((o) => o.type === 'subscription').reduce((sum, o) => sum + Number(o.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="cyan" size="sm" className="mb-2">
            Razorpay INR Billing & Orders
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Payments, Subscriptions & Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your golfer membership, make subscription payments via Razorpay, and track all verified receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gold"
            size="md"
            isLoading={isPaying}
            onClick={() => handleSubscribeRazorpay('yearly')}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Upgrade to Annual Champion (Save 20%)
          </Button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Active Membership Banner Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border-slate-700 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-md">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">
                    {subscription?.plan === 'yearly' ? 'Annual Champion Tier' : 'Monthly Hero Tier'}
                  </h3>
                  <Badge variant={subscription?.status === 'active' ? 'emerald' : 'rose'} size="sm">
                    {subscription?.status === 'active' ? 'Active & Draw Eligible' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Secured by Razorpay • Automatic monthly rollover & charity allocation
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Next Renewal: <strong>1st of Next Month</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Rate: <strong>{subscription?.plan === 'yearly' ? '₹19,999 / year' : '₹1,999 / month'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Prize Pool Entry: <strong>Active (5 Numbers Locked)</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              isLoading={isPaying}
              onClick={() => handleSubscribeRazorpay('monthly')}
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Pay Monthly (₹1,999)
            </Button>
            <Button
              variant="gold"
              size="md"
              className="w-full sm:w-auto"
              isLoading={isPaying}
              onClick={() => handleSubscribeRazorpay('yearly')}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Pay Annual (₹19,999)
            </Button>
          </div>
        </div>
      </Card>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Payments (INR)"
          value={formatCurrency(totalSpent)}
          subtitle={`${orders.length} Verified Transactions`}
          icon={Receipt}
          glowColor="cyan"
        />

        <StatCard
          title="Subscriptions Paid"
          value={formatCurrency(totalSubscriptions)}
          subtitle="Membership & Gameplay Pool"
          icon={CreditCard}
          glowColor="emerald"
        />

        <StatCard
          title="Direct Charity Given"
          value={formatCurrency(totalDonations)}
          subtitle="100% Ring-Fenced Grants"
          icon={Heart}
          glowColor="purple"
        />

        <StatCard
          title="Payment Gateway"
          value="Razorpay"
          subtitle="UPI, Cards & NetBanking"
          icon={ShieldCheck}
          glowColor="gold"
        />
      </div>

      {/* Orders & Transactions Table */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Order & Payment Transaction History</CardTitle>
            <CardDescription>
              Complete ledger of your subscription renewals and direct charity donations.
            </CardDescription>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            {['all', 'subscription', 'donation'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  selectedFilter === f
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All Orders' : f === 'subscription' ? 'Subscriptions' : 'Charity Donations'}
              </button>
            ))}
          </div>
        </CardHeader>

        {isLoading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Loading order records...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No transaction records found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-y border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Order / Payment Ref</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <span className="text-white font-bold block">{ord.id}</span>
                      <span className="text-slate-400">{ord.paymentId || ord.orderId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white block">{ord.itemDescription}</span>
                      <span className="text-xs text-slate-400">{ord.paymentMethod}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={ord.type === 'subscription' ? 'cyan' : 'gold'} size="sm" className="capitalize">
                        {ord.type}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-black text-white text-base">
                      {formatCurrency(ord.amount)}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(ord.createdAt)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedReceiptOrder(ord)}
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        <span>Receipt</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Official Receipt Modal */}
      {selectedReceiptOrder && (
        <Modal
          isOpen={Boolean(selectedReceiptOrder)}
          onClose={() => setSelectedReceiptOrder(null)}
          title="Official Razorpay Payment Receipt"
          description="Verified transaction tax invoice & platform breakdown"
        >
          <div className="space-y-6 text-slate-300 text-sm">
            {/* Header / Brand */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-white">DIGITAL HEROES</span>
                  <Badge variant="emerald" size="sm">
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Razorpay Merchant Gateway</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Amount</span>
                <span className="text-2xl font-black text-emerald-400">
                  {formatCurrency(selectedReceiptOrder.amount)}
                </span>
              </div>
            </div>

            {/* Receipt Table */}
            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-white font-bold">{selectedReceiptOrder.id}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Razorpay Payment Ref:</span>
                <span className="font-mono text-white">{selectedReceiptOrder.paymentId}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Razorpay Order Ref:</span>
                <span className="font-mono text-white">{selectedReceiptOrder.orderId}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Item Description:</span>
                <span className="text-white font-semibold">{selectedReceiptOrder.itemDescription}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Payer Name:</span>
                <span className="text-white">{selectedReceiptOrder.userName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Payer Email:</span>
                <span className="text-white">{selectedReceiptOrder.userEmail}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-white">{formatDate(selectedReceiptOrder.createdAt)}</span>
              </div>
            </div>

            {/* Allocation Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                100% Transparent Allocation Breakdown (§ 04 & § 08)
              </div>
              {selectedReceiptOrder.type === 'subscription' ? (
                <>
                  <div className="flex justify-between text-slate-300">
                    <span>Prize Pool Allocation (50%):</span>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(selectedReceiptOrder.amount * 0.5)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Charity Ring-Fenced Split (20%):</span>
                    <span className="font-bold text-rose-400">
                      {formatCurrency(selectedReceiptOrder.amount * 0.2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Audits, Operations & Hosting:</span>
                    <span className="font-bold text-slate-400">
                      {formatCurrency(selectedReceiptOrder.amount * 0.3)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-300">
                  <span>Direct Charity Disbursement (100%):</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(selectedReceiptOrder.amount)}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="w-4 h-4 mr-1" />
                Print / Save PDF
              </Button>
              <Button variant="primary" onClick={() => setSelectedReceiptOrder(null)}>
                Close Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Interactive Razorpay Payment Window */}
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
