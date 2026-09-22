import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Activity,
  Zap,
  Microscope,
  Crosshair,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Server,
  MonitorSmartphone,
  HardDrive
} from 'lucide-react';

interface FaultSymptom {
  id: string;
  title: string;
  category: string;
  description: string;
  targetComponents: string[];
}

const SYMPTOMS: FaultSymptom[] = [
  {
    id: 'symptom_dead_01a',
    title: 'الجهاز ميت - سحب 0.1 إلى 0.2 أمبير (Dead 0.1A)',
    category: 'Power',
    description: 'الهاتف لا يعمل ويسحب تياراً منخفضاً جداً قبل الإقلاع. يشير غالباً إلى خلل في خطوط التغذية الرئيسية أو تلف ذاكرة eMMC/UFS.',
    targetComponents: ['U4001', 'U5001', 'TP_VDD_MAIN', 'L4010']
  },
  {
    id: 'symptom_no_charging',
    title: 'لا يشحن أو شحن وهمي (Fake Charging)',
    category: 'Charging',
    description: 'يظهر مؤشر الشحن لكن النسبة لا تزيد، أو لا يسحب أمبير من الشاحن. غالباً المشكلة في آيسي الشحن (Charging IC) أو مسار VBUS.',
    targetComponents: ['U3001', 'C3020', 'TP_VBUS', 'Q3000']
  },
  {
    id: 'symptom_baseband_null',
    title: 'فقدان البيسباند / لا توجد خدمة (Baseband Null)',
    category: 'Network',
    description: 'الجهاز لا يتعرف على الشريحة والـ IMEI غير معروف. يتطلب فحص آيسي البيسباند (Baseband CPU) ومستقبل الإشارة (Transceiver).',
    targetComponents: ['U7001', 'U7201', 'TP_BB_VREG', 'X7000']
  },
  {
    id: 'symptom_no_display',
    title: 'شاشة سوداء / لا توجد إضاءة (No Display/Backlight)',
    category: 'Display',
    description: 'الهاتف يعمل ويهتز ولكن الشاشة سوداء. يتطلب فحص آيسي الإضاءة (Backlight IC) ومسارات MIPI.',
    targetComponents: ['U8000', 'D8001', 'TP_LCM_EN', 'L8002']
  }
];

const BOARD_COMPONENTS = [
  // PMIC Region
  { id: 'U4001', name: 'Main PMIC', type: 'ic', cx: 30, cy: 30, r: 8, label: 'U4001 (Power)', voltage: 'VPH_PWR' },
  { id: 'L4010', name: 'Buck Inductor', type: 'passive', cx: 40, cy: 25, width: 4, height: 6, label: 'L4010' },
  { id: 'TP_VDD_MAIN', name: 'VDD_MAIN Test Point', type: 'tp', cx: 22, cy: 35, r: 2, label: 'TP_VDD_MAIN (4.2V)' },
  
  // CPU / RAM / Storage Region
  { id: 'U5001', name: 'CPU / SoC', type: 'ic', cx: 50, cy: 45, r: 12, label: 'U5001 (SoC)' },
  { id: 'U5002', name: 'eMMC / UFS', type: 'ic', cx: 65, cy: 45, r: 10, label: 'U5002 (Storage)' },
  
  // Charging Region
  { id: 'U3001', name: 'Charging IC', type: 'ic', cx: 45, cy: 75, r: 7, label: 'U3001 (Charging)' },
  { id: 'C3020', name: 'VBUS Cap', type: 'passive', cx: 52, cy: 73, width: 3, height: 5, label: 'C3020' },
  { id: 'Q3000', name: 'OVP FET', type: 'ic', cx: 38, cy: 76, r: 4, label: 'Q3000 (OVP)' },
  { id: 'TP_VBUS', name: 'VBUS Test Point', type: 'tp', cx: 45, cy: 85, r: 2, label: 'TP_VBUS (5.0V)' },

  // Network Region
  { id: 'U7001', name: 'Baseband CPU', type: 'ic', cx: 80, cy: 25, r: 9, label: 'U7001 (Baseband)' },
  { id: 'U7201', name: 'RF Transceiver', type: 'ic', cx: 85, cy: 15, r: 6, label: 'U7201 (RF)' },
  { id: 'X7000', name: 'Oscillator', type: 'passive', cx: 75, cy: 20, width: 5, height: 4, label: 'X7000 (19.2MHz)' },
  { id: 'TP_BB_VREG', name: 'BB VREG Test Point', type: 'tp', cx: 88, cy: 32, r: 2, label: 'TP_BB_VREG (1.8V)' },

  // Display Region
  { id: 'U8000', name: 'Display/Backlight IC', type: 'ic', cx: 20, cy: 60, r: 6, label: 'U8000 (Display)' },
  { id: 'D8001', name: 'Boost Diode', type: 'passive', cx: 15, cy: 58, width: 3, height: 5, label: 'D8001' },
  { id: 'L8002', name: 'Boost Inductor', type: 'passive', cx: 25, cy: 55, width: 4, height: 6, label: 'L8002' },
  { id: 'TP_LCM_EN', name: 'LCM Enable TP', type: 'tp', cx: 12, cy: 65, r: 2, label: 'TP_LCM_EN (1.8V)' },
];

