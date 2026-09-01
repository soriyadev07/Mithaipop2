import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { 
  History, 
  Search, 
  Download, 
  ShieldCheck, 
  Clock, 
  User, 
  Tag, 
  ShoppingBag, 
  Layers,
  Sparkles,
  X
} from 'lucide-react';

export const AdminActivityTab: React.FC = () => {
  const { activityLogs, exportDataToCSV } = useStoreData();
  const [logSearch, setLogSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return activityLogs.filter(log => {
      const actor = log.actor || log.adminName || 'Staff';
      const target = log.target || log.targetType || 'System';
      const matchesSearch = 
        !logSearch.trim() ||
        actor.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
        target.toLowerCase().includes(logSearch.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(logSearch.toLowerCase()));

      const matchesAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.toLowerCase());

      return matchesSearch && matchesAction;
    });
  }, [activityLogs, logSearch, actionFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Staff Activity & Audit Logs
          </h2>
          <p className="text-xs text-stone-500">
            Immutable tracking of all operational modifications, order status advances, inventory adjustments, and catalog updates.
          </p>
        </div>

        <button
          onClick={() => exportDataToCSV('activity')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            placeholder="Search by staff name, action, target item, or notes..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {logSearch && (
            <button
              onClick={() => setLogSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#7A0F29]"
        >
          <option value="all">All Action Types</option>
          <option value="status">Status Updates</option>
          <option value="stock">Stock Adjustments</option>
          <option value="coupon">Coupon Modifications</option>
          <option value="refund">Refunds</option>
          <option value="settings">Settings Changes</option>
        </select>

      </div>

      {/* Activity Timeline */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <History className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Activity Logs Found</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Audit trails will record changes made to orders, inventory, catalog, and settings.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="divide-y divide-stone-100">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-stone-50/80 transition-colors flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF7E8] text-[#7A0F29] border border-amber-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-bold text-[#171316]">
                      <span className="text-[#7A0F29]">{log.actor || log.adminName || 'Staff'}</span> {log.action} <span className="font-mono text-stone-600 font-bold">[{log.target || log.targetType || 'System'}]</span>
                    </p>
                    {log.details && (
                      <p className="text-[11px] text-stone-500">{log.details}</p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(log.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
