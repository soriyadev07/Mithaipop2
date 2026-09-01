import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { SupportTicket, TicketMessage, TicketStatus, TicketPriority } from '../../../types';
import { 
  LifeBuoy, 
  Search, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  User,
  ShieldCheck,
  X
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const AdminSupportTab: React.FC = () => {
  const { 
    supportTickets, 
    updateTicketStatus, 
    updateTicketPriority, 
    addTicketReply, 
    exportDataToCSV 
  } = useStoreData();

  const [ticketSearch, setTicketSearch] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    supportTickets.length > 0 ? supportTickets[0].id : null
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const filteredTickets = useMemo(() => {
    return supportTickets.filter(t => {
      const matchesSearch = 
        !ticketSearch.trim() ||
        t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.customerName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        (t.orderId && t.orderId.toLowerCase().includes(ticketSearch.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [supportTickets, ticketSearch, statusFilter]);

  const activeTicket = useMemo(() => {
    return supportTickets.find(t => t.id === selectedTicketId) || null;
  }, [supportTickets, selectedTicketId]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    addTicketReply(activeTicket.id, {
      sender: 'staff',
      senderName: 'Priya Varma',
      message: replyText.trim(),
      isInternalNote,
    });

    setReplyText('');
    sounds.playCelebration();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Customer Support & Helpdesk
          </h2>
          <p className="text-xs text-stone-500">
            Live tickets, customer inquiries, order delivery queries, and internal staff resolution notes.
          </p>
        </div>

        <button
          onClick={() => exportDataToCSV('support')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Tickets CSV</span>
        </button>
      </div>

      {/* Main Helpdesk Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tickets Queue */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-xs space-y-3 flex flex-col h-[650px]">
          
          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                placeholder="Search tickets..."
                className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700"
            >
              <option value="all">All Tickets ({supportTickets.length})</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredTickets.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-12">No support tickets found.</p>
            ) : (
              filteredTickets.map(t => {
                const isSelected = t.id === selectedTicketId;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#7A0F29] text-[#FFF7E8] border-[#7A0F29] shadow-xs' 
                        : 'bg-stone-50 border-stone-200/80 hover:bg-stone-100/70 text-[#171316]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-[10px] font-bold ${isSelected ? 'text-[#F2C76E]' : 'text-[#7A0F29]'}`}>
                        {t.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : t.status === 'Resolved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <p className="font-bold truncate">{t.subject}</p>
                    <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-stone-200' : 'text-stone-500'}`}>
                      {t.customerName} {t.orderId ? `• Order #${t.orderId}` : ''}
                    </p>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Ticket Detail & Message Thread */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col h-[650px] justify-between space-y-4">
          
          {activeTicket ? (
            <>
              {/* Ticket Top Header & Actions */}
              <div className="border-b border-stone-100 pb-3 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#7A0F29]">{activeTicket.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold">
                        {activeTicket.category}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        activeTicket.priority === 'Urgent' ? 'bg-red-100 text-red-700 animate-pulse' :
                        activeTicket.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {activeTicket.priority} Priority
                      </span>
                    </div>
                    <h3 className="text-base font-black font-display text-[#171316] mt-1">
                      {activeTicket.subject}
                    </h3>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={activeTicket.status}
                      onChange={(e) => {
                        updateTicketStatus(activeTicket.id, e.target.value as TicketStatus);
                        sounds.playClick();
                      }}
                      className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                  <span>Customer: <strong className="text-[#171316]">{activeTicket.customerName}</strong></span>
                  <span>Email: <strong className="text-[#171316]">{activeTicket.customerEmail}</strong></span>
                  {activeTicket.orderId && (
                    <span>Associated Order: <strong className="text-[#7A0F29]">#{activeTicket.orderId}</strong></span>
                  )}
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 p-2">
                {activeTicket.messages.map((msg) => {
                  const isStaff = msg.sender === 'staff';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-stone-400">
                        {isStaff ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-[#7A0F29]" />
                            <span className="font-bold text-stone-700">{msg.senderName || 'Staff'}</span>
                            {msg.isInternalNote && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-bold">INTERNAL NOTE</span>
                            )}
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 text-stone-500" />
                            <span className="font-bold text-stone-700">{msg.senderName || 'Customer'}</span>
                          </>
                        )}
                        <span>• {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className={`p-3 rounded-2xl text-xs max-w-lg leading-relaxed ${
                        msg.isInternalNote
                          ? 'bg-amber-50 border border-amber-200 text-amber-950 font-medium'
                          : isStaff
                          ? 'bg-[#7A0F29] text-[#FFF7E8] rounded-tr-xs'
                          : 'bg-stone-100 text-[#171316] rounded-tl-xs'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1.5 font-bold text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded text-[#7A0F29]"
                    />
                    <span>Post as Internal Staff Note (Hidden from customer)</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={isInternalNote ? "Write an internal team note..." : "Type response to customer..."}
                    className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] focus:outline-none focus:border-[#7A0F29]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#7A0F29] text-[#FFF7E8] text-xs font-bold rounded-xl hover:bg-[#52091B] flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="m-auto text-center text-stone-400 space-y-2">
              <LifeBuoy className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-xs font-medium">Select a ticket from the queue to review and respond.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
