import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { useAuth } from '../../../context/AuthContext';
import { 
  Bell, 
  Check, 
  Trash2, 
  Clock, 
  ShoppingBag, 
  AlertTriangle, 
  Sparkles,
  Info,
  CheckCheck
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const AdminNotificationsTab: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStoreData();
  const { setActiveAdminTab } = useAuth();
  const [filterType, setFilterType] = useState<string>('all');

  const adminNotifications = useMemo(() => {
    return notifications.filter(n => n.target === 'admin' || n.target === 'all');
  }, [notifications]);

  const filteredNotifs = useMemo(() => {
    if (filterType === 'all') return adminNotifications;
    if (filterType === 'unread') return adminNotifications.filter(n => !n.read);
    return adminNotifications.filter(n => n.type === filterType);
  }, [adminNotifications, filterType]);

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    if (n.type === 'order') setActiveAdminTab('orders');
    if (n.type === 'stock') setActiveAdminTab('inventory');
    if (n.type === 'preorder') setActiveAdminTab('preorders');
    sounds.playClick();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            System Alerts & Kitchen Notifications
          </h2>
          <p className="text-xs text-stone-500">
            Real-time triggers for incoming orders, low inventory alerts, pre-order registrations, and system events.
          </p>
        </div>

        <button
          onClick={() => {
            markAllNotificationsRead('admin');
            sounds.playCelebration();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-[#7A0F29] hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'unread', 'order', 'stock', 'preorder', 'system'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
              filterType === tab
                ? 'bg-[#7A0F29] text-[#FFF7E8]'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <Bell className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Alerts Found</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            You're all caught up! New orders and inventory notifications will trigger alerts here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotifs.map((n) => {
            const Icon = 
              n.type === 'order' ? ShoppingBag :
              n.type === 'stock' ? AlertTriangle :
              n.type === 'preorder' ? Sparkles : Info;

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  n.read 
                    ? 'bg-white border-stone-200 hover:border-stone-300' 
                    : 'bg-amber-50/80 border-amber-200 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    n.type === 'stock' ? 'bg-red-100 text-red-700' :
                    n.type === 'order' ? 'bg-emerald-100 text-emerald-800' :
                    n.type === 'preorder' ? 'bg-purple-100 text-purple-800' :
                    'bg-stone-100 text-stone-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold ${n.read ? 'text-[#171316]' : 'text-[#7A0F29]'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#7A0F29]" />
                      )}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-stone-400 block flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.timestamp || n.createdAt || Date.now()).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(n.id);
                      sounds.playClick();
                    }}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg shrink-0"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
