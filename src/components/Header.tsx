import React, { useState } from 'react';
import { 
  Menu,
  X,
  Sparkles, 
  Zap, 
  FileCode, 
  Settings2, 
  PackageCheck, 
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Activity,
  HardDrive,
  Wand2,
  Globe2,
  Bookmark,
  CheckCircle2,
  Share2,
  Search,
  Bell,
  Plus
} from 'lucide-react';
import { DeviceInfo } from '../types';
import { useAuth } from '../AuthContext';
import { PWAInstallButton } from './PWAInstallButton';
import { MOCK_SOCIAL_ACCOUNTS } from '../data/socialMockData';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { user } = useAuth();
  const connectedCount = MOCK_SOCIAL_ACCOUNTS.filter(a => a.status === 'connected').length;

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white transition-all hover:border-indigo-500/50"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black text-white tracking-tight">
                    تمكين الرقمية <span className="text-indigo-400 font-black">Pro</span>
                  </h1>
                  <span className="hidden sm:flex bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold items-center gap-1">
                    <Activity className="w-3 h-3 text-indigo-400 animate-pulse" /> المحرك الذكي نشط
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold">
                  استوديو صناعة وإدارة المحتوى الرقمي المتكامل
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex p-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white transition-all">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block"></div>
            <div 
              onClick={() => setCurrentTab('accounts')}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 flex items-center gap-2.5 cursor-pointer transition group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold group-hover:bg-emerald-600/30 transition-all">
                <Share2 className="w-4 h-4" />
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-slate-200 font-bold text-[10px] leading-tight">الحسابات النشطة</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span>{connectedCount} متصلة</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab('content-studio')}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">منشور جديد</span>
              <span className="sm:hidden">جديد</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/50 bg-slate-950/20 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setCurrentTab('dashboard')}
            className={`text-xs font-bold transition-colors ${currentTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            الرئيسية
          </button>
          <button 
            onClick={() => setCurrentTab('overview')}
            className={`text-xs font-bold transition-colors ${currentTab === 'overview' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            نظرة عامة
          </button>
          <button 
            onClick={() => setCurrentTab('calendar')}
            className={`text-xs font-bold transition-colors ${currentTab === 'calendar' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            الجدولة
          </button>
          <button 
            onClick={() => setCurrentTab('analytics')}
            className={`text-xs font-bold transition-colors ${currentTab === 'analytics' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            التقارير
          </button>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-800/50 px-2 py-1 rounded-lg">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>اتصال آمن</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-800/50 px-2 py-1 rounded-lg">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>AI: Ultra 3.7</span>
          </div>
        </div>
      </div>
    </header>
  );
};
