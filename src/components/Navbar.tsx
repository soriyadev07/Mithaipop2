import React, { useState, useEffect, useRef } from 'react';
import { BrandLogo } from './BrandLogo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStoreData } from '../context/StoreDataContext';
import { 
  Search, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Gift,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { sounds } from '../utils/audio';

export const Navbar: React.FC = () => {
  const { totalItems, openCart, setSearchOpen, isMuted, toggleAudioMute, openWaitlistModal } = useCart();
  const { settings } = useStoreData();
  const { 
    currentUser, 
    isAuthenticated, 
    currentView, 
    setCurrentView, 
    setActiveAccountTab, 
    logout 
  } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);
  const prevCount = useRef(totalItems);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (totalItems > prevCount.current) {
      setCartAnimate(true);
      const timer = setTimeout(() => setCartAnimate(false), 600);
      return () => clearTimeout(timer);
    }
    prevCount.current = totalItems;
  }, [totalItems]);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'The Pops', href: '#menu' },
    { name: 'Our Story', href: '#story' },
    { name: 'Collections', href: '#cities' },
    { name: 'Build Your Pop', href: '#build-your-pop' },
    { name: 'Reviews', href: '#reviews' },
  ];

  const handleNavClick = (href: string) => {
    sounds.playClick();
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
    if (currentView !== 'shop') {
      setCurrentView('shop');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAccountClick = () => {
    sounds.playClick();
    if (!isAuthenticated) {
      setCurrentView('login');
      window.location.hash = '#login';
      setAccountDropdownOpen(false);
      setMobileMenuOpen(false);
    } else {
      setAccountDropdownOpen((prev) => !prev);
    }
  };

  const handleDropdownItemClick = (tab: string) => {
    sounds.playClick();
    setAccountDropdownOpen(false);
    setActiveAccountTab(tab);
    setCurrentView('account');
    if (tab === 'overview') {
      window.location.hash = '#account';
    } else {
      window.location.hash = `#account-${tab}`;
    }
  };

  const handleLogoutClick = () => {
    sounds.playClick();
    setAccountDropdownOpen(false);
    logout();
    setCurrentView('shop');
    window.location.hash = '#';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#2A050D]/92 backdrop-blur-md border-b border-[#F2C76E]/20 shadow-xl py-3'
          : 'bg-[#2A050D]/75 backdrop-blur-md border-b border-[#F2C76E]/15 py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between">
          
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8 lg:gap-12">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
              className="flex items-center gap-2.5 focus:outline-none group transform hover:scale-102 transition-transform"
              aria-label="Mithai POP Home"
            >
              <BrandLogo variant="nav" />
            </a>

            {/* Desktop Editorial Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold uppercase tracking-widest text-[#FFF7E8]/90">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="group relative py-1 hover:text-[#F4BD38] transition-colors focus:outline-none cursor-pointer"
                >
                  <span>{link.name}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#F4BD38] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </button>
              ))}
            </nav>
          </div>

          {/* Desktop Right Actions: Audio, Search, Cart, Account, Order Now */}
          <div className="hidden lg:flex items-center gap-3 sm:gap-5">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudioMute}
              className="p-1.5 text-[#F2C76E] hover:text-[#FFF7E8] transition-colors flex items-center gap-1.5 focus:outline-none group cursor-pointer"
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              aria-label="Sound Toggle"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-[#F4BD38] group-hover:scale-110 transition-transform" />}
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {isMuted ? 'Muted' : 'SFX'}
              </span>
            </button>

            {/* Search Icon */}
            <button
              id="navbar-search-btn"
              onClick={() => {
                sounds.playClick();
                setSearchOpen(true);
              }}
              className="p-1.5 text-[#F2C76E] hover:text-[#FFF7E8] hover:scale-110 transition-all focus:outline-none cursor-pointer"
              aria-label="Search Flavours"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon with Counter & Bounce */}
            <button
              id="navbar-cart-btn"
              onClick={() => {
                sounds.playClick();
                openCart();
              }}
              className={`relative p-1.5 text-[#F2C76E] hover:text-[#FFF7E8] hover:scale-110 transition-all focus:outline-none cursor-pointer ${
                cartAnimate ? 'animate-cart-bounce text-[#F4BD38]' : ''
              }`}
              aria-label="Open Cart"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className={`absolute -top-1 -right-2 w-4 h-4 bg-[#F4BD38] text-[#52091B] text-[9px] font-black rounded-full flex items-center justify-center border border-[#2A050D] shadow-sm ${
                  cartAnimate ? 'scale-125' : 'scale-100'
                } transition-transform`}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Customer Account Icon with Floating Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="navbar-account-btn"
                onClick={handleAccountClick}
                className="p-1.5 text-[#F2C76E] hover:text-[#FFF7E8] hover:scale-110 transition-all focus:outline-none cursor-pointer flex items-center gap-1 group"
                aria-label="Account"
                title={isAuthenticated ? `Account (${currentUser?.fullName || 'Logged In'})` : 'Sign In / Account'}
              >
                <div className={`p-1 rounded-full transition-colors ${isAuthenticated ? 'bg-[#F4BD38]/20 ring-1 ring-[#F4BD38]/40 text-[#F4BD38]' : ''}`}>
                  <UserIcon className="w-5 h-5" />
                </div>
                {isAuthenticated && (
                  <ChevronDown className={`w-3 h-3 text-[#F2C76E] transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                )}
              </button>

              {/* Floating Dropdown for Logged In Customer */}
              {isAuthenticated && accountDropdownOpen && (
                <div 
                  id="navbar-account-dropdown"
                  className="absolute right-0 mt-3 w-56 bg-[#FFFDF9] border border-stone-200/90 rounded-2xl shadow-xl shadow-stone-900/10 py-2 z-50 text-[#171316] animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* User Profile Header */}
                  <div className="px-4 py-2.5 border-b border-stone-100 mb-1">
                    <p className="text-xs font-bold text-[#52091B] truncate">{currentUser?.fullName || 'Customer'}</p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser?.email || ''}</p>
                  </div>

                  {/* Account Links */}
                  <div className="space-y-0.5 px-1.5 text-xs font-medium">
                    <button
                      onClick={() => handleDropdownItemClick('overview')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-700 hover:text-[#52091B] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-stone-400" />
                      <span>My Account</span>
                    </button>

                    <button
                      onClick={() => handleDropdownItemClick('orders')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-700 hover:text-[#52091B] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-stone-400" />
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={() => handleDropdownItemClick('wishlist')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-700 hover:text-[#52091B] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-stone-400" />
                      <span>Wishlist</span>
                    </button>

                    <button
                      onClick={() => handleDropdownItemClick('addresses')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-700 hover:text-[#52091B] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-stone-400" />
                      <span>Saved Addresses</span>
                    </button>

                    <button
                      onClick={() => handleDropdownItemClick('gifts')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-700 hover:text-[#52091B] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Gift className="w-4 h-4 text-stone-400" />
                      <span>Gift Orders</span>
                    </button>

                    <button
                      onClick={() => handleDropdownItemClick('notifications')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-700 hover:text-[#52091B] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Bell className="w-4 h-4 text-stone-400" />
                      <span>Notifications</span>
                    </button>
                  </div>

                  {/* Sign Out Action */}
                  <div className="pt-1.5 mt-1.5 border-t border-stone-100 px-1.5">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-semibold text-xs flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Editorial Primary Action CTA: ORDER NOW or JOIN WAITLIST */}
            {settings.waitlistMode ? (
              <button
                id="navbar-ordernow-btn"
                onClick={() => {
                  sounds.playClick();
                  openWaitlistModal();
                }}
                className="inline-flex items-center bg-[#F4BD38] text-[#52091B] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#FFF7E8] transition-all shadow-md active:scale-95 border border-[#F4BD38] btn-shimmer-sheen cursor-pointer gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#52091B]" />
                <span>JOIN WAITLIST</span>
              </button>
            ) : (
              <button
                id="navbar-ordernow-btn"
                onClick={() => handleNavClick('#menu')}
                className="inline-flex items-center bg-[#F4BD38] text-[#52091B] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#FFF7E8] transition-all shadow-md active:scale-95 border border-[#F4BD38] btn-shimmer-sheen cursor-pointer"
              >
                ORDER NOW
              </button>
            )}
          </div>

          {/* Mobile Right: Account Icon & Three-Line Hamburger Menu Icon [☰] */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            {/* Mobile Account Icon */}
            <button
              id="mobile-account-btn"
              onClick={handleAccountClick}
              className="p-1.5 text-[#F2C76E] hover:text-[#FFF7E8] transition-colors focus:outline-none cursor-pointer"
              aria-label="Account"
              title="Account"
            >
              <div className={`p-1 rounded-full ${isAuthenticated ? 'bg-[#F4BD38]/20 text-[#F4BD38]' : ''}`}>
                <UserIcon className="w-5 h-5" />
              </div>
            </button>

            {/* Mobile Cart Button */}
            <button
              id="mobile-cart-icon-btn"
              onClick={() => {
                sounds.playClick();
                openCart();
              }}
              className="relative p-1.5 text-[#F2C76E] hover:text-[#FFF7E8] transition-colors focus:outline-none cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#F4BD38] text-[#52091B] text-[9px] font-black rounded-full flex items-center justify-center border border-[#2A050D]">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Button [☰] */}
            <button
              id="navbar-mobile-toggle-btn"
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 text-[#F2C76E] hover:text-[#FFF7E8] focus:outline-none flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              title="Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7 text-[#F4BD38]" />
              ) : (
                <div className="w-7 h-7 flex flex-col justify-center gap-1.5 p-0.5">
                  <span className="w-full h-0.5 bg-[#F2C76E] rounded-full transition-all" />
                  <span className="w-full h-0.5 bg-[#F2C76E] rounded-full transition-all" />
                  <span className="w-full h-0.5 bg-[#F2C76E] rounded-full transition-all" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Full Dropdown Navigation Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 bg-[#2A050D]/98 backdrop-blur-xl border border-[#F2C76E]/30 rounded-2xl p-5 shadow-2xl space-y-1 animate-in fade-in duration-200">
            {/* Header inside drawer */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F2C76E]/20">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#F2C76E]">Menu</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setMobileMenuOpen(false);
                }}
                className="text-[#FFF7E8]/60 hover:text-[#FFF7E8] p-1 text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Standard Nav Links */}
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left px-3.5 py-3 text-sm font-semibold tracking-wide text-[#FFF7E8] hover:text-[#F4BD38] hover:bg-[#52091B]/60 rounded-xl transition-colors min-h-[44px] flex items-center cursor-pointer"
              >
                {link.name}
              </button>
            ))}

            {/* Cart Link in Mobile Menu */}
            <button
              id="mobile-nav-cart-btn"
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(false);
                openCart();
              }}
              className="w-full text-left px-3.5 py-3 text-sm font-semibold tracking-wide text-[#FFF7E8] hover:text-[#F4BD38] hover:bg-[#52091B]/60 rounded-xl transition-colors min-h-[44px] flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#F2C76E]" />
                <span>Cart</span>
              </div>
              {totalItems > 0 && (
                <span className="bg-[#F4BD38] text-[#52091B] text-xs font-black px-2 py-0.5 rounded-full">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              )}
            </button>

            {/* Order Now or Join Waitlist CTA */}
            <div className="pt-3">
              {settings.waitlistMode ? (
                <button
                  id="mobile-nav-ordernow-btn"
                  onClick={() => {
                    sounds.playClick();
                    setMobileMenuOpen(false);
                    openWaitlistModal();
                  }}
                  className="w-full py-3.5 bg-[#F4BD38] text-[#52091B] font-black text-xs uppercase tracking-widest rounded-full text-center shadow-lg hover:bg-[#FFF7E8] active:scale-98 transition-all flex items-center justify-center gap-2 btn-shimmer-sheen cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#52091B]" />
                  JOIN THE WAITLIST
                </button>
              ) : (
                <button
                  id="mobile-nav-ordernow-btn"
                  onClick={() => handleNavClick('#menu')}
                  className="w-full py-3.5 bg-[#F4BD38] text-[#52091B] font-black text-xs uppercase tracking-widest rounded-full text-center shadow-lg hover:bg-[#FFF7E8] active:scale-98 transition-all flex items-center justify-center gap-2 btn-shimmer-sheen cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#52091B]" />
                  ORDER NOW
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
