import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useStoreData } from '../../../context/StoreDataContext';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Users, 
  RefreshCw, 
  Bell, 
  AlertTriangle, 
  Download, 
  Plus, 
  Eye, 
  ArrowRight,
  TrendingUp,
  Truck,
  CreditCard
} from 'lucide-react';
import { OrderConfirmation } from '../../../types';

interface AdminDashboardOverviewProps {
  onSelectOrder: (order: OrderConfirmation) => void;
  onOpenAddProduct: () => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onSelectOrder,
  onOpenAddProduct,
}) => {
  const { setActiveAdminTab } = useAuth();
  const { 
    orders, 
    preOrders, 
    inventory, 
    notifications, 
    exportDataToCSV,
    waitlistEntries,
    settings 
  } = useStoreData();

  // Metrics calculation
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.placedAt?.startsWith(todayStr));
  const todayRevenue = todayOrders.filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded').reduce((sum, o) => sum + (o.total || 0), 0);
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded').reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Preparing' || o.status === 'Order Confirmed' || o.status === 'Pending' || o.status === 'Packed').length;
  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
  const unreadAdminNotifs = notifications.filter(n => (n.target === 'admin' || n.target === 'all') && !n.read).length;
  const refundedCount = orders.filter(o => o.status === 'Refunded').length;

  // Unique customer count
  const uniqueCustomerEmails = new Set(orders.map(o => (o.customerEmail || o.customerPhone || 'anon').toLowerCase()));
  const totalCustomers = uniqueCustomerEmails.size;

  // Top selling products from real orders
  const productSalesMap: Record<string, { id: string; name: string; orders: number; revenue: number; image: string }> = {};
  orders.forEach(o => {
    if (o.status !== 'Cancelled' && o.status !== 'Refunded') {
      o.items?.forEach(item => {
        const pId = item.product.id;
        if (!productSalesMap[pId]) {
          productSalesMap[pId] = {
            id: pId,
            name: item.product.name,
            orders: 0,
            revenue: 0,
            image: item.product.image,
          };
        }
        productSalesMap[pId].orders += item.quantity;
        productSalesMap[pId].revenue += item.product.price * item.quantity;
      });
    }
  });
  const topProducts = Object.values(productSalesMap).sort((a, b) => b.orders - a.orders);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Heading & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-[#171316]">
            Dashboard Overview
          </h1>
          <p className="text-xs text-stone-500">
            Real-time operating stats for Mithai Pop kitchen, inventory, and sales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportDataToCSV('orders')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A0F29] text-[#FFF7E8] text-xs font-bold hover:bg-[#52091B] shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Pop</span>
          </button>
        </div>
      </div>

      {/* Active Waitlist Campaign Banner */}
      {settings.waitlistMode && (
        <div 
          onClick={() => setActiveAdminTab('waitlist')}
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs cursor-pointer hover:bg-amber-100/70 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-amber-950">
                  Pre-Launch Waitlist Campaign Active
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                  {waitlistEntries.length} Leads
                </span>
              </div>
              <p className="text-xs text-amber-800/80 mt-0.5">
                Public prices and checkout are disabled. Visitors join the VIP drop list.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-900 group-hover:translate-x-1 transition-transform">
            <span>View All Waitlist Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* Row 1 Metrics: Orders, Revenue, Pending Orders, Pre-Orders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        {/* Total Orders */}
        <div 
          onClick={() => setActiveAdminTab('orders')}
          className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#7A0F29]" />
          </div>
          <p className="text-2xl font-black font-display text-[#171316] mt-1.5">
            {totalOrdersCount}
          </p>
          <span className="text-[10px] text-stone-500 font-medium mt-1 block">
            {todayOrders.length} placed today
          </span>
        </div>

        {/* Total Revenue */}
        <div 
          onClick={() => setActiveAdminTab('analytics')}
          className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black font-display text-[#7A0F29] mt-1.5">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-stone-500 font-medium mt-1 block">
            Today: ₹{todayRevenue.toLocaleString()}
          </span>
        </div>

        {/* Pending Orders */}
        <div 
          onClick={() => setActiveAdminTab('orders')}
          className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-display text-amber-900 mt-1.5">
            {pendingOrdersCount}
          </p>
          <span className="text-[10px] text-amber-700 font-bold mt-1 block">
            {pendingOrdersCount > 0 ? 'Requires fulfillment' : 'All clear'}
          </span>
        </div>

        {/* Active Pre-Orders */}
        <div 
          onClick={() => setActiveAdminTab('preorders')}
          className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pre-Orders</span>
            <Sparkles className="w-4 h-4 text-[#F2C76E]" />
          </div>
          <p className="text-2xl font-black font-display text-[#7A0F29] mt-1.5">
            {preOrders.length}
          </p>
          <span className="text-[10px] text-stone-500 font-medium mt-1 block">
            {preOrders.length > 0 ? 'In waitlist queue' : '0 in queue'}
          </span>
        </div>

      </div>

      {/* Row 2 Metrics: Customers, Refunds, Notifications, Low Stock */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        {/* Customers */}
        <div 
          onClick={() => setActiveAdminTab('customers')}
          className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-stone-600" />
          </div>
          <p className="text-2xl font-black font-display text-[#171316] mt-1">
            {totalCustomers}
          </p>
          <span className="text-[10px] text-stone-500 mt-1 block">
            Unique buyers
          </span>
        </div>

        {/* Refunds */}
        <div 
          onClick={() => setActiveAdminTab('payments')}
          className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Refunds</span>
            <RefreshCw className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-2xl font-black font-display text-stone-800 mt-1">
            {refundedCount}
          </p>
          <span className="text-[10px] text-stone-500 font-medium mt-1 block">
            Processed refunds
          </span>
        </div>

        {/* Notifications */}
        <div 
          onClick={() => setActiveAdminTab('notifications')}
          className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs hover:border-stone-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Alerts</span>
            <Bell className="w-4 h-4 text-stone-600" />
          </div>
          <p className="text-2xl font-black font-display text-stone-800 mt-1">
            {unreadAdminNotifs}
          </p>
          <span className="text-[10px] text-stone-500 font-medium mt-1 block">
            Unread notifications
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={() => setActiveAdminTab('inventory')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            lowStockCount > 0 ? 'bg-red-50/70 border-red-200 text-red-900' : 'bg-white border-stone-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? 'text-red-600' : 'text-stone-400'}`} />
          </div>
          <p className="text-2xl font-black font-display mt-1">
            {lowStockCount}
          </p>
          <span className="text-[10px] font-bold text-[#7A0F29] hover:underline mt-1 block">
            {lowStockCount > 0 ? 'Restock Required →' : 'Healthy Inventory'}
          </span>
        </div>

      </div>

      {/* Two Column Grid: Recent Orders + Top Selling Pops */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-black font-display text-[#171316]">Recent Customer Orders</h3>
            <button
              onClick={() => setActiveAdminTab('orders')}
              className="text-xs font-bold text-[#7A0F29] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto text-stone-300 stroke-[1.5]" />
              <p className="text-xs font-medium">No orders have been placed yet.</p>
              <p className="text-[11px] text-stone-400">Orders placed on the storefront will appear here automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-[10px] font-bold text-stone-400 uppercase">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Items</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.orderId} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 font-bold text-[#7A0F29]">#{o.orderId}</td>
                      <td className="py-3 font-medium text-stone-700">{o.customerName || 'Customer'}</td>
                      <td className="py-3 text-stone-500">{o.items?.length || 0} pop(s)</td>
                      <td className="py-3 font-bold">₹{o.total}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : o.status === 'Refunded'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onSelectOrder(o)}
                          className="text-stone-400 hover:text-[#7A0F29] font-bold p-1 cursor-pointer"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Selling Pops (1 Col) */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-black font-display text-[#171316]">Top Selling Pops</h3>
            <button
              onClick={() => setActiveAdminTab('products')}
              className="text-xs font-bold text-[#7A0F29] hover:underline cursor-pointer"
            >
              Catalog →
            </button>
          </div>
          
          {topProducts.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-stone-300 stroke-[1.5]" />
              <p className="text-xs font-medium">No sales recorded yet.</p>
              <p className="text-[11px] text-stone-400">Flavor popularity rankings will dynamically populate from completed purchases.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.slice(0, 5).map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-[#7A0F29] text-[#FFF7E8] font-black text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-white border border-stone-200 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-[#171316] truncate">{p.name}</p>
                      <p className="text-[10px] text-stone-500">{p.orders} unit(s) sold</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#7A0F29] shrink-0">₹{p.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
