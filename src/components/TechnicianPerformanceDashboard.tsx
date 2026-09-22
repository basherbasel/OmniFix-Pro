import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Calendar,
  Users,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useFirebaseStats } from '../hooks/useFirebaseStats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const DUMMY_CHART_DATA = [
  { name: 'السبت', orders: 12, revenue: 2400 },
  { name: 'الأحد', orders: 18, revenue: 3600 },
  { name: 'الاثنين', orders: 15, revenue: 3000 },
  { name: 'الثلاثاء', orders: 22, revenue: 4400 },
  { name: 'الأربعاء', orders: 30, revenue: 6000 },
  { name: 'الخميس', orders: 25, revenue: 5000 },
  { name: 'الجمعة', orders: 10, revenue: 2000 },
];

export const TechnicianPerformanceDashboard: React.FC = () => {
  const { stats, loading } = useFirebaseStats();

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">تحليل أداء المركز</h2>
          <p className="text-slate-500 text-sm">مراقبة الإنتاجية، الأرباح، وجودة الإصلاحات لحظياً</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> آخر 7 أيام
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-900/20 transition-all active:scale-95">
            تصدير تقرير PDF
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي الأرباح المتوقعة', value: '45,800 ر.س', sub: '+12% عن الشهر الماضي', icon: DollarSign, color: 'emerald', trend: 'up' },
          { label: 'طلبات الصيانة المنجزة', value: loading ? '...' : stats.completedRepairs + 1200, sub: 'معدل نجاح 98%', icon: CheckCircle2, color: 'indigo', trend: 'up' },
          { label: 'متوسط وقت الإصلاح', value: '45 دقيقة', sub: '-5 دقائق تحسن', icon: Clock, color: 'amber', trend: 'down' },
          { label: 'تقييم العملاء', value: '4.9/5.0', sub: 'بناءً على 850 تقييم', icon: Award, color: 'purple', trend: 'up' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] relative overflow-hidden"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 mb-4`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.label}</p>
              <h3 className="text-2xl font-black text-white">{item.value}</h3>
            </div>
            <div className={`mt-4 flex items-center gap-1 text-[10px] font-bold ${item.trend === 'up' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {item.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {item.sub}
            </div>
            {/* Background Shape */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${item.color}-500/5 rounded-full blur-2xl`}></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" /> مخطط النمو الأسبوعي
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> <span className="text-slate-400">الإيرادات</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <span className="text-slate-400">الطلبات</span></div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DUMMY_CHART_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity Leaderboard or Distribution */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" /> توزيع أعطال هذا الأسبوع
          </h3>
          
          <div className="space-y-4">
            {[
              { label: 'أعطال سوفت وير', percentage: 45, color: 'indigo' },
              { label: 'تبديل شاشات', percentage: 30, color: 'emerald' },
              { label: 'إصلاح IC باور', percentage: 15, color: 'amber' },
              { label: 'أعطال شبكة', percentage: 10, color: 'purple' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white">{item.percentage}%</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full bg-${item.color}-500 shadow-[0_0_8px_rgba(var(--tw-color-${item.color}-500),0.5)]`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-800">
            <div className="p-4 bg-indigo-600 text-white rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black">هدف الشهر</h4>
                <p className="text-[10px] opacity-80">أنجزت 85% من الهدف المخطط له</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px] font-black">
                85%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> أحداث نشطة الآن
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { user: 'أحمد علي', action: 'تم فك FRP لجهاز Galaxy S23', time: 'منذ دقيقتين', type: 'software' },
            { user: 'خالد منصور', action: 'إصلاح IC الشحن لجهاز iPhone 13', time: 'منذ 15 دقيقة', type: 'hardware' },
            { user: 'محمد حسن', action: 'إضافة حل جديد لموسوعة الأعطال', time: 'منذ ساعة', type: 'info' },
            { user: 'سامي فهد', action: 'تحميل فلاشة Samsung G998B', time: 'منذ ساعتين', type: 'download' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-bold text-white">{activity.user}</p>
                  <span className="text-[10px] text-slate-600 font-bold">{activity.time}</span>
                </div>
                <p className="text-xs text-slate-500">{activity.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
