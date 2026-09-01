import React, { useState } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { OrderConfirmation, OrderStatus } from '../../../types';
import { 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Gift, 
  FileText, 
  Check, 
  AlertCircle, 
  Send,
  Printer
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface AdminOrderModalProps {
  order: OrderConfirmation | null;
  onClose: () => void;
}

export const AdminOrderModal: React.FC<AdminOrderModalProps> = ({ order, onClose }) => {
  const { updateOrderStatus, addOrderInternalNote, processOrderRefund } = useStoreData();
  const [internalNote, setInternalNote] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [showRefundInput, setShowRefundInput] = useState(false);

  if (!order) return null;

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(order.orderId, newStatus, undefined, 'Priya Varma');
    sounds.playCelebration();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNote.trim()) return;
    addOrderInternalNote(order.orderId, internalNote.trim(), 'Priya Varma');
    setInternalNote('');
    sounds.playClick();
  };

  const handleRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundReason.trim()) return;
    processOrderRefund(order.orderId, refundReason.trim(), 'Priya Varma');
    setShowRefundInput(false);
    setRefundReason('');
    sounds.playCelebration();
  };

  const handlePrint = () => {
    sounds.playCelebration();
    window.print();
  };

  const statusList: OrderStatus[] = [
    'Pending',
    'Order Confirmed',
    'Preparing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black font-display text-[#171316]">Order #{order.orderId}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                order.status === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.status === 'Cancelled'
                  ? 'bg-red-100 text-red-800'
                  : order.status === 'Refunded'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on {new Date(order.placedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-stone-600 hover:text-[#7A0F29] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title="Print packaging slip"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Pipeline Step Controller */}
        <div>
          <span className="text-xs font-bold text-stone-700 block mb-2">Update Order Status Pipeline</span>
          <div className="flex flex-wrap gap-1.5">
            {statusList.map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  order.status === st
                    ? 'bg-[#7A0F29] text-[#FFF7E8] shadow-xs scale-102'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Customer Details</span>
            <p className="font-bold text-[#171316] text-sm">{order.customerName || 'Guest Buyer'}</p>
            <p className="text-stone-600 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-stone-400" /> {order.customerEmail || 'N/A'}</p>
            <p className="text-stone-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-stone-400" /> {order.customerPhone || 'N/A'}</p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Delivery Destination</span>
            <p className="font-bold text-[#171316] flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#7A0F29]" /> {order.deliveryAddress?.street || 'N/A'}</p>
            <p className="text-stone-600">{order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
            <p className="text-[11px] text-stone-500">Estimated Delivery: {order.estimatedDeliveryDate || '2-3 Business Days'}</p>
          </div>
        </div>

        {/* Ordered Pop Items */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Items in Order ({order.items?.length || 0})
          </h4>
          <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-contain bg-stone-50 border border-stone-200 p-1"
                  />
                  <div>
                    <p className="font-bold text-[#171316]">{item.product.name}</p>
                    <p className="text-stone-500 text-[11px]">Qty: {item.quantity} × ₹{item.product.price}</p>
                  </div>
                </div>
                <span className="font-black text-[#7A0F29]">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-medium">₹{order.subtotal || order.total}</span>
            </div>
            {order.discountAmount ? (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount ({order.discountCode || 'PROMO'}):</span>
                <span>-₹{order.discountAmount}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-stone-600">
              <span>Cold-Chain Shipping:</span>
              <span className="font-medium">{order.shippingFee ? `₹${order.shippingFee}` : 'FREE'}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-[#171316] pt-1.5 border-t border-stone-200">
              <span>Total Amount:</span>
              <span className="text-[#7A0F29]">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Gift details if applicable */}
        {order.isGift && order.giftMessage && (
          <div className="p-4 bg-[#FFF7E8] border border-amber-200/80 rounded-2xl space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#7A0F29]">
              <Gift className="w-4 h-4" />
              <span>Personalized Gift Greeting</span>
            </div>
            <p className="text-stone-800 italic">"{order.giftMessage}"</p>
          </div>
        )}

        {/* Internal Notes & Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Internal Staff Notes</h4>
          
          {order.internalNotes && order.internalNotes.length > 0 ? (
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {order.internalNotes.map((n, i) => (
                <div key={i} className="p-2.5 bg-stone-50 border border-stone-200/70 rounded-xl text-xs flex justify-between items-start">
                  <div>
                    <span className="font-bold text-[#7A0F29]">{n.author}:</span>
                    <span className="text-stone-700 ml-1.5">{n.note}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono shrink-0 ml-2">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400">No staff notes added yet.</p>
          )}

          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Add internal kitchen or dispatch note..."
              className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-black cursor-pointer"
            >
              Add Note
            </button>
          </form>
        </div>

        {/* Refund Action / Cancel */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {order.status !== 'Refunded' ? (
            <div>
              {!showRefundInput ? (
                <button
                  type="button"
                  onClick={() => setShowRefundInput(true)}
                  className="px-3.5 py-2 bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/60 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Issue Refund (₹{order.total})
                </button>
              ) : (
                <form onSubmit={handleRefund} className="flex gap-2">
                  <input
                    type="text"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Reason for refund..."
                    required
                    className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-purple-700 text-white rounded-xl text-xs font-bold"
                  >
                    Confirm Refund
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRefundInput(false)}
                    className="px-2 py-1.5 text-stone-400 text-xs"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          ) : (
            <span className="text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1.5 rounded-xl">
              ✓ Order Refunded
            </span>
          )}

          <button
            onClick={onClose}
            className="px-6 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
