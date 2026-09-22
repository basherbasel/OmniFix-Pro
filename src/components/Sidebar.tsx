import React from 'react';
import { 
  Home,
  Globe2, 
  ShieldAlert, 
  Sparkles, 
  HardDrive, 
  Radio, 
  Cpu, 
  Layers, 
  Terminal, 
  HelpCircle,
  Smartphone,
  Zap,
  Activity,
  History,
  Star,
  Settings,
  Search,
  Command,
  FileText,
  Wrench,
  Monitor,
  Database,
  Info,
  Download,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  LayoutDashboard,
  PenTool,
  CalendarDays,
  BarChart3,
  Share2,
  Microscope,
  ZapOff,
  Fingerprint,
  Thermometer
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { PWAInstallButton } from './PWAInstallButton';
import { DeviceInfo } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeDevice: DeviceInfo;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  activeDevice,
  isOpen,
  setIsOpen
}) => {
  const isSamsung = activeDevice.brand.toLowerCase().includes('samsung');
  const isIos = activeDevice.osType === 'ios';
  const isConnected = activeDevice.connectionStatus === 'connected' || activeDevice.connectionStatus === 'authorized';
  const isHighEnd = activeDevice.model.toLowerCase().includes('ultra') || activeDevice.model.toLowerCase().includes('pro');

  const menuGroups = [
    {
      title: 'النواة المركزية OmniFix',
      items: [
        { id: 'dashboard', label: 'لوحة التحكم السيادية', icon: Home },
        { id: 'omnifix-core', label: 'مركز التحكم بالوكلاء', icon: Cpu },
        { id: 'automation-engine', label: 'محرك الأتمتة (Auto-Fix)', icon: Zap },
        { id: 'rf-studio', label: 'مختبر الشبكات (RF Studio)', icon: Radio },
        { id: 'firmware-analyzer', label: 'محلل الحماية (Firmware)', icon: ShieldAlert },
        { id: 'security', label: 'مركز الحماية وتخطي الأقفال', icon: Fingerprint },
        { id: 'hardware-telemetry', label: 'تيليمتري الهاردوير', icon: Activity },
      ]
    },
    {
      title: 'أسراب الوكلاء (Hive Agents)',
      items: [
        { id: 'silicon-agent', label: 'وكيل السيليكون (SoC)', icon: Microscope },
        { id: 'rf-agent', label: 'وكيل الترددات (RF)', icon: Radio },
        { id: 'electronics-agent', label: 'وكيل الإلكترونيات', icon: Thermometer },
        { id: 'integrity-agent', label: 'وكيل الحماية والأمان', icon: ShieldAlert },
      ]
    },
    {
      title: 'صناعة المحتوى (إرث تمكين)',
      items: [
        { id: 'content-studio', label: 'استوديو المحتوى (AI)', icon: PenTool },
        { id: 'analytics', label: 'التحليلات المتقدمة', icon: BarChart3 },
      ]
    },
    {
      title: 'أدوات الدعم والذكاء',
      items: [
        { id: 'ai-expert', label: 'خبير المحتوى الذكي', icon: HelpCircle },
      ]
    },
    ...(useAuth().user?.role === 'admin' ? [{
      title: 'الإدارة العليا',
      items: [
        { id: 'admin-dashboard', label: 'لوحة تحكم المدير', icon: ShieldAlert },
      ]
    }] : []),
    {
      title: 'الإعدادات',
      items: [
        { id: 'settings', label: 'الإعدادات', icon: Settings },
      ]
    }
  ];

  return (
    <aside className={`${isOpen ? 'w-72' : 'w-20'} bg-slate-900/60 backdrop-blur-2xl border-l border-slate-800/50 flex flex-col h-[calc(100vh-64px)] sticky top-16 z-30 transition-all duration-300 shadow-[20px_0_50px_rgba(0,0,0,0.3)] group/sidebar`} dir="rtl">
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-3 top-6 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg border border-indigo-400 z-40 hover:scale-110 transition-transform"
      >
        {isOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        
        {/* Navigation Groups */}
        <nav className="space-y-6">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <h5 className={`px-3 mb-2 text-[11px] font-black text-slate-500 uppercase tracking-widest transition-opacity duration-300 ${isOpen ? 'opacity-100 flex items-center gap-2' : 'opacity-0 h-0 overflow-hidden'}`}>
                {group.title}
              </h5>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      title={!isOpen ? item.label : undefined}
                      className={`w-full flex items-center transition-all group relative ${
                        isOpen ? 'gap-3 px-3 py-2.5 rounded-xl text-sm font-bold' : 'justify-center p-3 rounded-xl mb-1'
                      } ${
                        isActive 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="relative">
                        <Icon className={`${isOpen ? 'w-4 h-4' : 'w-5 h-5'} ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-all`} />
                      </div>
                      {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                      {isActive && isOpen && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                      {!isOpen && isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      <div className={`p-4 border-t border-slate-800/80 bg-slate-900/30 transition-all duration-300 ${isOpen ? 'space-y-3' : 'p-2 space-y-2 flex flex-col items-center'}`}>
        {isOpen ? <PWAInstallButton /> : <Download className="w-5 h-5 text-indigo-400 cursor-pointer" />}
        <div className={`flex items-center rounded-xl bg-slate-950/50 border border-slate-800 transition-all ${isOpen ? 'gap-3 p-3' : 'p-2 justify-center w-10 h-10'}`}>
          <Activity className={`text-emerald-400 ${isOpen ? 'w-4 h-4' : 'w-5 h-5'}`} />
          {isOpen && (
            <div className="text-[10px]">
              <p className="text-slate-300 font-bold">النظام يعمل بالذكاء الاصطناعي</p>
              <p className="text-slate-500">الإصدار 4.8.2 المستقر</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
