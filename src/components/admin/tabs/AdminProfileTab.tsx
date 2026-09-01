import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  User, 
  ShieldCheck, 
  Key, 
  Mail, 
  Phone, 
  Calendar, 
  LogOut, 
  Check, 
  Lock,
  Camera
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const AdminProfileTab: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    // In prototype, simulate password change
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    sounds.playCelebration();
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black font-display text-[#171316]">
          Staff Profile & Security Credentials
        </h2>
        <p className="text-xs text-stone-500">
          Manage your operations account details, assigned staff role permissions, and access credentials.
        </p>
      </div>

      {/* Staff Identity Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160'}
            alt={currentUser?.fullName || 'Staff Member'}
            className="w-24 h-24 rounded-3xl object-cover border-2 border-[#F2C76E] shadow-sm"
          />
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#7A0F29] text-[#F2C76E] shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-black font-display text-[#171316]">
                {currentUser?.fullName || 'Priya Varma'}
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {currentUser?.email || 'admin123@mail.com'}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7E8] border border-amber-200 text-[#7A0F29] text-xs font-bold self-center sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              {currentUser?.role?.replace('_', ' ') || 'STORE_ADMIN'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-400" />
              <span>{currentUser?.email || 'admin123@mail.com'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-stone-400" />
              <span>{currentUser?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>Active Staff Member</span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-stone-400" />
              <span>Full Store Access (Read/Write)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security: Change Password Form */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-black font-display text-[#171316] border-b border-stone-100 pb-3">
          <Lock className="w-4 h-4 text-[#7A0F29]" />
          <span>Security & Password Management</span>
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Password updated successfully.</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              required
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#7A0F29] text-[#FFF7E8] font-bold rounded-xl hover:bg-[#52091B] cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Sign Out Card */}
      <div className="p-6 bg-stone-50 border border-stone-200 rounded-3xl flex items-center justify-between">
        <div>
          <h4 className="text-xs font-black uppercase text-stone-800">End Session</h4>
          <p className="text-[11px] text-stone-500 mt-0.5">Securely sign out of the Mithai Pop operations system.</p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  );
};
