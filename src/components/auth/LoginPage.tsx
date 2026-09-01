import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  User as UserIcon,
  Phone,
  Check
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { 
    login, 
    loginAdmin, 
    registerCustomer, 
    resetPassword, 
    setCurrentView,
    authViewMode,
    setAuthViewMode
  } = useAuth();

  // Determine if this is admin login flow or customer auth
  const [isAdminFlow, setIsAdminFlow] = useState<boolean>(() => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    return hash.startsWith('#admin/login') || hash.startsWith('#admin') || path.startsWith('/admin/login') || path.startsWith('/admin');
  });

  useEffect(() => {
    const handleRouteCheck = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      setIsAdminFlow(hash.startsWith('#admin/login') || hash.startsWith('#admin') || path.startsWith('/admin/login') || path.startsWith('/admin'));
    };
    window.addEventListener('hashchange', handleRouteCheck);
    window.addEventListener('popstate', handleRouteCheck);
    return () => {
      window.removeEventListener('hashchange', handleRouteCheck);
      window.removeEventListener('popstate', handleRouteCheck);
    };
  }, []);

  // Customer Active Tab: 'signin' | 'signup' | 'forgot'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(() => {
    return authViewMode === 'register' ? 'signup' : authViewMode === 'forgot' ? 'forgot' : 'signin';
  });

  useEffect(() => {
    if (authViewMode === 'register') setActiveTab('signup');
    else if (authViewMode === 'forgot') setActiveTab('forgot');
    else setActiveTab('signin');
  }, [authViewMode]);

  // Sign In Form States
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up Form States
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Admin Login States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [rememberAdmin, setRememberAdmin] = useState(true);

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Status & Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccessRedirecting, setIsSuccessRedirecting] = useState(false);

  // Reset errors on tab switch
  const switchTab = (tab: 'signin' | 'signup' | 'forgot') => {
    sounds.playClick();
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
    setForgotSubmitted(false);
    if (tab === 'signup') setAuthViewMode('register');
    else if (tab === 'forgot') setAuthViewMode('forgot');
    else setAuthViewMode('login');
  };

  // 1. Handle Customer Sign In
  const handleCustomerSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanInput || !cleanPass) {
      sounds.playError();
      setErrorMessage('Email or password is incorrect.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    // If prototype admin credentials entered here, route to admin login
    if (cleanInput === 'admin123@mail.com' && cleanPass === 'admin123@mail.com') {
      try {
        const res = await loginAdmin(cleanInput, cleanPass, true);
        if (res.success) {
          setIsSuccessRedirecting(true);
          setSuccessMessage('Signing in...');
        } else {
          setErrorMessage('Email or password is incorrect.');
        }
      } catch {
        setErrorMessage('Email or password is incorrect.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const res = await login(emailOrPhone, password);
      if (res.success) {
        setIsSuccessRedirecting(true);
        setSuccessMessage('Welcome back!');
      } else {
        setErrorMessage(res.error || 'Email or password is incorrect.');
      }
    } catch {
      setErrorMessage('Email or password is incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Customer Sign Up
  const handleCustomerSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpFullName.trim() || !signUpEmail.trim() || !signUpPhone.trim() || !signUpPassword) {
      sounds.playError();
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      sounds.playError();
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (signUpPassword.length < 6) {
      sounds.playError();
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await registerCustomer({
        fullName: signUpFullName,
        email: signUpEmail,
        phone: signUpPhone,
        password: signUpPassword,
      });

      if (res.success) {
        setIsSuccessRedirecting(true);
        setSuccessMessage('Account created successfully!');
      } else {
        setErrorMessage(res.error || 'Registration failed. Please try again.');
      }
    } catch {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Google Mock SignIn
  const handleGoogleSignIn = () => {
    sounds.playClick();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Auto register/login customer with Google profile
      registerCustomer({
        fullName: 'Google User',
        email: 'user@gmail.com',
        phone: '9876543210',
        password: 'password123',
      });
    }, 600);
  };

  // 4. Handle Admin Login Submit
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPass = adminPassword.trim();

    if (!cleanEmail || !cleanPass) {
      sounds.playError();
      setErrorMessage('Email or password is incorrect.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await loginAdmin(cleanEmail, cleanPass, rememberAdmin);
      if (res.success) {
        setIsSuccessRedirecting(true);
        setSuccessMessage('Signing you in to Admin Dashboard...');
      } else {
        setErrorMessage(res.error || 'Email or password is incorrect.');
      }
    } catch {
      setErrorMessage('Email or password is incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Handle Forgot Password Submit
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#171316] flex flex-col justify-between p-4 sm:p-8 font-sans antialiased selection:bg-[#F4BD38] selection:text-[#52091B]">
      
      {/* Top Header with Back to Storefront and Logo */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-4">
        <button
          id="auth-back-to-store-btn"
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

        {isAdminFlow && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#52091B] bg-[#52091B]/10 px-3 py-1 rounded-full border border-[#52091B]/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </div>
        )}
      </header>

      {/* Main Centered Authentication Card */}
      <main className="w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-white border border-stone-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-xl shadow-stone-900/5 relative overflow-hidden">
          
          {/* Brand Logo */}
          <div className="flex justify-center mb-6 scale-95 sm:scale-100">
            <BrandLogo />
          </div>

          {/* ===================================================
              ADMIN LOGIN FLOW (#admin/login)
             =================================================== */}
          {isAdminFlow ? (
            <div className="animate-in fade-in duration-200">
              
              <div className="text-center mb-6 space-y-1.5">
                <h1 className="text-2xl font-bold font-display text-[#2A050D] tracking-tight">
                  Admin Login
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Sign in to access store administration.
                </p>
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

              {/* Admin Form */}
              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="admin-email-field" className="block text-xs font-bold text-stone-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-email-field"
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder=""
                      disabled={isLoading}
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#52091B] focus:ring-1 focus:ring-[#52091B] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="admin-pass-field" className="block text-xs font-bold text-stone-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Please contact the store system administrator to reset admin staff access.')}
                      className="text-[11px] font-medium text-stone-500 hover:text-[#52091B] transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-pass-field"
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder=""
                      disabled={isLoading}
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#52091B] focus:ring-1 focus:ring-[#52091B] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberAdmin}
                      onChange={(e) => setRememberAdmin(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-stone-300 text-[#52091B] focus:ring-[#52091B]"
                    />
                    <span className="text-xs text-stone-600 font-medium">Remember me</span>
                  </label>
                </div>

                <button
                  id="admin-login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3 sm:py-3.5 px-6 rounded-xl bg-[#52091B] hover:bg-[#3D0713] text-[#FFF7E8] font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

            </div>
          ) : (

            /* ===================================================
               CUSTOMER AUTHENTICATION FLOW (/login, /signup)
               =================================================== */
            <div className="animate-in fade-in duration-200">

              {/* Heading & Supporting Text */}
              <div className="text-center mb-6 space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black font-display text-[#2A050D] tracking-tight">
                  Welcome to Mithai Pop
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                  Your favourite Pops are waiting.
                </p>
              </div>

              {/* Two Tabs Toggle: Sign In / Sign Up */}
              {activeTab !== 'forgot' && (
                <div className="flex p-1 bg-stone-100 rounded-xl mb-6 border border-stone-200/60">
                  <button
                    id="tab-customer-signin"
                    type="button"
                    onClick={() => switchTab('signin')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === 'signin'
                        ? 'bg-white text-[#52091B] shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    id="tab-customer-signup"
                    type="button"
                    onClick={() => switchTab('signup')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === 'signup'
                        ? 'bg-white text-[#52091B] shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-semibold animate-in shake duration-300">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Alert with Checkmark animation */}
              {successMessage && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{successMessage}</span>
                </div>
              )}

              {/* =======================
                  TAB 1: SIGN IN
                  ======================= */}
              {activeTab === 'signin' && (
                <form onSubmit={handleCustomerSignIn} className="space-y-4 animate-in fade-in duration-150">
                  {/* Email / Phone Field */}
                  <div>
                    <label htmlFor="customer-email" className="block text-xs font-bold text-stone-700 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="customer-email"
                        type="text"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="yourname@email.com"
                        disabled={isLoading || isSuccessRedirecting}
                        required
                        autoComplete="email"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29] focus:ring-1 focus:ring-[#7A0F29] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="customer-password" className="block text-xs font-bold text-stone-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => switchTab('forgot')}
                        className="text-xs font-semibold text-[#7A0F29] hover:underline focus:outline-none cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="customer-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={isLoading || isSuccessRedirecting}
                        required
                        autoComplete="current-password"
                        className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29] focus:ring-1 focus:ring-[#7A0F29] transition-all"
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

                  {/* Primary Sign In Button */}
                  <button
                    id="customer-signin-btn"
                    type="submit"
                    disabled={isLoading || isSuccessRedirecting}
                    className="w-full mt-3 py-3 sm:py-3.5 px-6 rounded-xl bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-stone-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-stone-400 font-medium">or</span>
                    </div>
                  </div>

                  {/* Continue with Google */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || isSuccessRedirecting}
                    className="w-full py-2.5 sm:py-3 px-4 border border-stone-200 hover:border-stone-300 rounded-xl bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Below the form: New to Mithai Pop? Create an Account */}
                  <div className="text-center pt-3">
                    <p className="text-xs text-stone-500 font-medium">
                      New to Mithai Pop?{' '}
                      <button
                        type="button"
                        onClick={() => switchTab('signup')}
                        className="font-bold text-[#7A0F29] hover:underline cursor-pointer"
                      >
                        Create an Account
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* =======================
                  TAB 2: SIGN UP
                  ======================= */}
              {activeTab === 'signup' && (
                <form onSubmit={handleCustomerSignUp} className="space-y-3.5 animate-in fade-in duration-150">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="signup-name" className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-name"
                        type="text"
                        value={signUpFullName}
                        onChange={(e) => setSignUpFullName(e.target.value)}
                        placeholder="Rahul Sharma"
                        disabled={isLoading || isSuccessRedirecting}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29] focus:ring-1 focus:ring-[#7A0F29] transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="signup-email" className="block text-xs font-bold text-stone-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-email"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="rahul@email.com"
                        disabled={isLoading || isSuccessRedirecting}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29] focus:ring-1 focus:ring-[#7A0F29] transition-all"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label htmlFor="signup-phone" className="block text-xs font-bold text-stone-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-phone"
                        type="tel"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="98765 43210"
                        disabled={isLoading || isSuccessRedirecting}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29] focus:ring-1 focus:ring-[#7A0F29] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="signup-pass" className="block text-xs font-bold text-stone-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-pass"
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        disabled={isLoading || isSuccessRedirecting}
                        required
                        className="w-full pl-10 pr-11 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29] focus:ring-1 focus:ring-[#7A0F29] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="signup-confirm-pass" className="block text-xs font-bold text-stone-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-confirm-pass"
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        disabled={isLoading || isSuccessRedirecting}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29] focus:ring-1 focus:ring-[#7A0F29] transition-all"
                      />
                    </div>
                  </div>

                  {/* Primary Create Account Button */}
                  <button
                    id="customer-create-account-btn"
                    type="submit"
                    disabled={isLoading || isSuccessRedirecting}
                    className="w-full mt-4 py-3 sm:py-3.5 px-6 rounded-xl bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>

                  {/* Below the form: Already have an account? Sign In */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-stone-500 font-medium">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchTab('signin')}
                        className="font-bold text-[#7A0F29] hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* =======================
                  TAB 3: FORGOT PASSWORD
                  ======================= */}
              {activeTab === 'forgot' && (
                <div className="animate-in fade-in duration-150">
                  <div className="text-center mb-5">
                    <h2 className="text-lg font-bold text-[#2A050D]">
                      Reset Your Password
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Enter your registered email address to receive password reset instructions.
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
                          If an account exists with {forgotEmail}, reset instructions have been sent.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => switchTab('signin')}
                        className="py-2.5 px-5 bg-[#7A0F29] text-[#FFF7E8] font-bold text-xs rounded-xl hover:bg-[#52091B] transition-colors cursor-pointer"
                      >
                        Return to Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="forgot-email" className="block text-xs font-bold text-stone-700 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="forgot-email"
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="yourname@email.com"
                            required
                            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29] transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] font-bold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
                      >
                        {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                      </button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => switchTab('signin')}
                          className="text-xs font-bold text-stone-500 hover:text-[#7A0F29] cursor-pointer"
                        >
                          Back to Sign In
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Encrypted secure session badge */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-medium">
          <Lock className="w-3 h-3 text-stone-400" />
          <span>Encrypted 256-bit SSL Session</span>
        </div>
      </main>

      {/* Clean Bottom Copyright */}
      <footer className="text-center text-[11px] text-stone-400 py-3">
        © {new Date().getFullYear()} Mithai Pop Foods Pvt. Ltd. All rights reserved.
      </footer>

    </div>
  );
};
