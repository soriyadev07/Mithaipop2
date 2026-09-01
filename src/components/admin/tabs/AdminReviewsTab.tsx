import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { Review } from '../../../types';
import { 
  Star, 
  Search, 
  Download, 
  Check, 
  EyeOff, 
  Trash2, 
  ThumbsUp, 
  MapPin,
  Sparkles,
  X
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const AdminReviewsTab: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview, exportDataToCSV } = useStoreData();
  const [reviewSearch, setReviewSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesSearch = 
        !reviewSearch.trim() ||
        r.author.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.city.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.favoritePop.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.comment.toLowerCase().includes(reviewSearch.toLowerCase());

      const matchesRating = ratingFilter === 'all' || r.rating.toString() === ratingFilter;
      const matchesStatus = statusFilter === 'all' || (r.status || 'approved') === statusFilter;

      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [reviews, reviewSearch, ratingFilter, statusFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this customer review?')) {
      deleteReview(id);
      sounds.playClick();
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : '5.0';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Customer Reviews & Upcycling Stories
          </h2>
          <p className="text-xs text-stone-500">
            Moderate verified buyer feedback, taste reviews, and aluminum canister upcycling stories.
          </p>
        </div>

        <button
          onClick={() => exportDataToCSV('reviews')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Reviews CSV</span>
        </button>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Average Customer Rating</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-black font-display text-[#171316]">{avgRating} / 5.0</span>
              <div className="flex text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
            </div>
          </div>
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Submissions</span>
            <p className="text-2xl font-black font-display text-[#7A0F29] mt-1">{reviews.length} reviews</p>
          </div>
          <ThumbsUp className="w-6 h-6 text-[#7A0F29]" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Upcycling Stories</span>
            <p className="text-2xl font-black font-display text-emerald-700 mt-1">
              {reviews.filter(r => !!r.upcycledUse).length} stories
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={reviewSearch}
            onChange={(e) => setReviewSearch(e.target.value)}
            placeholder="Search by author, city, flavor, or review text..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {reviewSearch && (
            <button
              onClick={() => setReviewSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#7A0F29]"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars ★★★★★</option>
            <option value="4">4 Stars ★★★★</option>
            <option value="3">3 Stars ★★★</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#7A0F29]"
          >
            <option value="all">All Moderation States</option>
            <option value="approved">Approved & Live</option>
            <option value="pending">Pending Review</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <Star className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Reviews Found</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Customer reviews submitted on the public storefront will queue here for moderation.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-300 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#171316]">{rev.author}</span>
                  <span className="text-[11px] text-stone-400 flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {rev.city}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FFF7E8] text-[#7A0F29] border border-amber-200 font-bold">
                    {rev.favoritePop}
                  </span>
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span className={`text-[9px] px-2 py-0.2 rounded-full font-bold ${
                    rev.status === 'hidden'
                      ? 'bg-stone-100 text-stone-600'
                      : rev.status === 'pending'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {rev.status || 'approved'}
                  </span>
                </div>

                <p className="text-xs text-stone-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>

                {rev.upcycledUse && (
                  <div className="p-2 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-[#7A0F29] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Upcycle DIY Idea: {rev.upcycledUse}</span>
                  </div>
                )}
              </div>

              {/* Moderation Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    updateReviewStatus(rev.id, 'approved');
                    sounds.playCelebration();
                  }}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Approve and show on storefront"
                >
                  <Check className="w-3.5 h-3.5 inline mr-1" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={() => {
                    updateReviewStatus(rev.id, 'hidden');
                    sounds.playClick();
                  }}
                  className="px-3 py-1.5 bg-stone-100 text-stone-600 hover:bg-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Hide review"
                >
                  <EyeOff className="w-3.5 h-3.5 inline mr-1" />
                  <span>Hide</span>
                </button>

                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
