import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  Battery, 
  Smartphone, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Activity,
  Thermometer,
  ShieldCheck,
  Radar,
  Microchip
} from 'lucide-react';
import { DeviceInfo } from '../types';

interface VisualHardwareDiagnosticProps {
  device: DeviceInfo;
}

export const VisualHardwareDiagnostic: React.FC<VisualHardwareDiagnosticProps> = ({ device }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<any>(null);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanResult({
            cpu: { status: 'healthy', temp: '34°C', load: '12%' },
            battery: { status: 'healthy', cycles: 142, health: '94%', current: '4200mAh' },
            pmic: { status: 'warning', voltage: '3.8V', note: 'ذبذبة طفيفة في خطوط الـ VDD' },
            display: { status: 'healthy', pixels: 'OK', touch: 'OK' },
            storage: { status: 'healthy', speed: '240MB/s', life: '98%' }
          });
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const components = [
    { id: 'cpu', label: 'CPU / SOC', x: '45%', y: '30%', color: 'indigo' },
    { id: 'pmic', label: 'PMIC (Power)', x: '55%', y: '45%', color: 'amber' },
    { id: 'battery', label: 'Battery Unit', x: '50%', y: '70%', color: 'emerald' },
    { id: 'display', label: 'Display IC', x: '30%', y: '20%', color: 'cyan' },
    { id: 'storage', label: 'UFS / NAND', x: '40%', y: '45%', color: 'purple' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Control Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Radar className={`w-8 h-8 ${isScanning ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">ماسح العتاد البصري (X-Ray Scanner)</h2>
            <p className="text-slate-400 text-sm">فحص المكونات الداخلية وتحديد نقاط الأعطال بدقة ميكرونية</p>
          </div>
        </div>
        
        <button 
          onClick={startScan}
          disabled={isScanning}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-xl shadow-indigo-900/30 transition-all active:scale-95 flex items-center gap-2"
        >
          {isScanning ? <Activity className="w-5 h-5 animate-pulse" /> : <Search className="w-5 h-5" />}
          {isScanning ? `جاري المسح ${scanProgress}%` : 'بدء فحص الهاردوير'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Board View */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-[3rem] p-8 min-h-[600px] relative flex items-center justify-center overflow-hidden">
          {/* Decorative Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Device Silhouette */}
          <div className="relative w-72 h-[550px] bg-slate-900/80 rounded-[3rem] border-4 border-slate-800 shadow-2xl overflow-hidden group">
            {/* Internal Components Map */}
            <div className="absolute inset-0 p-4 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
              <div className="w-full h-full border border-slate-700/50 rounded-2xl bg-slate-950/50 flex items-center justify-center font-mono text-[8px] text-slate-700 tracking-tighter">
                INTERNAL_HARDWARE_MAP_REV_2.4
              </div>
            </div>

            {/* Scan Line */}
            {isScanning && (
              <motion.div 
                className="absolute left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,1)] z-10"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Interactive Components */}
            {(scanResult || isScanning) && components.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setActiveComponent(comp.id)}
                className={`absolute w-12 h-12 rounded-xl border flex items-center justify-center transition-all z-20 hover:scale-110 shadow-lg ${
                  activeComponent === comp.id 
                    ? `bg-${comp.color}-500/30 border-${comp.color}-400 scale-125` 
                    : `bg-${comp.color}-500/10 border-${comp.color}-500/20`
                }`}
                style={{ left: comp.x, top: comp.y }}
              >
                <div className={`w-2 h-2 rounded-full bg-${comp.color}-400 animate-pulse`} />
              </button>
            ))}
          </div>

          {/* Side Info Overlays */}
          <div className="absolute top-8 left-8 flex flex-col gap-2">
            <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] text-indigo-400 font-bold">
              BOARD_ID: MSM8998_REV_B
            </div>
            <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] text-slate-500 font-bold">
              VOLTAGE: 3.82V STABLE
            </div>
          </div>
        </div>

        {/* Diagnostic Reports */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {!scanResult && !isScanning && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full bg-slate-900/40 border border-slate-800 border-dashed rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
                  <Activity className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">بانتظار بدء الفحص</h3>
                  <p className="text-slate-500 text-sm">يرجى الضغط على زر "بدء فحص الهاردوير" أعلاه لتحليل مكونات الجهاز الداخلية.</p>
                </div>
              </motion.div>
            )}

            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full bg-slate-900/40 border border-indigo-500/30 rounded-[3rem] p-8 space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">جاري تحليل المكونات...</span>
                    <span className="text-indigo-400 font-black">{scanProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <motion.div className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" initial={{ width: 0 }} animate={{ width: `${scanProgress}%` }} />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { label: 'CPU Diagnostics', active: scanProgress > 20 },
                    { label: 'PMIC Voltage Rails', active: scanProgress > 40 },
                    { label: 'Storage Sector Health', active: scanProgress > 60 },
                    { label: 'Battery Interface Protocol', active: scanProgress > 80 },
                  ].map((log, i) => (
                    <div key={i} className={`flex items-center gap-3 transition-opacity ${log.active ? 'opacity-100' : 'opacity-20'}`}>
                      {log.active ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                      <span className="text-xs font-bold text-slate-300">{log.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {scanResult && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Result Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-2">
                    <Thermometer className="w-5 h-5 text-indigo-400" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase">حرارة النظام</p>
                    <p className="text-lg font-black text-white">{scanResult.cpu.temp}</p>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-2">
                    <Battery className="w-5 h-5 text-emerald-400" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase">صحة البطارية</p>
                    <p className="text-lg font-black text-white">{scanResult.battery.health}</p>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" /> تقرير الفحص التفصيلي
                  </h3>
                  
                  <div className="space-y-2">
                    {[
                      { label: 'وحدة المعالجة (CPU)', value: scanResult.cpu.status, note: `حمل ${scanResult.cpu.load}`, color: 'emerald' },
                      { label: 'وحدة الطاقة (PMIC)', value: scanResult.pmic.status, note: scanResult.pmic.note, color: 'amber' },
                      { label: 'الذاكرة (Storage)', value: scanResult.storage.status, note: `سرعة ${scanResult.storage.speed}`, color: 'emerald' },
                      { label: 'الشاشة واللمس', value: scanResult.display.status, note: 'جميع القطاعات تعمل', color: 'emerald' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                        <div>
                          <p className="text-xs font-bold text-white">{item.label}</p>
                          <p className="text-[10px] text-slate-500">{item.note}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {item.value === 'healthy' ? 'سليم' : 'تنبيه'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-900/20 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black mb-0.5">تحليل الذكاء الاصطناعي النهائي</h4>
                    <p className="text-[11px] opacity-80 leading-relaxed">الجهاز سليم تماماً باستثناء ذبذبة طفيفة في خطوط الطاقة، يرجى فحص ملف الشحن.</p>
                  </div>
                  <Smartphone className="w-8 h-8 opacity-20" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
