import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Radio, 
  Settings2, 
  Activity, 
  Database, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Signal,
  Wifi,
  FileCode,
  Terminal
} from 'lucide-react';
import { FirmwareParser } from '../lib/firmwareParser';

export const RFNetworkStudio: React.FC = () => {
  const [imei, setImei] = useState('');
  const [isImeiValid, setIsImeiValid] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [technicalLogs, setTechnicalLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addLog = (msg: string) => setTechnicalLogs(prev => [...prev, msg].slice(-10));

  const handleVerifyImei = (val: string) => {
    setImei(val);
    if (val.length === 15) {
      setIsImeiValid(FirmwareParser.verifyIMEI(val));
    } else {
      setIsImeiValid(null);
    }
  };

  const runDiagnostic = async (type: 'read_qcn' | 'reset_efs') => {
    setIsProcessing(true);
    addLog(`[ACTION] Initiating ${type.toUpperCase()} procedure...`);
    
    const res = await (await import('../lib/hardwareBridge')).hardwareBridge.performRfDiagnostic(type);
    
    res.logs.forEach((l, i) => {
      setTimeout(() => addLog(l), i * 300);
    });

    setTimeout(() => {
      setIsProcessing(false);
      if (res.success) addLog(`[SUCCESS] ${type.toUpperCase()} operation completed successfully.`);
    }, res.logs.length * 300 + 500);
  };

  return (
    <div className="flex flex-col gap-6 font-['Cairo'] animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RF Signal Analytics */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                <Radio className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">مختبر الترددات والشبكات (RF Studio)</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Baseband & IMEI Engine</p>
              </div>
            </div>
            <button 
              onClick={() => setIsScanning(!isScanning)}
              className={`px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
                isScanning ? 'bg-red-600/20 text-red-400 animate-pulse' : 'bg-emerald-600 text-white'
              }`}
            >
              <Activity className="w-4 h-4" /> {isScanning ? 'إيقاف الفحص' : 'فحص إشارات المودم'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Live Modem Stats */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Signal className="w-3.5 h-3.5" /> قراءات المودم (Baseband Status)
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Signal Strength (RSRP)', value: '-84 dBm', status: 'Excellent' },
                  { label: 'Carrier Aggregation', value: '4x4 MIMO', status: 'Active' },
                  { label: 'SNR (Signal-Noise Ratio)', value: '18.2 dB', status: 'Stable' },
                  { label: 'Baseband Version', value: 'M8998-2.0.1.c4', status: 'Normal' }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <span className="text-[10px] text-slate-400 font-bold">{stat.label}</span>
                    <div className="text-right">
                      <div className="text-xs font-black text-white">{stat.value}</div>
                      <div className="text-[8px] text-emerald-500 uppercase">{stat.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IMEI & Security Verification */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> فحص الهوية والشهادات
              </h3>
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-black uppercase">IMEI 1 (Verification)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      maxLength={15}
                      value={imei}
                      onChange={(e) => handleVerifyImei(e.target.value)}
                      placeholder="35821010..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-indigo-500 transition-all outline-none"
                    />
                    {isImeiValid !== null && (
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isImeiValid ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isImeiValid ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                    )}
                  </div>
                  {isImeiValid === false && (
                    <p className="text-[10px] text-red-400 font-bold">IMEI Checksum Error! رمز السيريال غير صحيح تقنياً.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
                  <button 
                    disabled={isProcessing}
                    onClick={() => runDiagnostic('read_qcn')}
                    className="py-3 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'جاري القراءة...' : 'قراءة QCN'}
                  </button>
                  <button 
                    disabled={isProcessing}
                    onClick={() => runDiagnostic('reset_efs')}
                    className="py-3 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'جاري التصفير...' : 'تصفير EFS'}
                  </button>
                </div>
              </div>
              
              {/* Technical Terminal */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[9px] min-h-[80px]">
                <div className="flex items-center gap-2 mb-2 text-slate-600">
                  <Terminal className="w-3 h-3" />
                  <span>RF_DIAG_CONSOLE v2.1</span>
                </div>
                {technicalLogs.length === 0 && <p className="text-slate-800 italic">بانتظار الأوامر...</p>}
                {technicalLogs.map((log, i) => (
                  <div key={i} className="text-emerald-500/80 mb-1">{log}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-600/5 border border-indigo-600/10 flex gap-4 items-center">
            <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin-slow" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="text-white font-black">الذكاء الاصطناعي:</span> تم رصد تباين بين شهادة الأمان (Security Certificate) الحالية وملفات الـ NVRAM. نقترح إعادة كتابة ملف QCN أصلي لإعادة استقرار الشبكة.
            </p>
          </div>
        </div>

        {/* Right Sidebar: Expert Knowledge */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" /> مصفوفة ملفات الشبكة
            </h3>
            <div className="space-y-3">
              {['NVRAM.bin', 'NVDATA.img', 'MODEMST1', 'MODEMST2', 'FSG'].map((file) => (
                <div key={file} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/50 group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] text-slate-300 font-bold font-mono">{file}</span>
                  </div>
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded uppercase font-black">Backup Ready</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
            <h4 className="text-[10px] font-black text-amber-500 mb-2 uppercase tracking-widest">تنبيه قانوني وسيادي</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              تعديل أرقام السيريال (IMEI) هو إجراء هندسي مخصص حصرياً لأغراض الصيانة واستعادة الهوية الأصلية للجهاز المتضرر من تلف السوفت وير. استخدم هذه الأدوات بمسؤولية سيادية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
