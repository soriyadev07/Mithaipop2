import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../BrandLogo';
import { sounds } from '../../utils/audio';
import { 
  Lock, 
  Mail, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginAdmin, resetPassword, setCurrentView } = useAuth();

  // Mode: 'login' | 'forgot'
  const [viewMode, setViewMode] = useState<'login' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      sounds.playError();
      setErrorMessage('Incorrect email or password.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await loginAdmin(email, password, rememberMe);
      if (res.success) {
        setSuccessMessage('Signing you in...');
      } else {
        setErrorMessage('Incorrect email or password.');
      }
    } catch {
      setErrorMessage('Incorrect email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      sounds.playError();
      setErrorMessage('Please enter your email address.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await resetPassword(forgotEmail);
      if (res.success) {
        setForgotSubmitted(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#171316] flex flex-col justify-between p-4 sm:p-8 font-sans antialiased">
      
      {/* Top Header with Back to Storefront and Logo */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-4">
        <button
          id="admin-login-back-btn"
          onClick={() => {
            sounds.playClick();
            setCurrentView('shop');
            window.location.hash = '#';
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#52091B] px-3.5 py-2 rounded-xl bg-white border border-stone-200 shadow-xs transition-all hover:-translate-x-0.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Mithai Pop</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
          <ShieldCheck className="w-4 h-4 text-[#52091B]" />
          <span className="hidden sm:inline">Admin Access</span>
        </div>
      </header>

      {/* Main Centered Minimal Admin Login Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white border border-stone-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-xl shadow-stone-900/5 relative overflow-hidden">
          
          {/* Official Mithai Pop Logo */}
          <div className="flex justify-center mb-6 scale-95 sm:scale-100">
            <BrandLogo />
          </div>

          {/* ===================================================
              VIEW 1: ADMIN LOGIN FORM
             =================================================== */}
          {viewMode === 'login' && (
            <div className="animate-in fade-in duration-200">
              
              {/* Heading */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold font-display text-[#2A050D] tracking-tight">
                  Admin Login
                </h1>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-semibold animate-in shake duration-300">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Alert */}
              {successMessage && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div>
                  <label htmlFor="admin-email-input" className="block text-xs font-bold text-stone-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      disabled={isLoading}
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#52091B] focus:ring-1 focus:ring-[#52091B] transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="admin-password-input" className="block text-xs font-bold text-stone-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=""
                      disabled={isLoading}
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#52091B] focus:ring-1 focus:ring-[#52091B] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox & Forgot Password Link */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      id="admin-remember-me-checkbox"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-stone-300 text-[#52091B] focus:ring-[#52091B]"
                    />
                    <span className="text-xs text-stone-600 font-medium">Remember me</span>
                  </label>

                  <button
                    id="admin-forgot-password-link"
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setViewMode('forgot');
                      setErrorMessage(null);
                    }}
                    className="text-xs font-semibold text-[#52091B] hover:underline focus:outline-none cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Primary Action Button: Sign In */}
                <button
                  id="admin-signin-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3 sm:py-3.5 px-6 rounded-xl bg-[#52091B] hover:bg-[#3D0713] text-[#FFF7E8] font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing you in...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* ===================================================
              VIEW 2: FORGOT PASSWORD
             =================================================== */}
          {viewMode === 'forgot' && (
            <div className="animate-in fade-in duration-200">
              
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold font-display text-[#2A050D] tracking-tight">
                  Reset password
                </h1>
                <p className="text-stone-500 text-xs mt-1.5">
                  Enter your email address to receive password reset instructions.
                </p>
              </div>

              {forgotSubmitted ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900">Check your inbox</h3>
                    <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                      If an account exists for this email, password reset instructions have been sent.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setViewMode('login');
                      setForgotSubmitted(false);
                    }}
                    className="py-2.5 px-5 bg-[#52091B] text-[#FFF7E8] font-bold text-xs rounded-xl hover:bg-[#3D0713] transition-colors cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="forgot-admin-email" className="block text-xs font-bold text-stone-700 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-admin-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder=""
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#52091B]"
                      />
                    </div>
                  </div>

                  <button
                    id="admin-send-reset-link-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#52091B] hover:bg-[#3D0713] text-[#FFF7E8] font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setViewMode('login');
                        setErrorMessage(null);
                      }}
                      className="text-xs font-bold text-stone-500 hover:text-[#52091B] cursor-pointer"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>

        {/* Security / Encrypted session note */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-medium">
          <Lock className="w-3 h-3 text-stone-400" />
          <span>Encrypted 256-bit SSL Admin Gateway</span>
        </div>
      </main>

      {/* Clean Bottom Copyright */}
      <footer className="text-center text-[11px] text-stone-400 py-3">
        © {new Date().getFullYear()} Mithai Pop Foods Pvt. Ltd. All rights reserved.
      </footer>

    </div>
  );
};
