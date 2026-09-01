import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { PreOrder, PreOrderStatus } from '../../../types';
import { 
  Sparkles, 
  Search, 
  Download, 
  Calendar, 
  Send, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X 
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const AdminPreOrdersTab: React.FC = () => {
  const { 
    preOrders, 
    updatePreOrderStatus, 
    updatePreOrderDispatchDate, 
    notifyPreOrderCustomer, 
    cancelPreOrder,
    exportDataToCSV 
  } = useStoreData();

  const [preOrderSearch, setPreOrderSearch] = useState('');
  const [selectedPreOrder, setSelectedPreOrder] = useState<PreOrder | null>(null);
  const [editDispatchDate, setEditDispatchDate] = useState('');
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPreOrders = useMemo(() => {
    return preOrders.filter(po => {
      const matchesSearch = 
        !preOrderSearch.trim() ||
        po.orderNumber.toLowerCase().includes(preOrderSearch.toLowerCase()) ||
        po.customerName.toLowerCase().includes(preOrderSearch.toLowerCase()) ||
        po.customerEmail.toLowerCase().includes(preOrderSearch.toLowerCase()) ||
        po.product.name.toLowerCase().includes(preOrderSearch.toLowerCase());

      const matchesStatus = statusFilter === 'all' || po.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [preOrders, preOrderSearch, statusFilter]);

  const handleOpenDetail = (po: PreOrder) => {
    setSelectedPreOrder(po);
    setEditDispatchDate(po.expectedDispatchDate || '');
  };

  const handleSaveDispatchDate = () => {
    if (!selectedPreOrder || !editDispatchDate) return;
    updatePreOrderDispatchDate(selectedPreOrder.id, editDispatchDate, 'Priya Varma');
    setSelectedPreOrder({ ...selectedPreOrder, expectedDispatchDate: editDispatchDate });
    sounds.playCelebration();
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPreOrder || !notifyMessage.trim()) return;
    notifyPreOrderCustomer(selectedPreOrder.id, notifyMessage);
    sounds.playCelebration();
    setNotifyModalOpen(false);
    setNotifyMessage('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Pre-Orders Queue & Launch Tracking
          </h2>
          <p className="text-xs text-stone-500">
            Manage upcoming drop reservations, dispatch schedules, and customer update broadcasts.
          </p>
        </div>

        <button
          onClick={() => exportDataToCSV('preorders')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Pre-Orders CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={preOrderSearch}
            onChange={(e) => setPreOrderSearch(e.target.value)}
            placeholder="Search pre-order #, customer name, flavor..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {preOrderSearch && (
            <button
              onClick={() => setPreOrderSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#7A0F29]"
        >
          <option value="all">All Pre-Orders ({preOrders.length})</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In Production">In Production</option>
          <option value="Packaging">Packaging</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Cancelled">Cancelled</option>
        </select>

      </div>

      {/* Pre-Orders List */}
      {filteredPreOrders.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <Sparkles className="w-12 h-12 mx-auto text-amber-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Pre-Orders in Queue</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {preOrderSearch 
              ? 'No pre-orders matched your search.' 
              : 'Upcoming limited edition drops will automatically queue reservations here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Reservation #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Upcoming Drop Pop</th>
                  <th className="py-3 px-4">Qty & Price</th>
                  <th className="py-3 px-4">Expected Dispatch</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPreOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#7A0F29]">
                      #{po.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#171316]">{po.customerName}</p>
                      <p className="text-[11px] text-stone-500">{po.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img 
                          src={po.product.image} 
                          alt={po.product.name} 
                          className="w-8 h-8 rounded-lg object-contain bg-white border border-stone-200" 
                        />
                        <div>
                          <p className="font-bold text-[#171316]">{po.product.name}</p>
                          <p className="text-[10px] text-stone-400">Target Launch: {po.expectedLaunchDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#171316]">₹{po.product.price * po.quantity}</p>
                      <p className="text-[10px] text-stone-500">Qty: {po.quantity}</p>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 font-medium">
                      {po.expectedDispatchDate || 'TBD'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === 'Dispatched'
                          ? 'bg-emerald-100 text-emerald-800'
                          : po.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(po)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-[#7A0F29] hover:text-[#FFF7E8] text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pre-Order Detail Modal */}
      {selectedPreOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#F2C76E] text-[#7A0F29] uppercase">
                  Pre-Order Reservation
                </span>
                <h3 className="text-xl font-black font-display text-[#171316] mt-1">
                  Reservation #{selectedPreOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPreOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product & Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs space-y-2">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Reserved Product</span>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPreOrder.product.image}
                    alt={selectedPreOrder.product.name}
                    className="w-12 h-12 rounded-xl object-contain bg-white border border-stone-200"
                  />
                  <div>
                    <p className="font-bold text-[#171316] text-sm">{selectedPreOrder.product.name}</p>
                    <p className="text-stone-500">Qty: {selectedPreOrder.quantity} • ₹{selectedPreOrder.product.price} each</p>
                    <p className="text-[11px] font-bold text-[#7A0F29]">Total: ₹{selectedPreOrder.product.price * selectedPreOrder.quantity}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs space-y-1.5">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Customer Contact</span>
                <p className="font-bold text-[#171316] text-sm">{selectedPreOrder.customerName}</p>
                <p className="text-stone-600">✉️ {selectedPreOrder.customerEmail}</p>
                <p className="text-stone-600">📞 {selectedPreOrder.customerPhone || 'Not provided'}</p>
              </div>
            </div>

            {/* Status Advance Controls */}
            <div>
              <span className="text-xs font-bold text-stone-700 block mb-2">Advance Production Status</span>
              <div className="flex flex-wrap gap-2">
                {(['Confirmed', 'In Production', 'Packaging', 'Dispatched', 'Cancelled'] as PreOrderStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      updatePreOrderStatus(selectedPreOrder.id, st, 'Priya Varma');
                      setSelectedPreOrder({ ...selectedPreOrder, status: st });
                      sounds.playClick();
                    }}
                    className={`py-1.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedPreOrder.status === st
                        ? 'bg-[#7A0F29] text-[#FFF7E8] border-[#7A0F29] shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Dispatch Date Modifier */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-stone-700 block">Update Promised Dispatch Date</span>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={editDispatchDate}
                  onChange={(e) => setEditDispatchDate(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleSaveDispatchDate}
                  className="px-4 py-2 bg-[#7A0F29] text-white rounded-xl text-xs font-bold hover:bg-[#52091B] cursor-pointer"
                >
                  Save Date
                </button>
              </div>
            </div>

            {/* Actions: Broadcast email & Close */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setNotifyModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-bold hover:bg-amber-100 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Notify Customer via SMS/Email</span>
              </button>

              <button
                onClick={() => setSelectedPreOrder(null)}
                className="px-5 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200 cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Notify Customer Modal */}
      {notifyModalOpen && selectedPreOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="text-sm font-black font-display text-[#171316]">
                Broadcast Update to {selectedPreOrder.customerName}
              </h4>
              <button onClick={() => setNotifyModalOpen(false)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Message Content</label>
                <textarea
                  rows={3}
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  required
                  placeholder="e.g. Your pre-ordered Kaju Katli Pop is now entering cryo-packaging and will dispatch this Friday!"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNotifyModalOpen(false)}
                  className="px-4 py-2 font-bold text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7A0F29] text-[#FFF7E8] font-bold rounded-xl"
                >
                  Send Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
