import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Eye, 
  MessageSquare, 
  Share2, 
  TrendingUp, 
  ArrowUpRight,
  Instagram,
  Twitter,
  Youtube,
  Plus
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MOCK_ANALYTICS, MOCK_SOCIAL_ACCOUNTS } from '../data/socialMockData';

export const SocialDashboard: React.FC = () => {
  const stats = [
    { label: 'إجمالي الوصول', value: '124.5K', change: '+12.5%', icon: Eye, color: 'text-blue-400' },
    { label: 'المتابعون الجدد', value: '3,420', change: '+18.2%', icon: Users, color: 'text-emerald-400' },
    { label: 'التفاعل', value: '8.4%', change: '+2.1%', icon: MessageSquare, color: 'text-purple-400' },
    { label: 'المشاركات', value: '1,240', change: '+5.4%', icon: Share2, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">لوحة تحكم تمكين الرقمية</h1>
          <p className="text-slate-400 text-sm">مرحباً بك مجدداً! إليك نظرة سريعة على أداء حساباتك اليوم.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
          <Plus className="w-5 h-5" />
          <span>إنشاء محتوى جديد</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-slate-800 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-400 text-xs">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              إحصائيات الوصول والتفاعل
            </h3>
            <select className="bg-slate-800 border-none text-xs text-white rounded-lg px-3 py-1.5 outline-none cursor-pointer">
              <option>آخر 7 أيام</option>
              <option>آخر 30 يوم</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ANALYTICS}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="views" stroke="#6366f1" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                <Area type="monotone" dataKey="engagement" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            الحسابات المتصلة
          </h3>
          <div className="space-y-4">
            {MOCK_SOCIAL_ACCOUNTS.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    acc.platform === 'instagram' ? 'bg-pink-500/20 text-pink-400' :
                    acc.platform === 'tiktok' ? 'bg-slate-700 text-white' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {acc.platform === 'instagram' && <Instagram className="w-4 h-4" />}
                    {acc.platform === 'twitter' && <Twitter className="w-4 h-4" />}
                    {acc.platform === 'youtube' && <Youtube className="w-4 h-4" />}
                    {acc.platform === 'tiktok' && <div className="w-4 h-4 flex items-center justify-center font-bold text-[10px]">T</div>}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-none mb-1">{acc.username}</div>
                    <div className="text-[10px] text-slate-400">{acc.followersCount.toLocaleString()} متابع</div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${acc.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
              </div>
            ))}
            <button className="w-full mt-4 py-3 border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl text-slate-400 hover:text-indigo-400 text-xs font-bold transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              ربط حساب جديد
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-white">النشاط الأخير</h3>
          <button className="text-indigo-400 text-xs hover:underline flex items-center gap-1">
            عرض الكل <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="w-12 h-12 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
                <img 
                  src={`https://picsum.photos/seed/${i + 40}/200`} 
                  alt="post" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white mb-1 truncate">تم نشر محتوى جديد: "أهمية التواجد الرقمي في 2026"</div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Instagram className="w-3 h-3" /> Instagram
                  </span>
                  <span className="text-[10px] text-slate-400">منذ 2 ساعة</span>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-emerald-400">+450 تفاعل</div>
                <div className="text-[10px] text-slate-500">تم بواسطة AI</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
