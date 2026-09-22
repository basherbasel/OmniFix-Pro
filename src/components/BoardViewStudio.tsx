import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Thermometer, 
  Activity, 
  Search, 
  Crosshair, 
  Layers,
  Cpu,
  AlertCircle
} from 'lucide-react';
import { BoardComponent } from '../types';

const MOCK_COMPONENTS: BoardComponent[] = [
  { id: 'u1', name: 'PMIC (MT6358)', function: 'Power Management', x: 120, y: 150, z: 0, status: 'normal', readings: [] },
  { id: 'u2', name: 'Charging IC (SMB1351)', function: 'Fast Charging', x: 280, y: 80, z: 0, status: 'shorted', readings: [] },
  { id: 'u3', name: 'CPU (Dimensity 700)', function: 'Application Processor', x: 200, y: 220, z: 0, status: 'normal', readings: [] },
  { id: 'u4', name: 'EMMC/UFS Storage', function: 'Memory Storage', x: 200, y: 100, z: 0, status: 'normal', readings: [] },
  { id: 'u5', name: 'WiFi/BT Module', function: 'Connectivity', x: 80, y: 300, z: 0, status: 'normal', readings: [] },
];

export const BoardViewStudio: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<BoardComponent | null>(null);
  const [zoom, setZoom] = useState(1);
  const [overlay, setOverlay] = useState<'thermal' | 'voltage' | 'none'>('none');

  return (
    <div className="flex flex-col gap-6 font-['Cairo'] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <button 
            onClick={() => setOverlay('none')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${overlay === 'none' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}
          >
            المخطط الأساسي
          </button>
          <button 
            onClick={() => setOverlay('thermal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${overlay === 'thermal' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-slate-900 text-slate-400'}`}
          >
            <Thermometer className="w-3.5 h-3.5" /> الخريطة الحرارية
          </button>
          <button 
            onClick={() => setOverlay('voltage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${overlay === 'voltage' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'bg-slate-900 text-slate-400'}`}
          >
            <Zap className="w-3.5 h-3.5" /> مسارات التغذية
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white">-</button>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white">+</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Board Canvas */}
        <div className="lg:col-span-3 bg-slate-950 border border-slate-900 rounded-[2rem] h-[500px] relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
          {/* Neural Grid Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <motion.div 
            animate={{ scale: zoom }}
            className="relative w-[400px] h-[400px] bg-slate-800/20 rounded-3xl border-2 border-slate-700/50 p-4"
          >
            {/* PCB Texture */}
            <div className="absolute inset-0 bg-[#064e3b]/20 rounded-3xl opacity-40"></div>
            
            {/* Components */}
            {MOCK_COMPONENTS.map((comp) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onClick={() => setSelectedComp(comp)}
                style={{ left: comp.x, top: comp.y }}
                className={`absolute w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedComp?.id === comp.id ? 'border-indigo-500 bg-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 
                  comp.status === 'shorted' ? 'border-red-500 bg-red-500/10' :
                  'border-slate-600 bg-slate-900/80'
                }`}
              >
                <div className={`text-[8px] font-black mb-1 uppercase tracking-tighter ${comp.status === 'shorted' ? 'text-red-400' : 'text-slate-500'}`}>
                  {comp.status === 'shorted' ? 'SHORTED' : 'NORMAL'}
                </div>
                <Cpu className={`w-6 h-6 ${selectedComp?.id === comp.id ? 'text-indigo-400' : comp.status === 'shorted' ? 'text-red-500' : 'text-slate-600'}`} />
                <span className="text-[7px] text-white/60 mt-1 font-bold">{comp.name.split(' ')[0]}</span>

                {/* Thermal Glow Overlay */}
                {overlay === 'thermal' && comp.status === 'shorted' && (
                  <div className="absolute inset-[-10px] bg-red-600/30 blur-xl animate-pulse rounded-full pointer-events-none"></div>
                )}
                
                {/* Voltage Path Overlay */}
                {overlay === 'voltage' && (
                  <div className="absolute w-[200%] h-0.5 bg-emerald-500/30 -z-10 blur-[1px]"></div>
                )}
              </motion.div>
            ))}

            {/* Traces (Simplified) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <path d="M 120 150 L 280 80" stroke="#10b981" strokeWidth="1" fill="none" />
              <path d="M 120 150 L 200 220" stroke="#10b981" strokeWidth="1" fill="none" />
              <path d="M 200 220 L 80 300" stroke="#10b981" strokeWidth="1" fill="none" />
            </svg>
          </motion.div>

          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-300 font-bold">قصر في الدائرة (Short Circuit)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-slate-300 font-bold">مسار تغذية نشط</span>
            </div>
          </div>
        </div>

        {/* Component Analysis Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full">
            <h4 className="text-sm font-black text-white mb-6 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" /> تحليل المكون المختار
            </h4>

            {selectedComp ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-black uppercase">Component Label</div>
                  <div className="text-xl font-black text-white">{selectedComp.name}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-slate-500 font-bold">الحالة الفنية</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${selectedComp.status === 'shorted' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {selectedComp.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {selectedComp.function} - {selectedComp.status === 'shorted' ? 'تم اكتشاف تسريب طاقة حاد يتسبب في استهلاك وهمي للتيار.' : 'المكون يعمل ضمن نطاق الترددات الطبيعي.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">توصية الوكيل (Agent Recommendation)</h5>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-600/5 border border-indigo-600/10">
                    <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                    <p className="text-[10px] text-indigo-200 leading-relaxed">
                      {selectedComp.status === 'shorted' 
                        ? 'يجب حقن فولتية منخفضة (1.2V) بحذر لتحديد مكان الانبعاث الحراري الدقيق.' 
                        : 'لا توجد إجراءات صيانة مطلوبة لهذا المكون حالياً.'}
                    </p>
                  </div>
                </div>

                <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black transition-all flex items-center justify-center gap-2">
                  <Crosshair className="w-4 h-4" /> عرض نقاط الاختبار (Test Points)
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Layers className="w-12 h-12 text-slate-800 mb-4" />
                <p className="text-slate-500 text-xs leading-relaxed">
                  قم باختيار آي سي (IC) من المخطط لمعاينة القراءات الحرارية والكهربائية الحية.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
