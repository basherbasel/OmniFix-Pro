import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Layers, 
  Globe2, 
  FolderLock, 
  Sparkles, 
  Languages, 
  FileCode, 
  HardDrive, 
  Radio, 
  Cpu, 
  ShieldAlert, 
  Wrench, 
  Wand2, 
  Stethoscope, 
  Settings2, 
  PackageCheck, 
  Terminal, 
  HelpCircle, 
  Download, 
  Activity,
  X,
  ChevronLeft,
  SlidersHorizontal,
  LayoutGrid
} from 'lucide-react';

interface QuickHubProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
}

interface HubItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'arabization' | 'unlock_repair' | 'boxes_tools' | 'essential';
  icon: any;
  color: string;
  badge?: string;
  hotkey?: string;
}

export const QuickNavigationHub: React.FC<QuickHubProps> = ({ currentTab, onSelectTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'arabization' | 'unlock_repair' | 'boxes_tools' | 'essential'>('all');

  const hubItems: HubItem[] = [
    // 1. التعريب واللغات
    {
      id: 'one-click',
      title: 'التعريب الفوري الشامل (1-Click Arabizer)',
      subtitle: 'تعريب بنقرة واحدة لكافة الدول العربية وإظهار اللغات المخفية وتجاوز الحظر',
      category: 'arabization',
      icon: Globe2,
      color: 'from-emerald-500 to-teal-600',
      badge: 'التعريب الأساسي',
    },
    {
      id: 'ai-roadmap',
      title: 'خريطة التعريب الذكية (AI Roadmap)',
      subtitle: 'مسارات وتوجيهات الذكاء الاصطناعي لتجاوز حظر اللغات في الرومات المغلقة',
      category: 'arabization',
      icon: Languages,
      color: 'from-teal-500 to-cyan-600',
    },
    {
      id: 'xml-translator',
      title: 'مترجم ملفات النظام (Strings.xml)',
      subtitle: 'ترجمة ملفات التطبيقات والرومات وتوليد مجلدات values-ar تلقائياً',
      category: 'arabization',
      icon: FileCode,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'csc-studio',
      title: 'معدل ملفات CSC والشبكات الإقليمية',
      subtitle: 'تعديل وتفعيل رموز الدول العربية (KSA, EGY, XSG, MID) وتسجيل المكالمات',
      category: 'arabization',
      icon: Settings2,
      color: 'from-sky-500 to-blue-600',
    },

    // 2. فك الأقفال وإصلاح الأعطال وحفظ البيانات
    {
      id: 'zero-data-loss-unlock',
      title: 'فك الأقفال وحفظ بيانات العميل (Zero Data Loss)',
      subtitle: 'إزالة رمز PIN والنمط وكلمة المرور دون فورمات، وفك الشبكة والآيكلاود',
      category: 'unlock_repair',
      icon: FolderLock,
      color: 'from-purple-600 to-pink-600',
      badge: 'بدون مسح بيانات',
    },
    {
      id: 'two-click-doctor',
      title: 'المصلح الذكي بنقرتين (2-Click AI Doctor)',
      subtitle: 'الفحص الشامل للهاتف والإصلاح الفوري لكافة المشاكل بنقرتين فقط',
      category: 'unlock_repair',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-600',
      badge: 'إصلاح سريع',
    },
    {
      id: 'network-modem',
      title: 'الشبكات والـ 5G وفك شفرة SIM (Network Studio)',
      subtitle: 'تفعيل VoLTE، إصلاح Baseband، فك شفرات الشبكات الدولية لجميع الشرائح',
      category: 'unlock_repair',
      icon: Radio,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'security-vault',
      title: 'بنك الثغرات وتخطي الحمايات (Exploit Vault)',
      subtitle: 'تخطي حمايات FRP، Knox KG، Mi Cloud، Apple DFU، وMTK SLA/DA Bypass',
      category: 'unlock_repair',
      icon: ShieldAlert,
      color: 'from-rose-500 to-red-600',
      badge: 'Zero-Days',
    },
    {
      id: 'faults-matrix',
      title: 'موسوعة الأعطال والحلول (Faults Matrix)',
      subtitle: 'دليل وحلول مشاكل الموت المفاجئ، رفض السوفت وير، البوت لوب، وتعليق الشعار',
      category: 'unlock_repair',
      icon: Wrench,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'software-doctor',
      title: 'فحص وإصلاح السوفت وير (Software Doctor)',
      subtitle: 'تشخيص ملفات الروم والتفليش الآمن وإصلاح أخطاء الذاكرة وحماية الكتابة',
      category: 'unlock_repair',
      icon: Stethoscope,
      color: 'from-emerald-600 to-green-600',
    },

    // 3. البوكسات والدناجل والسوفت وير
    {
      id: 'hardware-mapping',
      title: 'خريطة الهاردوير (Hardware Fault Mapping)',
      subtitle: 'محاكاة بصرية تفاعلية لمسارات اللوحة الأم، الـ ICs، ونقاط القياس Test Points',
      category: 'boxes_tools',
      icon: Cpu,
      color: 'from-orange-500 to-rose-600',
      badge: 'BoardView',
    },
    {
      id: 'multi-box-suite',
      title: 'مجمع البوكسات والدناجل (Multi-Box Suite)',
      subtitle: 'تشغيل وظائف 10 بوكسات عالمية (Z3X, Octoplus, Chimera, UMT, UnlockTool...)',
      category: 'boxes_tools',
      icon: Cpu,
      color: 'from-violet-600 to-indigo-700',
      badge: '10 بوكسات مدمجة',
    },
    {
      id: 'universal-box',
      title: 'البوكس الشامل لكافة الأجهزة (Universal Box)',
      subtitle: 'دعم كامل لمعالجات Qualcomm EDL، MediaTek BROM، Unisoc SPD، وApple',
      category: 'boxes_tools',
      icon: Layers,
      color: 'from-indigo-600 to-slate-700',
    },
    {
      id: 'zero-shot-synthesizer',
      title: 'مبتكر الأدوات والحلول الفورية (Tool Synthesizer)',
      subtitle: 'توليد أداة برمجية فورية وسكربت مخصص بالذكاء الاصطناعي لأي عطل نادر',
      category: 'boxes_tools',
      icon: Wand2,
      color: 'from-fuchsia-500 to-purple-600',
    },
    {
      id: 'magisk-builder',
      title: 'صانع موديلات الروت (Magisk Module Builder)',
      subtitle: 'بناء وتخصيص موديلات الروت وتثبيت اللغات والخطوط وتجاوز فحص الأمان',
      category: 'boxes_tools',
      icon: PackageCheck,
      color: 'from-teal-600 to-emerald-700',
    },
    {
      id: 'hourly-evolution',
      title: 'محرك التطوير الذاتي الساعي (Live Evolution)',
      subtitle: 'تحديث قواعد البيانات والثغرات والأجهزة الجديدة على مدار الساعة',
      category: 'boxes_tools',
      icon: Activity,
      color: 'from-blue-600 to-cyan-700',
    },

    // 4. الأدوات الأساسية والطرفية
    {
      id: 'universal-drivers',
      title: 'مركز كافة التعريفات (All Drivers Pack)',
      subtitle: 'تثبيت وتحميل جميع تعريفات الـ USB ومنافذ COM لجميع الشركات بضغطة زر',
      category: 'essential',
      icon: HardDrive,
      color: 'from-slate-600 to-slate-800',
      badge: 'All USB',
    },
    {
      id: 'adb-terminal',
      title: 'طرفية الأوامر والبوكس الحية (Terminal Live)',
      subtitle: 'تنفيذ أوامر ADB و Fastboot و EDL مع حفظ سجلات الفحص المباشر',
      category: 'essential',
      icon: Terminal,
      color: 'from-zinc-700 to-zinc-900',
    },
    {
      id: 'ai-assistant',
      title: 'المساعد الفني الذكي وخبير الصيانة (AI Expert)',
      subtitle: 'مستشار ومهندس سوفت وير محترف للإجابة على أصعب الأسئلة وحل المشاكل المعقدة',
      category: 'essential',
      icon: HelpCircle,
      color: 'from-amber-600 to-yellow-600',
    },
    {
      id: 'desktop-installer',
      title: 'تثبيت البرنامج على الكمبيوتر (Desktop PWA)',
      subtitle: 'تنزيل حزمة البرنامج المستقلة والتشغيل بدون انترنت على ويندوز وماك ولينكس',
      category: 'essential',
      icon: Download,
      color: 'from-indigo-600 to-blue-700',
      badge: 'Offline Pack',
    },
  ];

  // Filter items
  const filtered = hubItems.filter((item) => {
    const matchCategory = activeFilter === 'all' || item.category === activeFilter;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleSelect = (id: string) => {
    onSelectTab(id);
    setIsOpen(false);
  };

  // Keyboard shortcut (Ctrl+K or Alt+N to open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Navigation Trigger Bar */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5 pointer-events-none"></div>

        <div className="flex w-full sm:w-auto items-center gap-3 relative z-10">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-900/40 transition-transform flex items-center justify-center gap-3 active:scale-95 cursor-pointer hover:-translate-y-0.5 border border-indigo-400/30"
          >
            <LayoutGrid className="w-5 h-5 text-amber-300" />
            <span>لوحة التحكم والتنقل السريع (القائمة الرئيسية)</span>
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-bold bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-300">اختصار:</span>
            <span className="bg-slate-800 text-white px-1.5 py-0.5 rounded font-mono border border-slate-700">Ctrl</span>
            <span>+</span>
            <span className="bg-slate-800 text-white px-1.5 py-0.5 rounded font-mono border border-slate-700">K</span>
          </div>
        </div>

        {/* Quick Direct Buttons */}
        <div className="hidden lg:flex items-center gap-2 text-xs relative z-10 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/80">
          <button
            onClick={() => onSelectTab('two-click-doctor')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              currentTab === 'two-click-doctor'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'bg-transparent text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>المصلح الآلي الذكي</span>
          </button>

          <button
            onClick={() => onSelectTab('multi-box-suite')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              currentTab === 'multi-box-suite'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                : 'bg-transparent text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>مجمع البوكسات</span>
          </button>
        </div>

        {/* Quick Search Shortcut Input */}
        <div 
          onClick={() => setIsOpen(true)}
          className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer transition text-xs text-slate-400 w-full sm:w-auto min-w-[250px] relative z-10"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span className="truncate">بحث سريع في جميع الأدوات...</span>
        </div>
      </div>

      {/* Full Modal Modal / Drawer Hub */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header & Search */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">دليل وتصفح جميع أقسام وبوكسات وأدوات البرنامج</h3>
                    <p className="text-xs text-slate-400">اختر أي قسم للانتقال الفوري إليه بنقرة واحدة</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم الأداة، البوكس، التعريب، فك القفل، الآيكلاود، الذاكرة، التعريفات..."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pr-10 pl-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  autoFocus
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'all', label: 'جميع الأدوات والبوكسات (19)' },
                  { id: 'arabization', label: 'التعريب واللغات (4)' },
                  { id: 'unlock_repair', label: 'فك الأقفال والأعطال وحفظ البيانات (6)' },
                  { id: 'boxes_tools', label: 'مجمع البوكسات والدناجل (5)' },
                  { id: 'essential', label: 'التعريفات والأدوات الأساسية (4)' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                      activeFilter === cat.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hub Grid Cards */}
            <div className="p-5 overflow-y-auto max-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filtered.map((item) => {
                const Icon = item.icon;
                const isSelected = currentTab === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition truncate">
                          {item.title}
                        </h4>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0 font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 self-center transition-transform group-hover:-translate-x-1" />
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="col-span-2 text-center py-12 space-y-2">
                  <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">لم يتم العثور على أداة مطابقة لبحثك</p>
                  <p className="text-xs text-slate-500">جرب كتابة كلمات مثل: تعريب، قفل، بوكس، تعريف، شبكة، روت</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <span>يمكنك فتح هذه النافذة في أي وقت بالضغط على زر <strong>لوحة التحكم</strong> أو <strong>Ctrl + K</strong></span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
