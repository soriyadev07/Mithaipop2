import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { 
  CreditCard, 
  Search, 
  Download, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  X,
  Filter,
  DollarSign
} from 'lucide-react';
import { OrderConfirmation } from '../../../types';

interface AdminPaymentsTabProps {
  onSelectOrder: (order: OrderConfirmation) => void;
}

export const AdminPaymentsTab: React.FC<AdminPaymentsTabProps> = ({ onSelectOrder }) => {
  const { orders, exportDataToCSV } = useStoreData();
  const [paySearch, setPaySearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const paymentsList = useMemo(() => {
    return orders.map(o => ({
      txnId: `TXN-${o.orderId.replace('#', '')}-${Math.abs(o.total * 31).toString().slice(0, 4)}`,
      orderId: o.orderId,
      customerName: o.customerName || 'Customer',
      customerEmail: o.customerEmail || 'N/A',
      amount: o.total,
      paymentMethod: o.paymentMethod || 'Online (UPI/Cards)',
      status: o.status === 'Cancelled' ? 'Cancelled' : o.status === 'Refunded' ? 'Refunded' : 'Success',
      date: o.placedAt,
      rawOrder: o,
    }));
  }, [orders]);

  const filteredPayments = useMemo(() => {
    return paymentsList.filter(p => {
      const matchesSearch = 
        !paySearch.trim() ||
        p.txnId.toLowerCase().includes(paySearch.toLowerCase()) ||
        p.orderId.toLowerCase().includes(paySearch.toLowerCase()) ||
        p.customerName.toLowerCase().includes(paySearch.toLowerCase()) ||
        p.customerEmail.toLowerCase().includes(paySearch.toLowerCase());

      const matchesMethod = methodFilter === 'all' || p.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [paymentsList, paySearch, methodFilter, statusFilter]);

  const totalCollected = paymentsList.filter(p => p.status === 'Success').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = paymentsList.filter(p => p.status === 'Refunded').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Payment Records & Financial Ledger
          </h2>
          <p className="text-xs text-stone-500">
            Reconcile UPI, credit card, netbanking transaction references, settlement statuses, and refunds.
          </p>
        </div>

        <button
          onClick={() => exportDataToCSV('payments')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Payments CSV</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Settled Payments</span>
          <p className="text-2xl font-black font-display text-emerald-700 mt-1">₹{totalCollected.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 mt-0.5 block">{paymentsList.filter(p => p.status === 'Success').length} verified transactions</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Refunded</span>
          <p className="text-2xl font-black font-display text-purple-800 mt-1">₹{totalRefunded.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 mt-0.5 block">{paymentsList.filter(p => p.status === 'Refunded').length} processed refunds</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Payment Success Rate</span>
          <p className="text-2xl font-black font-display text-[#7A0F29] mt-1">
            {paymentsList.length > 0 
              ? `${Math.round((paymentsList.filter(p => p.status === 'Success').length / paymentsList.length) * 100)}%` 
              : '100%'}
          </p>
          <span className="text-[10px] text-stone-500 mt-0.5 block">Payment gateway health</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={paySearch}
            onChange={(e) => setPaySearch(e.target.value)}
            placeholder="Search by transaction reference, order ID, or customer..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {paySearch && (
            <button
              onClick={() => setPaySearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#7A0F29]"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Success">Success (Paid)</option>
            <option value="Refunded">Refunded</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <CreditCard className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Payment Records</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Transactions made during customer checkout will automatically generate financial ledger entries here.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPayments.map((p, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#7A0F29]">
                      {p.txnId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-700">
                      #{p.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#171316]">{p.customerName}</p>
                      <p className="text-[10px] text-stone-400">{p.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#171316]">
                      ₹{p.amount}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-600">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'Refunded'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 text-[11px] whitespace-nowrap">
                      {new Date(p.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectOrder(p.rawOrder)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-[#7A0F29] hover:text-[#FFF7E8] text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Inspect Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
