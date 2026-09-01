import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { OrderConfirmation, OrderStatus } from '../../../types';
import { 
  Truck, 
  Search, 
  Download, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Eye,
  Snowflake
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface AdminDeliveryTabProps {
  onSelectOrder: (order: OrderConfirmation) => void;
}

export const AdminDeliveryTab: React.FC<AdminDeliveryTabProps> = ({ onSelectOrder }) => {
  const { orders, updateOrderStatus, exportDataToCSV } = useStoreData();
  const [deliverySearch, setDeliverySearch] = useState('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<string>('all');

  const deliveryOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Refunded');
  }, [orders]);

  const filteredDeliveries = useMemo(() => {
    return deliveryOrders.filter(o => {
      const matchesSearch = 
        !deliverySearch.trim() ||
        o.orderId.toLowerCase().includes(deliverySearch.toLowerCase()) ||
        (o.customerName && o.customerName.toLowerCase().includes(deliverySearch.toLowerCase())) ||
        (o.deliveryAddress?.city && o.deliveryAddress.city.toLowerCase().includes(deliverySearch.toLowerCase())) ||
        (o.deliveryAddress?.pincode && o.deliveryAddress.pincode.includes(deliverySearch));

      const matchesStatus = deliveryStatusFilter === 'all' || o.status === deliveryStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [deliveryOrders, deliverySearch, deliveryStatusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Cold-Chain Delivery & Dispatch Desk
          </h2>
          <p className="text-xs text-stone-500">
            Dispatch queue, temperature-controlled transit tracking, courier assignments, and delivery completion.
          </p>
        </div>

        <button
          onClick={() => exportDataToCSV('orders')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Manifest CSV</span>
        </button>
      </div>

      {/* Cold Chain Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Out for Delivery</span>
            <p className="text-2xl font-black font-display text-blue-800 mt-1">
              {deliveryOrders.filter(o => o.status === 'Out for Delivery').length} orders
            </p>
          </div>
          <Truck className="w-6 h-6 text-blue-600" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">In Kitchen Packing</span>
            <p className="text-2xl font-black font-display text-amber-800 mt-1">
              {deliveryOrders.filter(o => o.status === 'Preparing' || o.status === 'Packed').length} orders
            </p>
          </div>
          <Clock className="w-6 h-6 text-amber-500" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Cold-Chain Temperature</span>
            <p className="text-2xl font-black font-display text-cyan-700 mt-1">-18°C Cryo-Pack</p>
          </div>
          <Snowflake className="w-6 h-6 text-cyan-600 animate-pulse" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={deliverySearch}
            onChange={(e) => setDeliverySearch(e.target.value)}
            placeholder="Search by order ID, customer name, pin code, or city..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {deliverySearch && (
            <button
              onClick={() => setDeliverySearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={deliveryStatusFilter}
          onChange={(e) => setDeliveryStatusFilter(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#7A0F29]"
        >
          <option value="all">All Dispatches ({deliveryOrders.length})</option>
          <option value="Preparing">Preparing</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>

      </div>

      {/* Deliveries Table */}
      {filteredDeliveries.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <Truck className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Orders in Dispatch Desk</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Placed customer orders ready for packaging and cold-transit dispatch will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Recipient & Contact</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4">Cold Insulation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Dispatch Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredDeliveries.map((order) => (
                  <tr key={order.orderId} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#7A0F29]">
                      #{order.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#171316]">{order.customerName || 'Customer'}</p>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {order.customerPhone || 'N/A'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                      <p className="font-medium text-[#171316]">{order.deliveryAddress?.street || 'N/A'}</p>
                      <p className="text-[11px] text-stone-400">
                        {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200/60">
                        <Snowflake className="w-3 h-3 text-cyan-600" />
                        <span>Dry Ice Sealed</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Out for Delivery'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status !== 'Delivered' && (
                          <button
                            onClick={() => {
                              const nextStatusMap: Record<string, OrderStatus> = {
                                'Pending': 'Preparing',
                                'Order Confirmed': 'Preparing',
                                'Preparing': 'Packed',
                                'Packed': 'Shipped',
                                'Shipped': 'Out for Delivery',
                                'Out for Delivery': 'Delivered',
                              };
                              const next = nextStatusMap[order.status] || 'Delivered';
                              updateOrderStatus(order.orderId, next, `Auto updated to ${next}`, 'Priya Varma');
                              sounds.playCelebration();
                            }}
                            className="px-2.5 py-1 bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] text-[11px] font-bold rounded-xl cursor-pointer"
                          >
                            Advance ➔
                          </button>
                        )}
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl"
                          title="View order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
