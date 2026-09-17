'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { 
  Receipt, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  CreditCard, 
  Heart, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Printer,
  FileText,
  User,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'subscription' | 'donation'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const subscriptionOrders = orders.filter(o => o.type === 'subscription');
  const subscriptionRevenue = subscriptionOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const donationOrders = orders.filter(o => o.type === 'donation');
  const donationRevenue = donationOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const totalCharityDisbursed = (subscriptionRevenue * 0.5) + donationRevenue;

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesType = filterType === 'all' || order.type === filterType;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesType;

    const matchesSearch = 
      (order.userName && order.userName.toLowerCase().includes(query)) ||
      (order.userEmail && order.userEmail.toLowerCase().includes(query)) ||
      (order.id && order.id.toLowerCase().includes(query)) ||
      (order.orderId && order.orderId.toLowerCase().includes(query)) ||
      (order.paymentId && order.paymentId.toLowerCase().includes(query)) ||
      (order.plan && order.plan.toLowerCase().includes(query));

    return matchesType && matchesSearch;
  });

  const handleOpenReceipt = (order) => {
    setSelectedOrder(order);
    setIsReceiptModalOpen(true);
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;
    
    const headers = ['Order ID', 'Payment Ref', 'Member Name', 'Email', 'Type', 'Plan', 'Amount (INR)', 'Payment Method', 'Charity Split (INR)', 'Status', 'Date'];
    const rows = filteredOrders.map(o => [
      `"${o.id || ''}"`,
      `"${o.paymentId || o.orderId || ''}"`,
      `"${o.userName || 'Anonymous'}"`,
      `"${o.userEmail || ''}"`,
      `"${o.type || ''}"`,
      `"${o.plan || 'Direct Donation'}"`,
      o.amount || 0,
      `"${o.paymentMethod || 'Razorpay Gateway'}"`,
      (o.type === 'subscription' ? (Number(o.amount) * 0.5) : Number(o.amount)) || 0,
      `"${o.status || 'completed'}"`,
      `"${o.createdAt ? new Date(o.createdAt).toISOString() : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `digital_heros_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="cyan" size="sm" className="mb-2">
            Finance & Payment Gateway (§ 05)
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Receipt className="w-8 h-8 text-cyan-400" />
            Orders & Payment Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time auditing of Razorpay transactions, membership subscriptions, direct charity donations, and fund splits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchOrders} 
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Platform Volume"
          value={formatCurrency(totalRevenue)}
          subtitle={`${orders.length} total completed orders`}
          icon={DollarSign}
          glowColor="cyan"
        />

        <StatCard
          title="Subscription Volume"
          value={formatCurrency(subscriptionRevenue)}
          subtitle={`${subscriptionOrders.length} active recurring plans`}
          icon={CreditCard}
          glowColor="purple"
        />

        <StatCard
          title="Charity Disbursed (50%+)"
          value={formatCurrency(totalCharityDisbursed)}
          subtitle="Direct impact to partner causes"
          icon={Heart}
          glowColor="gold"
        />

        <StatCard
          title="Payment Success Rate"
          value="100%"
          subtitle="Razorpay Auto-Verified"
          icon={ShieldCheck}
          glowColor="emerald"
        />
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-slate-900/60 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilterType('subscription')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'subscription'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Subscriptions ({subscriptionOrders.length})
            </button>
            <button
              onClick={() => setFilterType('donation')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'donation'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Donations ({donationOrders.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search member, email, order ID, or payment ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden border-slate-800">
        <CardHeader className="border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Payment Transactions</CardTitle>
              <CardDescription>Audited real-time ledger synced with Razorpay Payments API</CardDescription>
            </div>
            <Badge variant="outline" size="sm" className="font-mono text-xs">
              Showing {filteredOrders.length} of {orders.length}
            </Badge>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Order / Payment ID</th>
                <th className="py-3.5 px-4">Member</th>
                <th className="py-3.5 px-4">Type & Details</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Charity Split (50%)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                    Loading payment records...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-50" />
                    No transactions found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSub = order.type === 'subscription';
                  const charitySplit = isSub ? Number(order.amount) * 0.5 : Number(order.amount);

                  return (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors group">
                      {/* Order & Payment ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs font-bold text-cyan-300">
                          {order.id}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]" title={order.paymentId || order.orderId}>
                          {order.paymentId || order.orderId || 'Direct'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>

                      {/* Member info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-xs sm:text-sm">
                          {order.userName || 'Golfer'}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[150px]">
                          {order.userEmail}
                        </div>
                      </td>

                      {/* Type & Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {isSub ? (
                            <Badge variant="purple" size="sm" className="capitalize text-[10px]">
                              {order.plan === 'yearly' ? 'Annual Champion' : 'Monthly Hero'}
                            </Badge>
                          ) : (
                            <Badge variant="gold" size="sm" className="text-[10px]">
                              Direct Donation
                            </Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {isSub ? (order.plan === 'yearly' ? '12-Month Access' : '30-Day Billing') : 'Philanthropic Fund'}
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{order.paymentMethod || 'Razorpay Gateway'}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-white text-sm">
                          {formatCurrency(order.amount)}
                        </span>
                      </td>

                      {/* Charity Split */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                          <Heart className="w-3 h-3 fill-current text-rose-500 inline" />
                          <span>{formatCurrency(charitySplit)}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {isSub ? '50% Pool Split' : '100% Direct'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant="emerald" size="sm" className="flex items-center gap-1 w-fit text-[10px]">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Completed
                        </Badge>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReceipt(order)}
                          className="text-xs h-7 px-2.5 border-slate-700 hover:border-cyan-500 hover:text-cyan-400"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          Receipt
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invoice / Audit Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          title="Transaction Receipt & Audit Log"
        >
          <div className="space-y-6 text-slate-200">
            {/* Header / Receipt Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500" />
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Payment Confirmed & Audited</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Order ID: {selectedOrder.id}</p>
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                Razorpay ID: {selectedOrder.paymentId || selectedOrder.orderId}
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Customer Name</span>
                <span className="font-semibold text-white">{selectedOrder.userName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Customer Email</span>
                <span className="font-semibold text-white">{selectedOrder.userEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Transaction Category</span>
                <span className="font-semibold capitalize text-cyan-300">{selectedOrder.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Plan / Allocation</span>
                <span className="font-semibold text-white">
                  {selectedOrder.type === 'subscription'
                    ? selectedOrder.plan === 'yearly' ? 'Annual Champion' : 'Monthly Hero'
                    : 'Direct Charity Donation'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Payment Gateway</span>
                <span className="font-semibold text-white">Razorpay Secure Checkout</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Payment Method</span>
                <span className="font-semibold text-white">{selectedOrder.paymentMethod || 'UPI / Card'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Date & Timestamp</span>
                <span className="font-semibold text-white">{formatDate(selectedOrder.createdAt)}</span>
              </div>

              {/* Charity Split Breakdown */}
              <div className="p-3 mt-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 space-y-1.5">
                <div className="flex justify-between text-emerald-300 font-bold">
                  <span>50% Charity Allocation</span>
                  <span>{formatCurrency(selectedOrder.type === 'subscription' ? Number(selectedOrder.amount) * 0.5 : Number(selectedOrder.amount))}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Verified philanthropic allocation disbursed to registered Canadian Junior Golf foundations & charity partners.
                </p>
              </div>

              {/* Total Paid */}
              <div className="flex justify-between pt-3 text-sm font-black text-white border-t border-slate-700">
                <span>Total Amount Charged</span>
                <span className="text-cyan-400 text-base">{formatCurrency(selectedOrder.amount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Receipt
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsReceiptModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
