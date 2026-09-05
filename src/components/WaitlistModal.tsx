import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Phone, Mail, User, MapPin, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreData } from '../context/StoreDataContext';
import { getStoredAttribution } from '../utils/attribution';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

export const WaitlistModal: React.FC = () => {
  const { waitlistOpen, closeWaitlistModal, waitlistPreferredFlavor } = useCart();
  const { products, addWaitlistSignup } = useStoreData();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [favoritePop, setFavoritePop] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [consent, setConsent] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; phone?: string }>({});

  // Sync preferred flavor when modal opens
  useEffect(() => {
    if (waitlistOpen) {
      if (waitlistPreferredFlavor) {
        setFavoritePop(waitlistPreferredFlavor);
      } else {
        setFavoritePop('All Flavours / Surprise Me');
      }
      setIsSuccess(false);
      setIsDuplicate(false);
      setErrors({});
    }
  }, [waitlistOpen, waitlistPreferredFlavor]);

  if (!waitlistOpen) return null;

  const validate = () => {
    const newErrors: { fullName?: string; email?: string; phone?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      newErrors.phone = 'Please provide a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      sounds.playPop();
      return;
    }

    setIsSubmitting(true);
    const attribution = getStoredAttribution();

    try {
      const result = await addWaitlistSignup({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim() || undefined,
        favoritePop: favoritePop || 'All Flavours / Surprise Me',
        preferredFlavor: favoritePop || 'All Flavours / Surprise Me',
        referralSource: referralSource || undefined,
        source: attribution.source || 'Direct / Organic',
        campaign: attribution.campaign || 'Website Direct',
        utmSource: attribution.utmSource,
        utmMedium: attribution.utmMedium,
        utmCampaign: attribution.utmCampaign,
        utmContent: attribution.utmContent,
        utmTerm: attribution.utmTerm,
        fbclid: attribution.fbclid,
        consent,
      });

      sounds.playCelebration();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7A0F29', '#E5A93C', '#FFF7E8', '#2D5A27']
      });

      setIsDuplicate(Boolean(result?.isDuplicate));
      setIsSuccess(true);
    } catch (err) {
      console.error('Waitlist submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeWaitlistModal();
  };

  const handleExploreFlavors = () => {
    closeWaitlistModal();
    const el = document.getElementById('flavours') || document.getElementById('bestsellers');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      <div id="waitlist-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#171316]/75 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl border border-[#E5A93C]/30 shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Top Banner Accent */}
          <div className="h-2.5 w-full bg-linear-to-r from-[#7A0F29] via-[#E5A93C] to-[#7A0F29] shrink-0" />

          {/* Close Button */}
          <button
            id="waitlist-modal-close"
            onClick={handleClose}
            aria-label="Close waitlist popup"
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto p-6 sm:p-8">
            {!isSuccess ? (
              /* FORM VIEW */
              <div>
                {/* Header Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A0F29]/10 text-[#7A0F29] text-xs font-black uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>VIP Early Access • Pre-Launch</span>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl sm:text-3xl font-black font-display text-[#171316] leading-tight">
                  Be First in Line.
                </h3>
                <p className="text-stone-600 text-sm mt-1.5 leading-relaxed">
                  Mithai Pop is almost here. Join the waitlist and be the first to know when we launch.
                </p>

                {/* Selected flavour highlight if pre-filled */}
                {favoritePop && favoritePop !== 'All Flavours / Surprise Me' && (
                  <div className="mt-4 p-3 bg-[#FAF3E8] border border-[#E5A93C]/30 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#7A0F29] text-[#FFF7E8] flex items-center justify-center font-black text-xs">
                        MP
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Reserved Pop Choice</p>
                        <p className="text-xs font-bold text-[#7A0F29]">{favoritePop}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      VIP Priority
                    </span>
                  </div>
                )}

                {/* Waitlist Form */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#171316] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="waitlist-input-fullname"
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-stone-200'} rounded-xl text-sm focus:outline-none focus:border-[#7A0F29] transition-all`}
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.fullName}</p>}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-[#171316] mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="waitlist-input-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.email ? 'border-red-400 bg-red-50/20' : 'border-stone-200'} rounded-xl text-sm focus:outline-none focus:border-[#7A0F29] transition-all`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.email}</p>}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-[#171316] mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="waitlist-input-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.phone ? 'border-red-400 bg-red-50/20' : 'border-stone-200'} rounded-xl text-sm focus:outline-none focus:border-[#7A0F29] transition-all`}
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.phone}</p>}
                    <p className="text-[11px] text-stone-500 mt-1">
                      We'll only reach out with priority drop alerts. No spam ever.
                    </p>
                  </div>

                  {/* City (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-[#171316] mb-1">
                      City <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="waitlist-input-city"
                        type="text"
                        placeholder="e.g. Mumbai, Delhi, Bengaluru, etc."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-[#171316] focus:outline-none focus:border-[#7A0F29] transition-all"
                      />
                    </div>
                  </div>

                  {/* Favorite Pop Dropdown (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-[#171316] mb-1">
                      Which Pop are you most excited to try? <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <select
                      id="waitlist-select-favoritepop"
                      value={favoritePop}
                      onChange={(e) => setFavoritePop(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-[#171316] focus:outline-none focus:border-[#7A0F29] transition-all cursor-pointer"
                    >
                      <option value="All Flavours / Surprise Me">All Flavours / Surprise Me</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.cityInspiration || 'Classic Fusion'})
                        </option>
                      ))}
                      <option value="Build Your Own Custom Pop">Custom Fusion Pop</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* How did you hear about us? (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-[#171316] mb-1">
                      How did you hear about us? <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <HelpCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <select
                        id="waitlist-select-referralsource"
                        value={referralSource}
                        onChange={(e) => setReferralSource(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-[#171316] focus:outline-none focus:border-[#7A0F29] transition-all cursor-pointer"
                      >
                        <option value="">Select an option</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Meta Ad">Meta Ad</option>
                        <option value="Friend">Friend</option>
                        <option value="Google">Google</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Marketing Consent Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                    <input
                      id="waitlist-checkbox-consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#7A0F29] focus:ring-[#7A0F29] accent-[#7A0F29] cursor-pointer"
                    />
                    <span className="text-xs text-stone-600 leading-snug">
                      I’d like to receive Mithai Pop launch updates and exclusive drops.
                    </span>
                  </label>

                  {/* Submit CTA */}
                  <button
                    id="waitlist-submit-button"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#7A0F29] hover:bg-[#5E0A1E] text-[#FFF7E8] font-bold text-sm tracking-wide uppercase transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#FFF7E8] border-t-transparent rounded-full animate-spin" />
                        Joining...
                      </span>
                    ) : (
                      <>
                        <span>Join the Waitlist</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Micro trust notice */}
                  <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Free VIP Access • No credit card required</span>
                  </div>
                </form>
              </div>
            ) : (
              /* CONFIRMATION / SUCCESS VIEW */
              <div id="waitlist-success-view" className="text-center space-y-5 animate-in fade-in duration-300 py-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                    {isDuplicate ? 'Already Registered' : 'VIP Priority Access Confirmed'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-display text-[#171316]">
                    {isDuplicate ? "You're already on the list! 🎉" : "You're on the list! 🎉"}
                  </h3>
                  <p className="text-stone-600 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
                    {isDuplicate
                      ? `We have your reservation on file, ${fullName || 'friend'}. We'll let you know when Mithai Pop goes live.`
                      : `We'll let you know when Mithai Pop goes live. Thank you for joining the journey!`}
                  </p>
                </div>

                {/* Reservation summary pill */}
                <div className="p-4 bg-[#FAF3E8] border border-[#E5A93C]/30 rounded-2xl max-w-sm mx-auto text-left space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">Reserved Pop Preference:</span>
                    <span className="font-bold text-[#7A0F29]">{favoritePop || 'All Flavours'}</span>
                  </div>
                  {city && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">City:</span>
                      <span className="font-bold text-stone-800">{city}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">Priority Updates:</span>
                    <span className="font-bold text-stone-800">Email & Mobile</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    id="waitlist-success-explore-btn"
                    onClick={handleExploreFlavors}
                    className="px-6 py-3 rounded-2xl bg-[#7A0F29] hover:bg-[#5E0A1E] text-[#FFF7E8] font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    Explore More Pops
                  </button>
                  <button
                    id="waitlist-success-back-btn"
                    onClick={handleClose}
                    className="px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Back to Website
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
