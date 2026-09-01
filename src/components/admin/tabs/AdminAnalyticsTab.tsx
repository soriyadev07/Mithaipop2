import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Download, 
  Calendar,
  Sparkles,
  PieChart
} from 'lucide-react';

export const AdminAnalyticsTab: React.FC = () => {
  const { orders, products, preOrders, exportDataToCSV } = useStoreData();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  // Compute key analytics
  const validOrders = useMemo(() => orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded'), [orders]);
  const grossRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrderValue = validOrders.length > 0 ? Math.round(grossRevenue / validOrders.length) : 0;

  // City breakdown
  const cityRevenueMap: Record<string, number> = {};
  validOrders.forEach(o => {
    const city = o.deliveryAddress?.city || 'Delhi NCR';
    cityRevenueMap[city] = (cityRevenueMap[city] || 0) + o.total;
  });
  const topCities = Object.entries(cityRevenueMap).sort((a, b) => b[1] - a[1]);

  // Flavor breakdown
  const flavorMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
  validOrders.forEach(o => {
    o.items?.forEach(item => {
      const pName = item.product.name;
      if (!flavorMap[pName]) {
        flavorMap[pName] = { name: pName, quantity: 0, revenue: 0 };
      }
      flavorMap[pName].quantity += item.quantity;
      flavorMap[pName].revenue += item.product.price * item.quantity;
    });
  });
  const topFlavors = Object.values(flavorMap).sort((a, b) => b.revenue - a.revenue);

  // Group orders by date (last 7 or 14 points)
  const dateMap: Record<string, number> = {};
  validOrders.forEach(o => {
    const d = o.placedAt ? o.placedAt.split('T')[0] : '2026-08-01';
    dateMap[d] = (dateMap[d] || 0) + o.total;
  });
  const salesTimeline = Object.entries(dateMap).slice(-7);
  const maxSaleDay = Math.max(...salesTimeline.map(s => s[1]), 1000);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Sales Analytics & Growth Performance
          </h2>
          <p className="text-xs text-stone-500">
            Real-time financial metrics, average basket size, geographic heatmaps, and flavor popularity trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportDataToCSV('analytics')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Gross Sales</span>
          <p className="text-2xl font-black font-display text-[#7A0F29] mt-1">₹{grossRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Real-time settled
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Average Order Value (AOV)</span>
          <p className="text-2xl font-black font-display text-[#171316] mt-1">₹{avgOrderValue.toLocaleString()}</p>
          <span className="text-[10px] text-stone-500 mt-0.5 block">Per customer checkout</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Delivered Volume</span>
          <p className="text-2xl font-black font-display text-emerald-700 mt-1">
            {orders.filter(o => o.status === 'Delivered').length} orders
          </p>
          <span className="text-[10px] text-stone-500 mt-0.5 block">Completed fulfillments</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Pre-Order Demand</span>
          <p className="text-2xl font-black font-display text-amber-900 mt-1">{preOrders.length} waitlist</p>
          <span className="text-[10px] text-stone-500 mt-0.5 block">Upcoming drop reservations</span>
        </div>
      </div>

      {/* Visual Chart 1: Revenue Timeline Bar Visualizer */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-sm font-black font-display text-[#171316]">Revenue Trajectory (Daily Sales)</h3>
          <span className="text-[11px] font-bold text-stone-400">Past Activity Window</span>
        </div>

        {salesTimeline.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-xs">
            No sales records in the current window.
          </div>
        ) : (
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-3 h-48 px-2 border-b border-stone-200">
              {salesTimeline.map(([date, amount]) => {
                const heightPercent = Math.max(Math.round((amount / maxSaleDay) * 100), 8);
                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-[#7A0F29] opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{amount}
                    </div>
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] bg-gradient-to-t from-[#7A0F29] to-[#52091B] rounded-t-xl group-hover:brightness-125 transition-all shadow-xs"
                    />
                    <span className="text-[10px] font-medium text-stone-400 mt-1 whitespace-nowrap">
                      {date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Grid: Top Flavors by Revenue & Geographic City Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Flavors */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-black font-display text-[#171316]">Flavor Revenue Breakdown</h3>
            <Sparkles className="w-4 h-4 text-[#F2C76E]" />
          </div>

          {topFlavors.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-8">No flavor sales recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {topFlavors.map(f => {
                const sharePercent = grossRevenue > 0 ? Math.round((f.revenue / grossRevenue) * 100) : 0;
                return (
                  <div key={f.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#171316]">{f.name}</span>
                      <span className="text-[#7A0F29]">₹{f.revenue.toLocaleString()} ({sharePercent}%)</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${sharePercent}%` }} 
                        className="bg-[#7A0F29] h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-sm font-black font-display text-[#171316]">Geographic Demand by City</h3>
            <span className="text-[10px] font-bold text-stone-400 uppercase">Tier 1 & Metros</span>
          </div>

          {topCities.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-8">No city sales recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {topCities.map(([city, revenue]) => {
                const sharePercent = grossRevenue > 0 ? Math.round((revenue / grossRevenue) * 100) : 0;
                return (
                  <div key={city} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#171316]">{city}</p>
                      <p className="text-[10px] text-stone-400">{sharePercent}% of total revenue</p>
                    </div>
                    <span className="font-black text-[#7A0F29]">₹{revenue.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
