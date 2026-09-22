import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ShieldCheck,
  ArrowLeft,
  Database,
  RefreshCw
} from 'lucide-react';
import { ConsentRequirement } from '../types';

interface ConsentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: ConsentRequirement | null;
  onConfirm: () => void;
}

export const ConsentGateway: React.FC<ConsentGatewayProps> = ({ 
  isOpen, 
  onClose, 
  requirement, 
  onConfirm 
}) => {
  if (!isOpen || !requirement) return null;

  const riskColors = {
    safe: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
    moderate: 'bg-amber-500/20 text-amber-400 border-amber-400/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-400/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir="rtl">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] overflow-hidden shadow-2xl font-['Cairo']"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/50 to-transparent">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 animate-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">بوابة الموافقة السيادية</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Sovereign Consent Gateway</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className={`px-4 py-1.5 rounded-full text-xs font-black border ${riskColors[requirement.riskLevel]}`}>
                مستوى الخطر: {requirement.riskLevel.toUpperCase()}
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span className={`text-xs font-bold ${requirement.dataSafety === 'no_loss' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {requirement.dataSafety === 'no_loss' ? 'حماية البيانات: آمنة' : 'احتمالية فقدان بيانات'}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-black text-white mb-2">{requirement.actionTitle}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{requirement.description}</p>
            </div>

            {/* Steps & Probability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-3xl bg-slate-950/50 border border-slate-800">
                <h4 className="text-xs font-black text-slate-500 mb-4 uppercase tracking-tighter">الخطوات التنفيذية (Hive Steps)</h4>
                <div className="space-y-3">
                  {requirement.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-[10px] font-black">
                        {i + 1}
                      </div>
                      <span className="text-[11px] text-slate-300 font-bold">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="p-6 rounded-3xl bg-slate-950/50 border border-slate-800 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-black text-emerald-400 mb-1">{requirement.successProbability}%</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase">نسبة نجاح العملية</div>
                </div>
                <div className={`p-4 rounded-3xl border flex items-center gap-3 ${requirement.autoBackupDone ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/5 border-amber-500/20 text-amber-400'}`}>
                  <RefreshCw className={`w-4 h-4 ${requirement.autoBackupDone ? '' : 'animate-spin'}`} />
                  <span className="text-[10px] font-bold">
                    {requirement.autoBackupDone ? 'تم أخذ نسخة احتياطية إجبارية' : 'جاري فحص حالة النسخ الاحتياطي...'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4 items-start mb-8">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
              <p className="text-[11px] text-amber-200/70 leading-relaxed">
                بالضغط على الموافقة، أنت تقر بمسؤوليتك الكاملة كمهندس نظام عن تنفيذ هذه العملية وتفويض "أسراب الوكلاء" بالتحكم المباشر في ذواكر ومعالجات الجهاز المتصل.
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={onConfirm}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40"
              >
                <ShieldCheck className="w-6 h-6" /> موافق ومنح الإذن التنفيذي
              </button>
              <button 
                onClick={onClose}
                className="px-8 bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <ArrowLeft className="w-5 h-5" /> تراجع
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
