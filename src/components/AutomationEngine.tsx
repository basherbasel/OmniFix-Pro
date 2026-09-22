import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Play, 
  Pause, 
  RotateCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Database,
  Globe,
  Settings
} from 'lucide-react';

interface AutomationTask {
  id: string;
  name: string;
  agent: 'silicon' | 'rf' | 'electronics' | 'security';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  logs: string[];
}

export const AutomationEngine: React.FC = () => {
  const [tasks, setTasks] = useState<AutomationTask[]>([
    { id: '1', name: 'تحليل معمارية SoC', agent: 'silicon', status: 'completed', progress: 100, logs: ['Scanning USB bus...', 'Device identified: MT6833', 'Payload generated.'] },
    { id: '2', name: 'فحص سلامة ملفات التقسيم (PIT)', agent: 'security', status: 'running', progress: 45, logs: ['Reading partition table...', 'Checking CRC headers...'] },
    { id: '3', name: 'معايرة مستشعرات التردد (RF)', agent: 'rf', status: 'pending', progress: 0, logs: [] },
  ]);

  const [isAutoPilot, setIsAutoPilot] = useState(false);

  return (
    <div className="flex flex-col gap-6 font-['Cairo'] animate-in fade-in duration-700">
      {/* Sovereign Header */}
      <div className="bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className={`p-5 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 ${isAutoPilot ? 'animate-pulse' : ''}`}>
              <Cpu className="w-10 h-10" />
            </div>
            {isAutoPilot && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-bounce"></span>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-1">محرك الأتمتة السيادي</h2>
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 font-black uppercase tracking-widest">Autonomous Hive Control</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold">النواة مستقرة</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsAutoPilot(!isAutoPilot)}
            className={`px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 transition-all ${
              isAutoPilot ? 'bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-900/20' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/20'
            }`}
          >
            {isAutoPilot ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            {isAutoPilot ? 'إيقاف الطيار الآلي' : 'تفعيل الطيار الآلي (Auto-Fix)'}
          </button>
          <button className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" /> طابور العمليات الذكي
            </h3>
            <span className="text-slate-500 text-xs font-bold">{tasks.length} عمليات مجدولة</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <motion.div 
                key={task.id}
                layout
                className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl hover:border-indigo-500/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                      task.status === 'running' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{task.name}</h4>
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Agent: {task.agent}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-black text-white">{task.progress}%</div>
                      <div className="text-[9px] text-slate-500 uppercase">{task.status}</div>
                    </div>
                    {task.status === 'running' && <RotateCw className="w-4 h-4 text-indigo-400 animate-spin" />}
                    {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    className={`h-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                  />
                </div>

                <div className="space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {task.logs.map((log, i) => (
                    <div key={i} className="text-[10px] font-mono text-slate-500 flex gap-2">
                      <span className="text-indigo-500/50">›</span> {log}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Intelligence Dashboard */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6">
            <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" /> مصفوفة البيانات العالمية
            </h3>
            
            <div className="space-y-4">
              {[
                { label: 'حلول السوفت وير المكتشفة', value: '1.2M', icon: Globe },
                { label: 'ثغرات الـ Bootrom النشطة', value: '45', icon: ShieldCheck },
                { label: 'دقة التشخيص (AI)', value: '99.2%', icon: Search },
                { label: 'عمليات ناجحة اليوم', value: '4,500', icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</span>
                  </div>
                  <span className="text-sm font-black text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-indigo-600/5 border border-indigo-600/10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
            <h4 className="text-xs font-black text-indigo-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> توصية النواة المركزية
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              نظام "الطيار الآلي" جاهز لتنفيذ عملية **Zero-Data-Loss Unlock** لجهاز Samsung المتصل حالياً. هل ترغب في البدء؟
            </p>
            <button className="w-full py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black shadow-lg shadow-indigo-900/40 hover:bg-indigo-500 transition-all">
              بدء العملية الذاتية فوراً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
