import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { WaitlistEntry } from '../../../types';
import { 
  Users, 
  Download, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Eye, 
  Trash2, 
  TrendingUp, 
  Target, 
  Clock, 
  Sparkles,
  Share2,
  Calendar,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Plus,
  RefreshCw,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const AdminWaitlistTab: React.FC = () => {
  const { 
    waitlistEntries, 
    deleteWaitlistEntry, 
    exportWaitlistToCSV, 
    addWaitlistSignup, 
    reloadWaitlistFromDatabase, 
    settings 
  } = useStoreData();

  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [popFilter, setPopFilter] = useState('ALL');
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New manual test entry form state
  const [newTestEntry, setNewTestEntry] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    favoritePop: 'Gulab Jamun Pop',
    referralSource: 'Meta Ad',
    source: 'Meta Ads',
    campaign: 'brand_launch_mumbai',
    utmSource: 'meta',
    utmMedium: 'cpc',
    utmCampaign: 'brand_launch_mumbai',
    utmContent: 'can_art_video',
    fbclid: 'fb_clk_' + Math.random().toString(36).substring(2, 10),
    consent: true
  });

  const handleRefreshDatabase = async () => {
    setIsRefreshing(true);
    sounds.playClick();
    if (reloadWaitlistFromDatabase) {
      await reloadWaitlistFromDatabase();
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Calculate high-level campaign metrics
  const stats = useMemo(() => {
    const total = waitlistEntries.length;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const todayCount = waitlistEntries.filter((w) => {
      const d = new Date(w.dateJoined).getTime();
      return d >= todayStart;
    }).length;

    const metaAdsCount = waitlistEntries.filter((w) => 
      (w.source || '').toLowerCase().includes('meta') || 
      (w.utmSource || '').toLowerCase().includes('meta') ||
      (w.utmSource || '').toLowerCase().includes('facebook') ||
      (w.utmSource || '').toLowerCase().includes('instagram') ||
      !!w.fbclid
    ).length;

    const directCount = waitlistEntries.filter((w) => 
      (w.source || '').toLowerCase().includes('direct') || 
      (!w.utmSource && !w.fbclid)
    ).length;

    // Top traffic source
    const sourceCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    const popCounts: Record<string, number> = {};

    waitlistEntries.forEach((w) => {
      const src = w.source || 'Direct';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;

      if (w.city && w.city.trim()) {
        const c = w.city.trim();
        cityCounts[c] = (cityCounts[c] || 0) + 1;
      }

      const p = w.favoritePop || w.preferredFlavor || 'All Flavours';
      popCounts[p] = (popCounts[p] || 0) + 1;
    });

    let topCity = 'None';
    let maxCity = 0;
    Object.entries(cityCounts).forEach(([k, v]) => {
      if (v > maxCity) {
        maxCity = v;
        topCity = k;
      }
    });

    let topPop = 'None';
    let maxPop = 0;
    Object.entries(popCounts).forEach(([k, v]) => {
      if (v > maxPop) {
        maxPop = v;
        topPop = k;
      }
    });

    return {
      total,
      todayCount,
      metaAdsCount,
      directCount,
      topCity: total > 0 ? topCity : 'None',
      topPop: total > 0 ? topPop : 'None',
    };
  }, [waitlistEntries]);

  // Unique lists for filters
  const availableSources = useMemo(() => {
    const s = new Set<string>();
    waitlistEntries.forEach((w) => {
      if (w.source) s.add(w.source);
    });
    return Array.from(s);
  }, [waitlistEntries]);

  const availableCities = useMemo(() => {
    const c = new Set<string>();
    waitlistEntries.forEach((w) => {
      if (w.city && w.city.trim()) c.add(w.city.trim());
    });
    return Array.from(c);
  }, [waitlistEntries]);

  const availablePops = useMemo(() => {
    const p = new Set<string>();
    waitlistEntries.forEach((w) => {
      const popName = w.favoritePop || w.preferredFlavor;
      if (popName && popName.trim()) p.add(popName.trim());
    });
    return Array.from(p);
  }, [waitlistEntries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return waitlistEntries.filter((entry) => {
      const term = searchTerm.toLowerCase();
      const popName = entry.favoritePop || entry.preferredFlavor || '';
      const matchesSearch = 
        !searchTerm ||
        entry.fullName.toLowerCase().includes(term) ||
        entry.email.toLowerCase().includes(term) ||
        entry.phone.toLowerCase().includes(term) ||
        (entry.city && entry.city.toLowerCase().includes(term)) ||
        (entry.referralSource && entry.referralSource.toLowerCase().includes(term)) ||
        popName.toLowerCase().includes(term);

      const matchesSource = sourceFilter === 'ALL' || entry.source === sourceFilter;
      const matchesCity = cityFilter === 'ALL' || entry.city === cityFilter;
      const matchesPop = popFilter === 'ALL' || popName === popFilter;

      return matchesSearch && matchesSource && matchesCity && matchesPop;
    });
  }, [waitlistEntries, searchTerm, sourceFilter, cityFilter, popFilter]);

  const handleCopyEmails = () => {
    const emails = filteredEntries.map((e) => e.email).filter(Boolean).join(', ');
    if (emails) {
      navigator.clipboard.writeText(emails);
      sounds.playCelebration();
      setCopiedEmails(true);
      setTimeout(() => setCopiedEmails(false), 2500);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the waitlist?`)) {
      deleteWaitlistEntry(id);
      sounds.playClick();
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
    }
  };

  const handleCreateTestSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestEntry.fullName || !newTestEntry.email || !newTestEntry.phone) {
      alert('Please provide name, email, and phone.');
      return;
    }

    await addWaitlistSignup({
      fullName: newTestEntry.fullName,
      email: newTestEntry.email,
      phone: newTestEntry.phone,
      city: newTestEntry.city,
      favoritePop: newTestEntry.favoritePop,
      preferredFlavor: newTestEntry.favoritePop,
      referralSource: newTestEntry.referralSource,
      source: newTestEntry.source,
      campaign: newTestEntry.campaign,
      utmSource: newTestEntry.utmSource,
      utmMedium: newTestEntry.utmMedium,
      utmCampaign: newTestEntry.utmCampaign,
      utmContent: newTestEntry.utmContent,
      fbclid: newTestEntry.fbclid,
      consent: newTestEntry.consent
    });

    setShowAddModal(false);
    setNewTestEntry({
      fullName: '',
      email: '',
      phone: '',
      city: 'Mumbai',
      favoritePop: 'Gulab Jamun Pop',
      referralSource: 'Meta Ad',
      source: 'Meta Ads',
      campaign: 'brand_launch_mumbai',
      utmSource: 'meta',
      utmMedium: 'cpc',
      utmCampaign: 'brand_launch_mumbai',
      utmContent: 'can_art_video',
      fbclid: 'fb_clk_' + Math.random().toString(36).substring(2, 10),
      consent: true
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header with Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black font-display text-[#171316]">
              Waitlist & Pre-Launch Campaign
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
              settings.waitlistMode 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-stone-100 text-stone-600'
            }`}>
              {settings.waitlistMode ? 'Active Campaign' : 'Standby Mode'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time subscriber leads, full attribution (UTM & fbclid), city preferences, and favorite Pops.
          </p>
        </div>

        {/* Global Export, Refresh & Copy Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRefreshDatabase}
            disabled={isRefreshing}
            title="Sync with Supabase database"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#7A0F29]' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Test Signup</span>
          </button>

          <button
            onClick={handleCopyEmails}
            disabled={filteredEntries.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            {copiedEmails ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copiedEmails ? 'Emails Copied!' : 'Copy Emails'}</span>
          </button>

          <button
            onClick={() => {
              exportWaitlistToCSV();
              sounds.playClick();
            }}
            disabled={waitlistEntries.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A0F29] text-[#FFF7E8] hover:bg-[#52091B] text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Signups */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Signups</span>
            <Users className="w-4 h-4 text-[#7A0F29]" />
          </div>
          <div className="text-2xl font-black font-display text-[#171316]">
            {stats.total}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">VIP launch list</p>
        </div>

        {/* Today's Signups */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-display text-emerald-700">
            {stats.todayCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Joined past 24 hrs</p>
        </div>

        {/* Meta Ads Signups */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Meta Ads</span>
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-display text-blue-800">
            {stats.metaAdsCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Paid social attribution</p>
        </div>

        {/* Top City */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Top City</span>
            <MapPin className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black font-display text-purple-900 truncate" title={stats.topCity}>
            {stats.topCity}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Highest regional interest</p>
        </div>

        {/* Top Flavor */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Top Pop Pick</span>
            <TrendingUp className="w-4 h-4 text-[#E5A93C]" />
          </div>
          <div className="text-sm font-black font-display text-[#171316] truncate" title={stats.topPop}>
            {stats.topPop}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Most requested flavor</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-3.5 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city, or pop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          {/* Source Filter */}
          <div className="flex items-center gap-1 text-xs text-stone-600">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium cursor-pointer"
            >
              <option value="ALL">All Sources ({stats.total})</option>
              <option value="Meta Ads">Meta Ads</option>
              <option value="Direct / Organic">Direct / Organic</option>
              {availableSources
                .filter((s) => s !== 'Meta Ads' && s !== 'Direct / Organic')
                .map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
            </select>
          </div>

          {/* City Filter */}
          {availableCities.length > 0 && (
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium cursor-pointer"
            >
              <option value="ALL">All Cities ({availableCities.length})</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {/* Pop Filter */}
          {availablePops.length > 0 && (
            <select
              value={popFilter}
              onChange={(e) => setPopFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium cursor-pointer"
            >
              <option value="ALL">All Pops</option>
              {availablePops.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
        {filteredEntries.length === 0 ? (
          /* ZERO STATE */
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black font-display text-[#171316]">
              No waitlist signups yet.
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Campaign signups will appear here once live. When visitors arrive from Meta Ads or the storefront, their submissions will be recorded instantly.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7A0F29] text-[#FFF7E8] text-xs font-bold rounded-xl cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Test Meta Ad Signup</span>
              </button>
            </div>
          </div>
        ) : (
          /* RESPONSIVE TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#171316]">
              <thead className="bg-stone-50/80 text-[11px] font-black uppercase tracking-wider text-stone-500 border-b border-stone-200/80">
                <tr>
                  <th className="px-5 py-3.5">Name & Contact</th>
                  <th className="px-5 py-3.5">City</th>
                  <th className="px-5 py-3.5">Favorite Pop</th>
                  <th className="px-5 py-3.5">Source / Channel</th>
                  <th className="px-5 py-3.5">Campaign & Attribution</th>
                  <th className="px-5 py-3.5">Date Joined</th>
                  <th className="px-5 py-3.5">Consent</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredEntries.map((entry) => {
                  const isMeta = 
                    (entry.source || '').toLowerCase().includes('meta') || 
                    (entry.utmSource || '').toLowerCase().includes('meta') ||
                    !!entry.fbclid;

                  const popName = entry.favoritePop || entry.preferredFlavor || 'All Flavours';

                  return (
                    <tr 
                      key={entry.id} 
                      className="hover:bg-[#FAF8F5]/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      {/* Name & Contact */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#171316] text-sm group-hover:text-[#7A0F29] transition-colors">
                          {entry.fullName}
                        </div>
                        <div className="text-stone-500 text-[11px] flex items-center gap-2 mt-0.5">
                          <span>{entry.email}</span>
                          <span>•</span>
                          <span>{entry.phone}</span>
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-5 py-4">
                        {entry.city ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {entry.city}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic text-[11px]">—</span>
                        )}
                      </td>

                      {/* Favorite Pop */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
                          {popName}
                        </span>
                      </td>

                      {/* Referral Source / Channel */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isMeta 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}>
                            {entry.source || 'Direct'}
                          </span>
                          {entry.referralSource && (
                            <p className="text-[10px] text-stone-500">
                              Via: {entry.referralSource}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Campaign */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-stone-800">
                          {entry.campaign || 'Website Direct'}
                        </span>
                        {entry.fbclid && (
                          <div className="text-[10px] text-blue-600 mt-0.5 font-mono">
                            fbclid tracked ✓
                          </div>
                        )}
                      </td>

                      {/* Date Joined */}
                      <td className="px-5 py-4 text-stone-500 text-[11px] whitespace-nowrap">
                        {new Date(entry.dateJoined).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                        <span className="block text-[10px] text-stone-400">
                          {new Date(entry.dateJoined).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Consent */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          entry.consent
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500'
                        }`}>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{entry.consent ? 'Opted In' : 'No'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedEntry(entry)}
                            title="View Full Attribution Details"
                            className="p-1.5 text-stone-400 hover:text-[#7A0F29] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id, entry.fullName)}
                            title="Delete Entry"
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ENTRY DETAILS MODAL */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#7A0F29] text-[#FFF7E8] flex items-center justify-center font-black text-xs">
                  VIP
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#171316]">Waitlist Lead Details</h3>
                  <p className="text-[11px] text-stone-500">ID: {selectedEntry.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* Contact Information */}
              <div className="bg-stone-50 rounded-2xl p-4 space-y-2 border border-stone-200/60">
                <h4 className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Contact Profile</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Full Name</span>
                    <span className="font-bold text-[#171316]">{selectedEntry.fullName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Email</span>
                    <span className="font-bold text-[#171316]">{selectedEntry.email}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Mobile</span>
                    <span className="font-bold text-[#171316]">{selectedEntry.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">City</span>
                    <span className="font-bold text-[#171316]">{selectedEntry.city || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Referral Source</span>
                    <span className="font-bold text-[#171316]">{selectedEntry.referralSource || selectedEntry.source || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Consent Given</span>
                    <span className="font-bold text-emerald-700">
                      {selectedEntry.consent ? 'Yes (Drop Alerts Enabled)' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Flavour & Signup Timestamp */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-amber-900/60 block">Favorite Pop</span>
                  <span className="font-bold text-amber-950 text-xs">
                    {selectedEntry.favoritePop || selectedEntry.preferredFlavor || 'All Flavours / Surprise Me'}
                  </span>
                </div>
                <div className="p-3.5 bg-stone-50 border border-stone-200/60 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Date & Time Joined</span>
                  <span className="font-bold text-stone-800 text-xs">
                    {new Date(selectedEntry.dateJoined).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Meta Ads & Marketing Attribution Details */}
              <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 border border-stone-200/60">
                <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                  <h4 className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                    Meta Ads & Campaign Attribution
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    {selectedEntry.source || 'Direct'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Campaign Name</span>
                    <span className="font-bold text-stone-800">{selectedEntry.campaign || 'Website Direct'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">UTM Source</span>
                    <span className="font-mono text-stone-800">{selectedEntry.utmSource || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">UTM Medium</span>
                    <span className="font-mono text-stone-800">{selectedEntry.utmMedium || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">UTM Campaign</span>
                    <span className="font-mono text-stone-800">{selectedEntry.utmCampaign || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">UTM Content</span>
                    <span className="font-mono text-stone-800">{selectedEntry.utmContent || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">UTM Term</span>
                    <span className="font-mono text-stone-800">{selectedEntry.utmTerm || 'N/A'}</span>
                  </div>
                </div>

                {/* fbclid */}
                <div className="pt-2 border-t border-stone-200/60">
                  <span className="text-stone-400 block text-[10px]">Meta Click ID (fbclid)</span>
                  <div className="bg-white p-2 rounded-xl border border-stone-200 mt-1 font-mono text-[11px] break-all text-stone-700">
                    {selectedEntry.fbclid || 'No fbclid parameter recorded (Organic/Direct Visit)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
              <button
                onClick={() => handleDelete(selectedEntry.id, selectedEntry.fullName)}
                className="px-3.5 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Delete Entry
              </button>

              <button
                onClick={() => setSelectedEntry(null)}
                className="px-5 py-2 bg-[#7A0F29] text-[#FFF7E8] hover:bg-[#52091B] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEST SIGNUP MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#171316]">Generate Test Meta Ad Signup</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTestSignup} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={newTestEntry.fullName}
                  onChange={(e) => setNewTestEntry({ ...newTestEntry, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@example.com"
                    value={newTestEntry.email}
                    onChange={(e) => setNewTestEntry({ ...newTestEntry, email: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98111 22334"
                    value={newTestEntry.phone}
                    onChange={(e) => setNewTestEntry({ ...newTestEntry, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newTestEntry.city}
                    onChange={(e) => setNewTestEntry({ ...newTestEntry, city: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Favorite Pop</label>
                  <input
                    type="text"
                    value={newTestEntry.favoritePop}
                    onChange={(e) => setNewTestEntry({ ...newTestEntry, favoritePop: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Source</label>
                  <select
                    value={newTestEntry.source}
                    onChange={(e) => setNewTestEntry({ ...newTestEntry, source: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Direct / Organic">Direct / Organic</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google Ads">Google Ads</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Referral</label>
                  <select
                    value={newTestEntry.referralSource}
                    onChange={(e) => setNewTestEntry({ ...newTestEntry, referralSource: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Meta Ad">Meta Ad</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Friend">Friend</option>
                    <option value="Google">Google</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7A0F29] text-[#FFF7E8] hover:bg-[#52091B] rounded-xl font-bold cursor-pointer"
                >
                  Insert Test Signup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
