import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { OrderConfirmation, OrderStatus } from '../../../types';
import { 
  ShoppingBag, 
  Search, 
  Download, 
  Eye, 
  Filter, 
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface AdminOrdersTabProps {
  onSelectOrder: (order: OrderConfirmation) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ onSelectOrder }) => {
  const { orders, exportDataToCSV } = useStoreData();
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        !orderSearch.trim() ||
        order.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (order.customerPhone && order.customerPhone.includes(orderSearch)) ||
        (order.deliveryAddress?.city && order.deliveryAddress.city.toLowerCase().includes(orderSearch.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, statusFilter]);

  const statusOptions: { label: string; value: string; count?: number }[] = [
    { label: 'All Orders', value: 'all', count: orders.length },
    { label: 'Pending', value: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { label: 'Confirmed', value: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length },
    { label: 'Preparing', value: 'Preparing', count: orders.filter(o => o.status === 'Preparing').length },
    { label: 'Packed', value: 'Packed', count: orders.filter(o => o.status === 'Packed').length },
    { label: 'Shipped', value: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
    { label: 'Out for Delivery', value: 'Out for Delivery', count: orders.filter(o => o.status === 'Out for Delivery').length },
    { label: 'Delivered', value: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
    { label: 'Cancelled', value: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length },
    { label: 'Refunded', value: 'Refunded', count: orders.filter(o => o.status === 'Refunded').length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Orders Management
          </h2>
          <p className="text-xs text-stone-500">
            Real-time customer orders, cold-chain fulfillment status, notes, and instant refunds.
          </p>
        </div>

        <button
          onClick={() => exportDataToCSV('orders')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Search by order ID, customer name, phone, city..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {orderSearch && (
            <button
              onClick={() => setOrderSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#7A0F29]"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.count})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Orders Table / List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No matching orders found</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {orderSearch || statusFilter !== 'all' 
              ? 'Try changing your search query or filter selection.' 
              : 'Orders placed on the storefront will appear here with live tracking.'}
          </p>
          {(orderSearch || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setOrderSearch('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer & City</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4">Placed Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const itemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                  return (
                    <tr key={order.orderId} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#7A0F29]">
                        #{order.orderId}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#171316]">{order.customerName || 'Guest Buyer'}</p>
                        <p className="text-[11px] text-stone-500">{order.deliveryAddress?.city || 'Delhi NCR'}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-stone-700">{itemsCount} pop(s)</span>
                        <p className="text-[10px] text-stone-400 truncate max-w-[120px]">
                          {order.items?.map(i => i.product.name).join(', ')}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#171316]">
                        ₹{order.total}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          order.status === 'Cancelled'
                            ? 'bg-stone-100 text-stone-500'
                            : order.status === 'Refunded'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}>
                          {order.status === 'Refunded' ? 'Refunded' : order.paymentMethod || 'Paid (Online)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : order.status === 'Refunded'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'Out for Delivery'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-500 text-[11px] whitespace-nowrap">
                        {new Date(order.placedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-[#7A0F29] hover:text-[#FFF7E8] text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          title="Open order details & timeline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
