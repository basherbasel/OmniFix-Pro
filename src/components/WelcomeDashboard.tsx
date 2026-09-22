import React from 'react';
import { DeviceInfo } from '../types';
import { useFirebaseStats } from '../hooks/useFirebaseStats';
import { 
  Users, 
  Zap, 
  Sparkles, 
  Share2, 
  TrendingUp, 
  BarChart3, 
  PenTool, 
  ChevronRight, 
  CalendarDays,
  Activity,
  ShieldCheck,
  Wrench,
  Clock,
  ArrowUpRight,
  RefreshCw,
  LayoutDashboard,
  Microscope,
  Radio,
  Thermometer,
  ShieldAlert,
  Cpu,
  Fingerprint,
  ZapOff,
  AlertTriangle
} from 'lucide-react';

interface WelcomeDashboardProps {
  onSelectTab: (tabId: string) => void;
}

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({
  onSelectTab
}) => {
  const { stats, loading } = useFirebaseStats();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto font-['Cairo'] pb-12" dir="rtl">
      
      {/* Welcome Hero & Sovereign Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl border border-indigo-500/20">
          <div className="relative z-10">
            <div className="bg-indigo-500/20 backdrop-blur-md w-max px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              النواة المركزية OmniFix Pro نشطة
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">مركز التحكم <br/> السيادي FixAI Suite</h1>
            <p className="text-indigo-100/70 text-lg mb-8 max-w-lg opacity-90">
              بنية تحتية ذاتية التعلم لإدارة هندسة الهواتف، تشخيص الهاردوير، وحماية سلامة السوفت وير عبر أسراب الوكلاء الذكية.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onSelectTab('omnifix-core')}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-xl shadow-indigo-900/40 hover:-translate-y-1"
              >
                <Cpu className="w-5 h-5" /> إدارة أسراب الوكلاء
              </button>
              <button 
                onClick={() => onSelectTab('hardware-telemetry')}
                className="bg-slate-800/50 backdrop-blur-md border border-slate-700 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                مصفوفة التيليمتري <Activity className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Neural Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>

        {/* Real-time Hive Telemetry Matrix */}
        <div className="bg-slate-950 border border-indigo-500/20 rounded-[2rem] p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" /> حالة الأسراب (Hive Status)
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Autonomous</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'وكيل السيليكون (SoC)', value: 'مستعد', color: 'text-indigo-400', icon: Microscope },
                { label: 'وكيل الترددات (RF)', value: 'يراقب', color: 'text-emerald-400', icon: Radio },
                { label: 'وكيل الإلكترونيات', value: 'خامل', color: 'text-slate-500', icon: Thermometer },
                { label: 'وكيل الأمان (Firmware)', value: 'نشط', color: 'text-purple-400', icon: ShieldAlert }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <stat.icon className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400 text-[10px] font-bold">{stat.label}</span>
                  </div>
                  <span className={`text-[10px] font-black ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-[10px] text-slate-400 font-bold">تقرير النواة (Kernel Log):</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-200/70 text-[10px] leading-relaxed font-mono">
              [INFO] تم اكتشاف اتصال USB في وضع EDL 9008. بانتظار تصريح الموافقة السيادية لبدء سحب الذاكرة.
            </div>
          </div>
        </div>
      </div>

      {/* Agents Feature Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl font-black text-white">الوكلاء المتخصصون (Hive-Mind)</h2>
          <span className="text-slate-500 text-sm">أسراب ذكاء اصطناعي موجهة للهندسة الدقيقة</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Agent 1 */}
          <button onClick={() => onSelectTab('silicon-agent')} className="group p-6 rounded-3xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all text-right relative overflow-hidden shadow-lg">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Microscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">وكيل السيليكون</h3>
            <p className="text-xs text-slate-500 leading-relaxed">خبير في معمارية المعالجات (Qualcomm, MTK) وفك تشفير أوضاع الإقلاع العميقة.</p>
            <div className="mt-4 flex items-center text-indigo-400 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
              دخول النواة <ChevronRight className="w-3 h-3" />
            </div>
          </button>

          {/* Agent 2 */}
          <button onClick={() => onSelectTab('rf-agent')} className="group p-6 rounded-3xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all text-right relative overflow-hidden shadow-lg">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">وكيل الترددات (RF)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">متخصص في إصلاح أعطال الشبكة وتعديل ملفات NVRAM و EFS بدقة أمان عالية.</p>
            <div className="mt-4 flex items-center text-emerald-400 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
              فحص الترددات <ChevronRight className="w-3 h-3" />
            </div>
          </button>

          {/* Agent 3 */}
          <button onClick={() => onSelectTab('electronics-agent')} className="group p-6 rounded-3xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all text-right relative overflow-hidden shadow-lg">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Thermometer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">وكيل الإلكترونيات</h3>
            <p className="text-xs text-slate-500 leading-relaxed">يحلل قراءات التيار والجهد ويربطها بـ 3D BoardView لتحديد الآي سي التالف.</p>
            <div className="mt-4 flex items-center text-cyan-400 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
              تحليل الدوائر <ChevronRight className="w-3 h-3" />
            </div>
          </button>

          {/* Agent 4 */}
          <button onClick={() => onSelectTab('integrity-agent')} className="group p-6 rounded-3xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all text-right relative overflow-hidden shadow-lg">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">وكيل الأمان</h3>
            <p className="text-xs text-slate-500 leading-relaxed">حارس سلامة السوفت وير؛ يفحص توافق ملفات الفلاشة ويمنع موت الجهاز نهائياً.</p>
            <div className="mt-4 flex items-center text-amber-400 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
              فحص الحماية <ChevronRight className="w-3 h-3" />
            </div>
          </button>

        </div>
      </div>

      {/* Advanced Stats Footer Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-[2rem] bg-slate-950/50 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">محرك المعالجة</p>
            <h4 className="text-white font-bold">نظام Tamkeen AI 5.0</h4>
          </div>
        </div>
        <div className="p-5 rounded-[2rem] bg-slate-950/50 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">الأمان والخصوصية</p>
            <h4 className="text-white font-bold">تشفير بيانات فائق الأمان</h4>
          </div>
        </div>
        <div className="p-5 rounded-[2rem] bg-slate-950/50 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">تحديثات حية</p>
            <h4 className="text-white font-bold">تزامن فوري مع المنصات</h4>
          </div>
        </div>
      </div>

    </div>
  );
};
