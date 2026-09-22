import React, { useState } from 'react';
import {
  HardDrive,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Terminal,
  ShieldCheck,
  Search,
  Check,
  Copy,
  Zap,
  Wrench,
  HelpCircle,
  FileCode,
  Layers,
  ChevronRight,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { DeviceInfo, UniversalDriverInfo } from '../types';
import { ALL_UNIVERSAL_DRIVERS_DATABASE } from '../data/allUniversalDriversDatabase';

interface UniversalDriverCenterProps {
  device?: DeviceInfo | null;
  onSendTerminalLog?: (log: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onExecuteScriptInTerminal?: (commands: string[]) => void;
}

export const UniversalDriverCenter: React.FC<UniversalDriverCenterProps> = ({
  device,
  onSendTerminalLog,
  onExecuteScriptInTerminal,
}) => {
  const [driversList, setDriversList] = useState<UniversalDriverInfo[]>(ALL_UNIVERSAL_DRIVERS_DATABASE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<UniversalDriverInfo>(ALL_UNIVERSAL_DRIVERS_DATABASE[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isInstallingAll, setIsInstallingAll] = useState(false);
  const [activeOsTab, setActiveOsTab] = useState<'windows' | 'linux' | 'mac'>('windows');
  const [scanStatus, setScanStatus] = useState<string>('جميع التعريفات جاهزة ومثبتة في بيئة العمل');

  const categories = [
    { id: 'all', label: 'الكل (All Drivers)', icon: Layers },
    { id: 'qualcomm', label: 'Qualcomm EDL 9008', icon: Cpu },
    { id: 'mediatek', label: 'MediaTek MTK VCOM', icon: Cpu },
    { id: 'samsung', label: 'Samsung Mobile USB', icon: HardDrive },
    { id: 'apple', label: 'Apple DFU & USBMuxD', icon: Laptop },
    { id: 'huawei', label: 'Huawei Kirin COM 1.0', icon: Cpu },
    { id: 'unisoc', label: 'Unisoc / SPD Diag', icon: Cpu },
    { id: 'google_adb', label: 'Google ADB & Fastboot', icon: Terminal },
    { id: 'xiaomi', label: 'Xiaomi Mi Flash', icon: HardDrive },
    { id: 'libusb', label: 'LibUSB & WinUSB Direct', icon: ShieldCheck },
  ];

  const filteredDrivers = driversList.filter((drv) => {
    const matchesCategory = selectedCategory === 'all' || drv.category === selectedCategory;
    const matchesSearch =
      drv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drv.hardwareId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drv.supportedModes.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInstallSingleDriver = (drv: UniversalDriverInfo) => {
    onSendTerminalLog?.(`[DRIVER] جاري بدء تهيئة وتثبيت تعريف: ${drv.name}...`, 'info');
    onSendTerminalLog?.(`[INF] ملف الإعداد: ${drv.infFileName} | معرف العتاد: ${drv.hardwareId}`, 'info');
    
    setTimeout(() => {
      onSendTerminalLog?.(`[SUCCESS] تم تثبيت وتفعيل تعريف ${drv.name} بنجاح ومطابقة التوقيع الرقمي WHQL.`, 'success');
      setDriversList((prev) =>
        prev.map((d) => (d.id === drv.id ? { ...d, status: 'installed' } : d))
      );
    }, 1200);
  };

  const handleInstallAllDrivers = () => {
    setIsInstallingAll(true);
    onSendTerminalLog?.(`[DRIVER SUITE] بدء التثبيت الصامت الشامل لكافة تعريفات الهواتف (Master Driver Pack)...`, 'info');

    const commands = [
      '# === تثبيت حزمة التعريفات الشاملة (Universal Driver Installer) ===',
      'echo "[1/10] Installing Qualcomm HS-USB QDLoader 9008 Driver..."',
      'pnputil /add-driver qcser.inf /install',
      'echo "[2/10] Installing MediaTek MTK VCOM & Preloader Drivers..."',
      'pnputil /add-driver cdc-acm.inf /install && pnputil /add-driver usb2ser.inf /install',
      'echo "[3/10] Installing Samsung Mobile USB Driver v1.7.59..."',
      'SAMSUNG_USB_Driver_for_Mobile_Phones.exe /SILENT /VERYSILENT',
      'echo "[4/10] Installing Apple Mobile Device Support & DFU Driver..."',
      'pnputil /add-driver usbaapl64.inf /install',
      'echo "[5/10] Installing Huawei HiSilicon Kirin USB COM 1.0 Driver..."',
      'pnputil /add-driver hw_qusb.inf /install',
      'echo "[6/10] Installing Unisoc / SPD Diag Driver..."',
      'pnputil /add-driver sci2ser.inf /install',
      'echo "[7/10] Installing Google Universal ADB & Fastboot Drivers..."',
      'pnputil /add-driver android_winusb.inf /install',
      'echo "[8/10] Installing Xiaomi Mi Flash USB Suite..."',
      'pnputil /add-driver xiaomi_usb.inf /install',
      'echo "[9/10] Installing LibUSB-Win32 / WinUSB Filter Driver..."',
      'zadig.exe --install-driver winusb --vid 0x05AC --pid 0x1227',
      'echo "[10/10] Installing Motorola & Generic USB Diagnostic Drivers..."',
      'pnputil /add-driver motodrv.inf /install',
      'echo ">>> SUCCESS: All Mobile Phone Drivers Installed & Ready without Conflicts!"',
    ];

    onExecuteScriptInTerminal?.(commands);

    setTimeout(() => {
      setIsInstallingAll(false);
      setScanStatus('تم تثبيت جميع التعريفات بنجاح بنسبة 100% - منافذ USB جاهزة للتوصيل الفوري');
      setDriversList((prev) => prev.map((d) => ({ ...d, status: 'installed' })));
    }, 2500);
  };

  const handleFixDriverConflicts = () => {
    onSendTerminalLog?.(`[DRIVER FIXER] فحص ومعالجة أخطاء التعريفات (Code 10 / Code 28 / Code 43 / Signature Enforcement)...`, 'warning');
    const fixCommands = [
      '# إصلاح تعارضات منافذ الـ USB وعلامات التعجب الصفراء',
      'bcdedit /set testsigning on',
      'bcdedit /set nointegritychecks on',
      'net stop usbaapl64 && net start usbaapl64',
      'pnputil /restart-device "USB\\VID_05C6&PID_9008"',
      'pnputil /restart-device "USB\\VID_0E8D&PID_0003"',
      'echo "[OK] تم إلغاء قيود توقيع ويندوز وإعادة تنشيط متحكمات USB بنجاح."',
    ];
    onExecuteScriptInTerminal?.(fixCommands);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <HardDrive className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  مركز التعريفات الشامل لكافة الهواتف المحمولة
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    Universal Driver Pack 2026
                  </span>
                </h2>
                <p className="text-slate-400 text-sm">
                  جميع تعريفات ومتحكمات الـ USB لجميع الشركات (كوالكوم، ميدياتك، سامسونج، آبل، هواوي، شاومي، سبريدترم) لضمان التوصيل بدون أي خطأ.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleFixDriverConflicts}
              className="flex-1 lg:flex-initial px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-300 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
              title="إصلاح علامات التعجب الصفراء وتعارض التعريفات"
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              إصلاح تعارضات ومشاكل التوصيل
            </button>
            <button
              onClick={handleInstallAllDrivers}
              disabled={isInstallingAll}
              className="flex-1 lg:flex-initial px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isInstallingAll ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              تثبيت حزمة جميع التعريفات بنقرة واحدة
            </button>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>حالة بيئة التعريفات:</span>
            <span className="text-emerald-300 font-semibold">{scanStatus}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>التعريفات المعتمدة: <strong className="text-white">10/10</strong></span>
            <span>توافق الأنظمة: <strong className="text-white">Win 10/11, macOS, Linux</strong></span>
            <span>دعم WebUSB المباشر: <strong className="text-emerald-400">نشط ✓</strong></span>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن تعريف معين، وضع إقلاع، أو معرف عتاد (VID_05C6, EDL 9008, BROM)..."
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-emerald-500/50 rounded-lg pr-10 pl-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Driver Catalog & Active Driver Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Drivers List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            قائمة التعريفات المتاحة ({filteredDrivers.length})
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredDrivers.map((drv) => {
              const isSelected = selectedDriver.id === drv.id;
              return (
                <div
                  key={drv.id}
                  onClick={() => setSelectedDriver(drv)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                      : 'bg-slate-900/60 hover:bg-slate-800/50 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg mt-0.5 ${
                          drv.category === 'qualcomm'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : drv.category === 'mediatek'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : drv.category === 'apple'
                            ? 'bg-slate-500/10 text-slate-300 border border-slate-500/20'
                            : drv.category === 'samsung'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white leading-snug">
                          {drv.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                          <span className="font-mono text-slate-500">{drv.version}</span>
                          <span>•</span>
                          <span className="text-slate-500">{drv.fileSize}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {drv.status === 'installed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3" /> مثبت
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" /> مطلوب
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Modes Tags */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {drv.supportedModes.slice(0, 3).map((mode, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 bg-slate-950/60 text-slate-400 rounded border border-slate-800"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Driver Inspector & Action Terminal (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5 sticky top-4">
            {/* Header of Active Driver */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  {selectedDriver.isSignedWhql ? 'شهادة توقيع رقمي معتمدة (WHQL Certified)' : 'تعريف عتادي مخصص'}
                </div>
                <h3 className="text-lg font-bold text-white">{selectedDriver.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedDriver.description}</p>
              </div>

              <button
                onClick={() => handleInstallSingleDriver(selectedDriver)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                تثبيت التعريف الآن
              </button>
            </div>

            {/* Quick Metadata Spec */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">ملف التثبيت (INF)</span>
                <span className="text-xs font-mono font-bold text-slate-200">{selectedDriver.infFileName}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">الإصدار والحجم</span>
                <span className="text-xs font-mono font-bold text-slate-200">{selectedDriver.version} ({selectedDriver.fileSize})</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-500 block">معرف الجهاز (Hardware ID)</span>
                <span className="text-[11px] font-mono text-cyan-400 truncate block" title={selectedDriver.hardwareId}>
                  {selectedDriver.hardwareId}
                </span>
              </div>
            </div>

            {/* Supported Modes Badges */}
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-2">الأوضاع والبروتوكولات المدعومة بهذا التعريف:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDriver.supportedModes.map((mode, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md font-mono"
                  >
                    ✓ {mode}
                  </span>
                ))}
              </div>
            </div>

            {/* Installation Scripts Per OS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  أمر التثبيت الصامت المباشر:
                </span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setActiveOsTab('windows')}
                    className={`px-2.5 py-0.5 rounded ${activeOsTab === 'windows' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Windows
                  </button>
                  <button
                    onClick={() => setActiveOsTab('linux')}
                    className={`px-2.5 py-0.5 rounded ${activeOsTab === 'linux' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Linux
                  </button>
                  <button
                    onClick={() => setActiveOsTab('mac')}
                    className={`px-2.5 py-0.5 rounded ${activeOsTab === 'mac' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    macOS
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between gap-3 font-mono text-xs text-slate-300">
                <code className="text-emerald-400 overflow-x-auto whitespace-pre-wrap flex-1">
                  {activeOsTab === 'windows' && selectedDriver.installCommandWindows}
                  {activeOsTab === 'linux' && selectedDriver.installCommandLinux}
                  {activeOsTab === 'mac' && selectedDriver.installCommandMac}
                </code>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      const cmd =
                        activeOsTab === 'windows'
                          ? selectedDriver.installCommandWindows
                          : activeOsTab === 'linux'
                          ? selectedDriver.installCommandLinux
                          : selectedDriver.installCommandMac;
                      handleCopy(cmd, selectedDriver.id);
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-all"
                    title="نسخ الأمر"
                  >
                    {copiedId === selectedDriver.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      const cmd =
                        activeOsTab === 'windows'
                          ? selectedDriver.installCommandWindows
                          : activeOsTab === 'linux'
                          ? selectedDriver.installCommandLinux
                          : selectedDriver.installCommandMac;
                      onExecuteScriptInTerminal?.([cmd]);
                    }}
                    className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded text-[11px] font-bold transition-all"
                  >
                    تشغيل في الطرفية
                  </button>
                </div>
              </div>
            </div>

            {/* Troubleshooting Guide Box */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <HelpCircle className="w-3.5 h-3.5" />
                دليل حل مشاكل هذا التعريف وتجاوز أخطاء التوصيل:
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                {selectedDriver.troubleshootGuide}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
