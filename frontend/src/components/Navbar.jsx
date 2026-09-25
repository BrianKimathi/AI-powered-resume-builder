import React from 'react';
import { Sparkles, Palette, CreditCard, User, LogIn, ChevronDown } from 'lucide-react';

export default function Navbar({
  currentView,
  handleNavigate,
  user,
  dbTemplatesCount,
  userDropdownOpen,
  setUserDropdownOpen,
  userDropdownRef,
  handleLogout
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div onClick={() => handleNavigate('landing')} className="flex items-center gap-3 cursor-pointer">
          <div className="p-2 bg-sky-600 rounded-lg text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-100 block leading-none">
              ResumAI SaaS Platform
            </span>
            <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">
              Multi-Industry AI Resume Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleNavigate('templates')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              currentView === 'templates' ? 'bg-sky-600/20 border-sky-500 text-sky-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}>
            <Palette className="w-3.5 h-3.5 text-sky-400" /> Templates ({dbTemplatesCount})
          </button>

          <button 
            onClick={() => {
              if (user) {
                handleNavigate('plans');
              } else {
                handleNavigate('login');
              }
            }}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              currentView === 'plans' ? 'bg-sky-600/20 border-sky-500 text-sky-300' : 'bg-slate-900 border-slate-800 text-sky-400 hover:border-sky-500'
            }`}>
            <CreditCard className="w-3.5 h-3.5 text-sky-400" /> Pricing & Plans
          </button>

          {user ? (
            <div className="relative" ref={userDropdownRef}>
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 transition text-left">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner">
                  {(user.fullName || user.email || 'U').charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-xs text-slate-200 block leading-tight">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <span className="text-[9px] font-semibold text-sky-400 block leading-none mt-0.5">
                    {user.tier !== 'FREE' ? 'PRO Member' : 'Free Tier'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-slate-100">{user.fullName || 'Account Owner'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavigate('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-sky-300 flex items-center gap-2 transition">
                      <User className="w-3.5 h-3.5 text-sky-400" /> Account Profile & Subscriptions
                    </button>

                    <button 
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavigate('plans');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-indigo-300 flex items-center justify-between transition">
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Upgrade & Pricing
                      </span>
                      {user.tier === 'FREE' && (
                        <span className="px-1.5 py-0.5 bg-sky-500/20 text-sky-300 rounded text-[9px] font-bold">PRO</span>
                      )}
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button 
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition">
                      <LogIn className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => handleNavigate('login')} className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5 text-sky-400" /> Sign In
              </button>
              <button onClick={() => handleNavigate('register')} className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-xs shadow">
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
