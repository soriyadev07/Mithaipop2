import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { useAuth } from '../../../context/AuthContext';
import { 
  Users, 
  Search, 
  Download, 
  ShoppingBag, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  X,
  Plus,
  Calendar,
  DollarSign
} from 'lucide-react';
import { OrderConfirmation } from '../../../types';

interface AdminCustomersTabProps {
  onSelectOrder: (order: OrderConfirmation) => void;
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({ onSelectOrder }) => {
  const { orders, exportDataToCSV } = useStoreData();
  const { users } = useAuth();
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null);

  // Derive unique customer intelligence from real orders and registered users
  const customerList = useMemo(() => {
    const map: Record<string, {
      name: string;
      email: string;
      phone: string;
      city: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderDate: string;
      orders: OrderConfirmation[];
    }> = {};

    // Populate from orders
    orders.forEach(o => {
      const emailKey = (o.customerEmail || o.customerPhone || o.customerName || 'anon').toLowerCase();
      if (!map[emailKey]) {
        map[emailKey] = {
          name: o.customerName || 'Guest Buyer',
          email: o.customerEmail || 'Not provided',
          phone: o.customerPhone || 'Not provided',
          city: o.deliveryAddress?.city || 'Delhi NCR',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: o.placedAt,
          orders: [],
        };
      }
      map[emailKey].orders.push(o);
      map[emailKey].totalOrders += 1;
      if (o.status !== 'Cancelled' && o.status !== 'Refunded') {
        map[emailKey].totalSpent += (o.total || 0);
      }
      if (new Date(o.placedAt) > new Date(map[emailKey].lastOrderDate)) {
        map[emailKey].lastOrderDate = o.placedAt;
      }
    });

    // Merge registered accounts
    users.filter(u => u.role === 'CUSTOMER').forEach(u => {
      const emailKey = u.email.toLowerCase();
      if (!map[emailKey]) {
        map[emailKey] = {
          name: u.fullName,
          email: u.email,
          phone: u.phone || 'Not provided',
          city: 'Delhi NCR',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: u.createdAt || new Date().toISOString(),
          orders: [],
        };
      }
    });

    return Object.values(map);
  }, [orders, users]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customerList;
    const q = customerSearch.toLowerCase();
    return customerList.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  }, [customerList, customerSearch]);

  const activeCustomer = useMemo(() => {
    if (!selectedCustomerEmail) return null;
    return customerList.find(c => c.email.toLowerCase() === selectedCustomerEmail.toLowerCase()) || null;
  }, [customerList, selectedCustomerEmail]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Customer Directory & CRM
          </h2>
          <p className="text-xs text-stone-500">
            Real customer spending profiles, contact details, order histories, and loyalty tracking.
          </p>
        </div>

        <button
          onClick={() => exportDataToCSV('customers')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Customers CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            placeholder="Search by customer name, email, phone, or city..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {customerSearch && (
            <button
              onClick={() => setCustomerSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Customer Cards & Table */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <Users className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Customers Found</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {customerSearch 
              ? 'No customer matched your search criteria.' 
              : 'Customer profiles will build dynamically as orders are placed.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCustomers.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#171316]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#FFF7E8] border border-amber-200 text-[#7A0F29] font-black text-xs flex items-center justify-center">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{cust.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      <p className="text-[11px] flex items-center gap-1"><Mail className="w-3 h-3 text-stone-400" /> {cust.email}</p>
                      <p className="text-[11px] flex items-center gap-1 text-stone-400"><Phone className="w-3 h-3" /> {cust.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-700">
                      {cust.city}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#171316]">{cust.totalOrders}</span> order(s)
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#7A0F29]">
                      ₹{cust.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {new Date(cust.lastOrderDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomerEmail(cust.email)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-[#7A0F29] hover:text-[#FFF7E8] text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Profile Drawer / Modal */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7A0F29] text-[#FFF7E8] font-black text-base flex items-center justify-center shadow-xs">
                  {activeCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black font-display text-[#171316]">
                    {activeCustomer.name}
                  </h3>
                  <p className="text-xs text-stone-500">{activeCustomer.email} • {activeCustomer.phone}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomerEmail(null)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Lifetime Spend</span>
                <p className="text-lg font-black text-[#7A0F29] mt-0.5">₹{activeCustomer.totalSpent.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Total Orders</span>
                <p className="text-lg font-black text-[#171316] mt-0.5">{activeCustomer.totalOrders}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Avg Order Value</span>
                <p className="text-lg font-black text-emerald-700 mt-0.5">
                  ₹{activeCustomer.totalOrders > 0 ? Math.round(activeCustomer.totalSpent / activeCustomer.totalOrders) : 0}
                </p>
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Order History ({activeCustomer.orders.length})
              </h4>
              
              {activeCustomer.orders.length === 0 ? (
                <p className="text-xs text-stone-400 py-4 text-center">No completed orders on record.</p>
              ) : (
                <div className="space-y-2">
                  {activeCustomer.orders.map(o => (
                    <div 
                      key={o.orderId}
                      className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#7A0F29]">#{o.orderId}</span>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {new Date(o.placedAt).toLocaleDateString()} • {o.items?.length || 0} items
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#171316]">₹{o.total}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {o.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCustomerEmail(null);
                            onSelectOrder(o);
                          }}
                          className="px-2.5 py-1 bg-white border border-stone-200 hover:border-stone-400 rounded-lg font-bold text-stone-700 text-[11px]"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Close */}
            <div className="pt-3 border-t border-stone-100 text-right">
              <button
                onClick={() => setSelectedCustomerEmail(null)}
                className="px-5 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200 cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
