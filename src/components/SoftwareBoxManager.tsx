import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Zap, 
  ShieldAlert, 
  Settings, 
  Terminal as TerminalIcon, 
  Download, 
  Play, 
  RefreshCcw, 
  Smartphone, 
  Database,
  Lock,
  Unlock,
  Radio,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { DeviceInfo, TerminalLog } from '../types';

interface SoftwareBoxManagerProps {
  device?: DeviceInfo;
  onSendTerminalLog: (text: string, type: 'cmd' | 'output' | 'error' | 'success' | 'info') => void;
}

type SoftwareTab = 'flasher' | 'unlocker' | 'network' | 'advanced';

export const SoftwareBoxManager: React.FC<SoftwareBoxManagerProps> = ({ device, onSendTerminalLog }) => {
  const [activeTab, setActiveTab] = useState<SoftwareTab>('flasher');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('جاهز للعمل');
  
  const [selectedBrand, setSelectedBrand] = useState(device?.brand || 'Samsung');
  const [selectedModel, setSelectedModel] = useState(device?.model || 'SM-G998B');

  const simulateProcess = (title: string, steps: string[]) => {
    setIsProcessing(true);
    setProgress(0);
    onSendTerminalLog(`[SOFTWARE BOX] بدء عملية: ${title}`, 'info');
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        onSendTerminalLog(steps[currentStep], 'output');
        setProgress(((currentStep + 1) / steps.length) * 100);
        setStatusText(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setProgress(100);
        setStatusText('تمت العملية بنجاح');
        onSendTerminalLog(`[SOFTWARE BOX] تم الانتهاء من ${title} بنجاح.`, 'success');
      }
    }, 800);
  };

  const handleFlash = () => {
    simulateProcess('تفليش النظام (Full Flash)', [
      'جاري التحقق من ملفات الروم...',
      'فحص ملف BL (Bootloader)... OK',
      'فحص ملف AP (System)... OK',
      'فحص ملف CP (Modem)... OK',
      'فحص ملف CSC (Region)... OK',
      'بدء مسح الذاكرة المؤقتة...',
      'كتابة قطاع النظام System (2.4GB)...',
      'كتابة قطاع المستخدم Data...',
      'إعادة تشغيل الهاتف...'
    ]);
  };

  const handleFrpBypass = () => {
    simulateProcess('تخطي حساب جوجل (FRP Bypass)', [
      'جاري الاتصال بالهاتف عبر وضع ADB/MTP...',
      'تفعيل ثغرة المتصفح المتصفح...',
      'حقن ملفات التخطي الذكية...',
      'إزالة قفل الحساب (FRP Partition)...',
      'تمت العملية، الهاتف سيفتح الآن بدون حساب.'
    ]);
  };

  const handleImeiRepair = () => {
    simulateProcess('إصلاح الشبكة والـ IMEI', [
      'جاري قراءة بيانات المودم...',
      'التحقق من سلامة قطاع EFS...',
      'تصفير إعدادات الشبكة...',
      'إعادة كتابة الـ IMEI الأصلي...',
      'معايرة إشارات الـ 4G/5G...',
      'حفظ التعديلات في NVRAM...'
    ]);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Box Header Info */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Connection Status Card */}
        <div className="lg:w-1/3 bg-slate-950 border border-slate-800 rounded-[2rem] p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20">
            <motion.div 
              className="h-full bg-indigo-500" 
              initial={{ width: 0 }} 
              animate={{ width: isProcessing ? `${progress}%` : '100%' }}
            />
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${device ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {device ? 'Device Connected' : 'No Device'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1">الشركة والموديل</p>
              <h3 className="text-lg font-black text-white">{selectedBrand} {selectedModel}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">المعالج</p>
                <p className="text-xs text-slate-300 font-mono">{device?.chipset || 'Qualcomm Snapdragon'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">الوضع الحالي</p>
                <p className="text-xs text-indigo-400 font-bold">EDL Mode (9008)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Controls */}
        <div className="lg:w-2/3 bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6 overflow-x-auto no-scrollbar">
            {[
              { id: 'flasher', icon: Zap, label: 'التفليش' },
              { id: 'unlocker', icon: Unlock, label: 'فك الأقفال' },
              { id: 'network', icon: Radio, label: 'الشبكة' },
              { id: 'advanced', icon: Settings, label: 'متقدم' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SoftwareTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {activeTab === 'flasher' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <p className="text-[10px] font-bold text-slate-500 mb-3">ملفات الفلاش (Firmware Files)</p>
                      <div className="space-y-2">
                        {['BL', 'AP', 'CP', 'CSC'].map((type) => (
                          <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="text-xs font-mono font-bold text-indigo-400">{type}</span>
                            <span className="text-[10px] text-slate-500 truncate max-w-[120px]">file_{type.toLowerCase()}.tar.md5</span>
                            <FileCode className="w-3.5 h-3.5 text-slate-700" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleFlash}
                      disabled={isProcessing}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all group"
                    >
                      <Zap className={`w-8 h-8 ${isProcessing ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                      <span className="text-sm font-black">بدء التفليش الكامل</span>
                    </button>
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                      <div className="flex items-center gap-2 text-amber-500 mb-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase">تحذير</span>
                      </div>
                      <p className="text-[10px] text-amber-200/70 leading-relaxed">تأكد من شحن البطارية فوق 50% واستخدام كابل USB أصلي.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'unlocker' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'تخطي FRP', sub: 'وضع MTP', icon: Lock, action: handleFrpBypass },
                    { label: 'إزالة Mi Account', sub: 'وضع EDL', icon: ShieldAlert, action: handleFrpBypass },
                    { label: 'فتح Bootloader', sub: 'Fastboot', icon: Unlock, action: handleFrpBypass },
                    { label: 'إصلاح Bootloop', sub: 'Smart Fix', icon: RefreshCcw, action: handleFrpBypass },
                    { label: 'فورمات المصنع', sub: 'Safe Format', icon: Database, action: handleFrpBypass },
                    { label: 'تعريب مؤقت', sub: 'بدون روت', icon: Smartphone, action: handleFrpBypass },
                  ].map((tool, i) => (
                    <button 
                      key={i}
                      onClick={tool.action}
                      disabled={isProcessing}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all text-right group"
                    >
                      <tool.icon className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold text-white mb-0.5">{tool.label}</p>
                      <p className="text-[9px] text-slate-500">{tool.sub}</p>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'network' && (
                <div className="space-y-4">
                  <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">إصلاح الشبكة والـ Baseband</h4>
                      <p className="text-[11px] text-slate-400">يدعم معالجات Qualcomm و Exynos لإصلاح مشكلة IMEI Null</p>
                    </div>
                    <button 
                      onClick={handleImeiRepair}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-900/20"
                    >
                      إصلاح الآن
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-500 mb-3">قراءة بيانات المودم</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">Baseband:</span>
                          <span className="text-emerald-400 font-mono">G998BXXU3AUIE</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">IMEI 1:</span>
                          <span className="text-slate-300 font-mono">358294**********</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">Network Status:</span>
                          <span className="text-indigo-400">Searching...</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-center items-center gap-3">
                      <Radio className="w-8 h-8 text-indigo-400 animate-pulse" />
                      <p className="text-[10px] text-slate-400 text-center">جاري مراقبة استقرار الإشارة في الوقت الحقيقي</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress Overlay */}
          {isProcessing && (
            <div className="mt-6 p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold mb-1">
                  <span className="text-indigo-400">{statusText}</span>
                  <span className="text-slate-500">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
