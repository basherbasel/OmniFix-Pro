import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Search, 
  Layers, 
  FileCheck, 
  Zap, 
  AlertTriangle,
  Lock,
  Binary,
  Code2,
  FileCode2,
  Download
} from 'lucide-react';
import { FirmwareParser, PartitionEntry } from '../lib/firmwareParser';

const MOCK_PARTITIONS: PartitionEntry[] = [
  { name: 'boot', size: 67108864, offset: 0x0, isFlashable: true },
  { name: 'system', size: 3221225472, offset: 0x4000000, isFlashable: true },
  { name: 'vendor', size: 1073741824, offset: 0xC4000000, isFlashable: true },
  { name: 'userdata', size: 128849018880, offset: 0x104000000, isFlashable: true },
  { name: 'vbmeta', size: 65536, offset: 0x2000, isFlashable: true },
];

export const FirmwareIntegrityAnalyzer: React.FC = () => {
  const [activeBinary, setActiveBinary] = useState('4');
  const [targetBinary, setTargetBinary] = useState('5');
  const [analysisResult, setAnalysisResult] = useState(FirmwareParser.checkDowngradeRisk('4', '5'));

  return (
    <div className="flex flex-col gap-6 font-['Cairo'] animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Firmware Deep Analysis */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">محلل سلامة الفيرم وير (Integrity Guard)</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Anti-Brick & Partition Matrix</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> تحميل ملف تفلِيش
              </button>
            </div>
          </div>

          {/* Binary Version Guard */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Binary className="w-4 h-4 text-amber-500" /> فحص إصدار الحماية (Binary Version)
              </h3>
              <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                analysisResult.allowed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {analysisResult.allowed ? 'Safe to Flash' : 'Downgrade Blocked'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex items-center gap-6 justify-center">
                <div className="text-center space-y-2">
                  <div className="text-[10px] text-slate-500 font-black uppercase">الجهاز الحالي</div>
                  <div className="text-4xl font-black text-white">{activeBinary}</div>
                </div>
                <div className="h-12 w-[1px] bg-slate-800"></div>
                <div className="text-center space-y-2">
                  <div className="text-[10px] text-slate-500 font-black uppercase">الملف المختار</div>
                  <div className="text-4xl font-black text-indigo-400">{targetBinary}</div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${
                analysisResult.risk === 'brick' ? 'bg-red-500/5 border-red-500/20' :
                analysisResult.risk === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${
                    analysisResult.risk === 'brick' ? 'text-red-500' :
                    analysisResult.risk === 'warning' ? 'text-amber-500' : 'text-emerald-500'
                  }`} />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {analysisResult.risk === 'brick' && 'تنبيه كارثي: إصدار الحماية في الملف أقل من إصدار الجهاز. التفليش سيؤدي لموت الجهاز فوراً (Hard Brick).'}
                    {analysisResult.risk === 'none' && 'توافق تام: إصدار الحماية متطابق. يمكنك البدء في عملية التفليش بأمان.'}
                    {analysisResult.risk === 'warning' && 'تحديث الحماية: هذا الملف سيقوم بترقية إصدار الحماية (Binary) للجهاز. لا يمكن العودة للإصدار السابق بعد هذه العملية.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Partition Table View */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" /> مصفوفة التقسيمات (GPT / PIT Table)
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {MOCK_PARTITIONS.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:border-indigo-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <FileCode2 className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-black text-white font-mono">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-black uppercase">Offset</div>
                      <div className="text-[10px] font-mono text-slate-300">0x{p.offset.toString(16).toUpperCase()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-black uppercase">Size</div>
                      <div className="text-[10px] font-mono text-slate-300">{(p.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-500 group-hover:text-indigo-400 transition-colors">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Meta Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" /> حالة حماية النواة
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Secure Boot', value: 'Enabled', active: true },
                { label: 'DM-Verity', value: 'Active', active: true },
                { label: 'OEM Unlocking', value: 'Disabled', active: false },
                { label: 'Signature Status', value: 'Official', active: true }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${item.active ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-600/10">
            <h4 className="text-[10px] font-black text-indigo-400 mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4" /> تفتيش الأكواد (Code Audit)
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
              يقوم الوكيل بفحص ملف الـ <span className="text-white font-bold">Boot.img</span> بحثاً عن أي ثغرات إزاحة (Buffer Overflow) يمكن استغلالها لفك قفل الـ Bootloader.
            </p>
            <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black transition-all">
              بدء فحص الثغرات (Deep Audit)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