export const HardwareFaultMappingStudio: React.FC = () => {
  const [activeSymptom, setActiveSymptom] = useState<FaultSymptom | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  const handleSelectSymptom = (symptom: FaultSymptom) => {
    setActiveSymptom(symptom);
  };

  const getComponentHighlightClass = (id: string) => {
    if (!activeSymptom) return 'text-slate-600 fill-slate-800 stroke-slate-600';
    if (activeSymptom.targetComponents.includes(id)) {
      return 'text-rose-500 fill-rose-500/20 stroke-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse';
    }
    return 'text-slate-700 fill-slate-900 stroke-slate-700 opacity-30';
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold mb-2">
            <Microscope className="w-3.5 h-3.5" /> الخريطة التفاعلية لأعطال الهاردوير (Hardware Fault Mapping)
          </div>
          <h2 className="text-xl font-bold text-white">
            جهاز كشف مكونات اللوحة الأم والمسارات
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            حدد العرض أو العطل المرصود ليقوم الذكاء الاصطناعي بتحديد الآيسيهات (ICs)، نقاط القياس (Test Points)، والمكثفات المحتمل تسببها بالعطل بدقة على الخريطة الحرارية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Symptoms Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            الأعراض والأعطال الشائعة
          </h3>
          <div className="space-y-2">
            {SYMPTOMS.map((symptom) => (
              <button
                key={symptom.id}
                onClick={() => handleSelectSymptom(symptom)}
                className={`w-full text-right p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-1.5 ${
                  activeSymptom?.id === symptom.id
                    ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-900/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${activeSymptom?.id === symptom.id ? 'text-rose-400' : 'text-slate-300'}`}>
                    {symptom.title}
                  </span>
                  {activeSymptom?.id === symptom.id && <Crosshair className="w-4 h-4 text-rose-500" />}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {symptom.description}
                </p>
              </button>
            ))}
          </div>

          {activeSymptom && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-950/30 border border-indigo-500/40 rounded-2xl p-4 space-y-3"
            >
              <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                تحليل الذكاء الاصطناعي (AI Diagnostic)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeSymptom.description}
              </p>
              <div className="pt-2 border-t border-indigo-500/20">
                <span className="text-[10px] text-slate-400 block mb-1">المكونات المتهمة (Suspect Components):</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSymptom.targetComponents.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-[10px] font-mono">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Motherboard Visualization Canvas */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
          {/* Grid Background overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
          
          <h3 className="absolute top-4 left-6 text-sm font-bold text-slate-300 flex items-center gap-2 z-10">
            <Cpu className="w-5 h-5 text-indigo-400" />
            المحاكاة البصرية للوحة الأم (BoardView Simulation)
          </h3>

          <div className="w-full max-w-lg aspect-[4/3] bg-emerald-950/20 border-2 border-emerald-900/50 rounded-lg relative mt-8 overflow-hidden shadow-2xl shadow-black/50">
            {/* The SVG Board */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl relative z-10">
              <defs>
                <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="0.2"/>
                </pattern>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Draw Traces (Decorative) */}
              <path d="M 30 30 L 40 45 L 50 45" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.5" />
              <path d="M 50 45 L 80 25" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.5" />
              <path d="M 30 30 L 20 60" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.5" />
              <path d="M 30 30 L 45 75" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.5" />
              <path d="M 45 75 L 45 85" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.5" />

              {BOARD_COMPONENTS.map((comp) => {
                const styleClass = getComponentHighlightClass(comp.id);
                const isHovered = hoveredComponent === comp.id;
                const isTargeted = activeSymptom?.targetComponents.includes(comp.id);
                
                return (
                  <g 
                    key={comp.id}
                    onMouseEnter={() => setHoveredComponent(comp.id)}
                    onMouseLeave={() => setHoveredComponent(null)}
                    className="cursor-crosshair transition-all duration-300"
                  >
                    {comp.type === 'ic' && (
                      <rect 
                        x={comp.cx - (comp.r || 5)} 
                        y={comp.cy - (comp.r || 5)} 
                        width={(comp.r || 5) * 2} 
                        height={(comp.r || 5) * 2} 
                        className={`${styleClass} transition-all duration-500`}
                        rx="1.5"
                        strokeWidth="0.5"
                        filter={isTargeted ? 'url(#glow)' : ''}
                      />
                    )}
                    {comp.type === 'passive' && (
                      <rect 
                        x={comp.cx - (comp.width || 2) / 2} 
                        y={comp.cy - (comp.height || 4) / 2} 
                        width={comp.width || 2} 
                        height={comp.height || 4} 
                        className={`${styleClass} transition-all duration-500`}
                        rx="0.5"
                        strokeWidth="0.5"
                      />
                    )}
                    {comp.type === 'tp' && (
                      <circle 
                        cx={comp.cx} 
                        cy={comp.cy} 
                        r={comp.r || 2} 
                        className={`${isTargeted ? 'fill-amber-400 stroke-amber-200' : 'fill-amber-900/50 stroke-amber-700/50'} transition-all duration-500`}
                        strokeWidth="0.5"
                        filter={isTargeted ? 'url(#glow)' : ''}
                      />
                    )}

                    {/* Hover Label */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.g
                          initial={{ opacity: 0, y: 2 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <rect 
                            x={comp.cx - 15} 
                            y={comp.cy - (comp.r || 5) - 10} 
                            width="30" 
                            height="8" 
                            fill="rgba(15, 23, 42, 0.9)" 
                            rx="1"
                            stroke="rgba(99, 102, 241, 0.5)"
                            strokeWidth="0.3"
                          />
                          <text 
                            x={comp.cx} 
                            y={comp.cy - (comp.r || 5) - 4} 
                            fontSize="3" 
                            fill="#fff" 
                            textAnchor="middle"
                            className="font-mono font-bold"
                          >
                            {comp.label}
                          </text>
                        </motion.g>
                      )}
                    </AnimatePresence>
                  </g>
                );
              })}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 backdrop-blur flex flex-col gap-1.5 z-20">
              <div className="flex items-center gap-1.5 text-[9px] text-slate-300">
                <div className="w-2.5 h-2.5 bg-slate-800 border border-slate-600 rounded-sm"></div> Main ICs
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-300">
                <div className="w-2 h-3 bg-slate-800 border border-slate-600 rounded-[1px]"></div> Passive (Cap/Ind)
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-300">
                <div className="w-2 h-2 bg-amber-900/50 border border-amber-700/50 rounded-full"></div> Test Point (TP)
              </div>
            </div>

            {!activeSymptom && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[1px] z-20 pointer-events-none">
                <span className="bg-slate-900/90 text-slate-300 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-indigo-400" />
                  الرجاء تحديد العطل من القائمة الجانبية لتنشيط التتبع
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
