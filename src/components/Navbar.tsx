import React, { useState, useEffect, useRef } from 'react';
import { BrandLogo } from './BrandLogo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingBag, Volume2, VolumeX, Menu, X, Sparkles, User as UserIcon, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audio';

export const Navbar: React.FC = () => {
  const { totalItems, openCart, setSearchOpen, isMuted, toggleAudioMute } = useCart();
  const { currentUser, isAuthenticated, isAdmin, currentView, setCurrentView } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);
  const prevCount = useRef(totalItems);

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

  const handleAdminNavigation = () => {
    sounds.playClick();
    setMobileMenuOpen(false);
    if (!isAuthenticated || !isAdmin) {
      setCurrentView('login');
      window.location.hash = '#admin/login';
    } else {
      setCurrentView('admin');
      window.location.hash = '#admin';
    }
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
              aria-label="मिठाई POP Home"
            >
              <BrandLogo variant="nav" />
            </a>

            {/* Desktop Editorial Nav Links with Animated Underline */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold uppercase tracking-widest text-[#FFF7E8]/90">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="group relative py-1 hover:text-[#F4BD38] transition-colors focus:outline-none"
                >
                  <span>{link.name}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#F4BD38] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                </button>
              ))}
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3 sm:gap-5">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudioMute}
              className="p-1.5 text-[#F2C76E] hover:text-[#FFF7E8] transition-colors flex items-center gap-1.5 focus:outline-none group"
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
              className="p-1.5 text-[#F2C76E] hover:text-[#FFF7E8] hover:scale-110 transition-all focus:outline-none"
              aria-label="Search Flavours"
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
              className={`relative p-1.5 text-[#F2C76E] hover:text-[#FFF7E8] hover:scale-110 transition-all focus:outline-none ${
                cartAnimate ? 'animate-cart-bounce text-[#F4BD38]' : ''
              }`}
              aria-label="Open Cart"
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

            {/* Dedicated Discreet ADMIN Button */}
            <button
              id="navbar-admin-btn"
              onClick={handleAdminNavigation}
              className="px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-[#FFF7E8]/85 hover:text-[#FFF7E8] bg-[#52091B]/40 hover:bg-[#7A0F29]/60 border border-[#F2C76E]/30 hover:border-[#F2C76E]/60 transition-all focus:outline-none cursor-pointer"
              aria-label="Store Admin Access"
              title="Store Admin Access"
            >
              ADMIN
            </button>

            {/* Editorial Primary Action CTA: ORDER NOW */}
            <button
              id="navbar-ordernow-btn"
              onClick={() => handleNavClick('#menu')}
              className="inline-flex items-center bg-[#F4BD38] text-[#52091B] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#FFF7E8] transition-all shadow-md active:scale-95 border border-[#F4BD38] btn-shimmer-sheen"
            >
              ORDER NOW
            </button>
          </div>

          {/* Mobile Right: Standard Three-Line Hamburger Menu Icon [☰] */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="navbar-mobile-toggle-btn"
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 text-[#F2C76E] hover:text-[#FFF7E8] focus:outline-none flex items-center justify-center"
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
                className="text-[#FFF7E8]/60 hover:text-[#FFF7E8] p-1 text-xs flex items-center gap-1"
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
                className="w-full text-left px-3.5 py-3 text-sm font-semibold tracking-wide text-[#FFF7E8] hover:text-[#F4BD38] hover:bg-[#52091B]/60 rounded-xl transition-colors min-h-[44px] flex items-center"
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
              className="w-full text-left px-3.5 py-3 text-sm font-semibold tracking-wide text-[#FFF7E8] hover:text-[#F4BD38] hover:bg-[#52091B]/60 rounded-xl transition-colors min-h-[44px] flex items-center justify-between"
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

            {/* Dedicated Mobile ADMIN Link */}
            <button
              id="mobile-nav-admin-btn"
              onClick={handleAdminNavigation}
              className="w-full text-left px-3.5 py-3 text-sm font-bold tracking-wider text-[#F2C76E] hover:text-[#FFF7E8] hover:bg-[#52091B]/60 rounded-xl transition-colors min-h-[44px] flex items-center justify-between"
            >
              <span>ADMIN</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#52091B] border border-[#F2C76E]/30 text-[#FFF7E8]/80">Portal</span>
            </button>

            {/* Order Now CTA */}
            <div className="pt-3">
              <button
                id="mobile-nav-ordernow-btn"
                onClick={() => handleNavClick('#menu')}
                className="w-full py-3.5 bg-[#F4BD38] text-[#52091B] font-black text-xs uppercase tracking-widest rounded-full text-center shadow-lg hover:bg-[#FFF7E8] active:scale-98 transition-all flex items-center justify-center gap-2 btn-shimmer-sheen"
              >
                <Sparkles className="w-4 h-4 text-[#52091B]" />
                ORDER NOW
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
