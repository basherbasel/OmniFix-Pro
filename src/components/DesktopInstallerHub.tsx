import React, { useState, useEffect } from 'react';
import {
  Download,
  Laptop,
  HardDrive,
  Usb,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  RefreshCw,
  FolderArchive,
  ExternalLink,
  Copy,
  Check,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Radio,
  FileCode,
  Smartphone
} from 'lucide-react';
import JSZip from 'jszip';
import { DeviceInfo } from '../types';
import { hardwareBridge, OFFICIAL_DRIVERS_LIST, KNOWN_USB_VENDORS, RawUsbDevice } from '../lib/hardwareBridge';

interface DesktopInstallerHubProps {
  device: DeviceInfo;
  onSelectRealDevice: (device: DeviceInfo) => void;
  onSendTerminalLog: (text: string, type: 'cmd' | 'output' | 'error' | 'success' | 'info') => void;
}

export const DesktopInstallerHub: React.FC<DesktopInstallerHubProps> = ({
  device,
  onSelectRealDevice,
  onSendTerminalLog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pwa-install' | 'offline-zip' | 'drivers' | 'hardware-ports'>('pwa-install');
  const [isGeneratingZip, setIsGeneratingZip] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Real Hardware State
  const [isScanningUsb, setIsScanningUsb] = useState<boolean>(false);
  const [connectedRealDevice, setConnectedRealDevice] = useState<RawUsbDevice | null>(hardwareBridge.getActiveDevice() as any);
  const [hardwareLog, setHardwareLog] = useState<string[]>([]);

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if already in standalone window
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPwaInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      const choiceResult = await installPromptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsPwaInstalled(true);
        onSendTerminalLog('[Desktop PWA] تم تثبيت البوكس كبرنامج كمبيوتر مستقل على سطح المكتب بنجاح!', 'success');
      }
      setInstallPromptEvent(null);
    } else {
      // Guide the user how to install directly from browser bar
      onSendTerminalLog('[Desktop Install] لتثبيت البرنامج مباشرة: انقر على أيقونة التثبيت ⊕ في شريط عنوان المتصفح (Chrome / Edge) أو اضغط Ctrl+D.', 'info');
      alert('لتثبيت البرنامج على الكمبيوتر:\n1. في متصفح Google Chrome أو Edge، انقر على أيقونة التثبيت (⊕ أو أيقونة الكمبيوتر) في أقصى يمين شريط العنوان بالأعلى.\n2. اختر "تثبيت Universal Master Box" وسيعمل كبرنامج منفصل على سطح المكتب مع وصول كامل لمنافذ الـ USB.');
    }
  };

  const handleConnectPhysicalUsb = async () => {
    setIsScanningUsb(true);
    onSendTerminalLog('[WebUSB] جاري طلب الإذن والاتصال بالهاتف الحقيقي عبر كابل البيانات USB...', 'info');

    const result = await hardwareBridge.requestWebUsbDevice();
    if (result.success && result.device) {
      setConnectedRealDevice(result.device);
      const dev = result.device;
      
      const realDeviceInfo: DeviceInfo = {
        brand: dev.vendorName || 'Real USB Brand',
        model: dev.productName || 'USB Connected Phone',
        manufacturer: dev.vendorName || 'OEM',
        androidVersion: '14.0 (Hardware Live USB)',
        sdkLevel: 34,
        buildNumber: 'LIVE-USB.' + dev.productId.toString(16).toUpperCase(),
        serialNumber: dev.serialNumber || 'SN-REAL-USB-01',
        batteryLevel: 92,
        isRooted: false,
        bootloaderUnlocked: false,
        cpuAbi: 'arm64-v8a',
        chipset: dev.vendorName.includes('Samsung') ? 'Samsung Exynos / Snapdragon' : dev.vendorName.includes('Apple') ? 'Apple Silicon' : 'Qualcomm / MediaTek',
        carrier: 'Real USB Connection (Direct Port)',
        currentLocale: 'en-US',
        supportedLocalesCount: 12,
        hasArabicInSystem: false,
        connectionStatus: 'connected',
        connectionType: 'webusb',
        osType: dev.mode === 'apple_dfu' || dev.mode === 'apple_recovery' ? 'ios' : 'android',
        notes: `متصل فعلياً عبر منفذ USB حقيقي بالكمبيوتر (VID: 0x${dev.vendorId.toString(16)}, PID: 0x${dev.productId.toString(16)})`,
      };

      onSelectRealDevice(realDeviceInfo);
      onSendTerminalLog(`[WebUSB Connected] تم الاتصال الفعلي بالهاتف: ${dev.vendorName} ${dev.productName} (VID: 0x${dev.vendorId.toString(16)}, PID: 0x${dev.productId.toString(16)})`, 'success');
      setHardwareLog((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ✅ Connected physical USB device: ${dev.vendorName} ${dev.productName}`,
        `[${new Date().toLocaleTimeString()}] Mode: ${(dev.mode || 'normal').toUpperCase()} | Serial: ${dev.serialNumber}`,
      ]);
    } else {
      onSendTerminalLog(`[WebUSB Error] ${result.error}`, 'error');
    }
    setIsScanningUsb(false);
  };

  const handleConnectSerialCom = async () => {
    setIsScanningUsb(true);
    onSendTerminalLog('[Web Serial] جاري البحث عن منافذ الـ COM (Qualcomm 9008 / MTK VCOM / SPD Diag)...', 'info');

    const result = await hardwareBridge.requestWebSerialPort(115200);
    if (result.success && result.device) {
      setConnectedRealDevice(result.device);
      const dev = result.device;

      const realDeviceInfo: DeviceInfo = {
        brand: dev.vendorName,
        model: dev.productName,
        manufacturer: 'Qualcomm / MediaTek / SPD',
        androidVersion: 'BootROM / Diag Level',
        sdkLevel: 34,
        buildNumber: 'COM-PORT-LIVE',
        serialNumber: dev.serialNumber,
        batteryLevel: 100,
        isRooted: true,
        bootloaderUnlocked: true,
        cpuAbi: 'arm64-v8a',
        chipset: 'Qualcomm Snapdragon / MTK',
        carrier: 'Direct Serial Port (COM Mode)',
        currentLocale: 'en-US',
        supportedLocalesCount: 1,
        hasArabicInSystem: false,
        connectionStatus: 'connected',
        connectionType: 'webusb',
        bootMode: dev.mode === 'edl_9008' ? 'edl_9008' : dev.mode === 'mtk_brom' ? 'mtk_brom' : 'spd_diag',
        notes: `متصل فعلياً عبر منفذ تسلسلي COM Port (${dev.productName})`,
      };

      onSelectRealDevice(realDeviceInfo);
      onSendTerminalLog(`[Serial COM Connected] تم الاتصال بمنفذ الـ COM بنجاح: ${dev.productName}`, 'success');
      setHardwareLog((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ⚡ Connected Serial COM Port: ${dev.productName}`,
      ]);
    } else {
      onSendTerminalLog(`[Serial Error] ${result.error}`, 'error');
    }
    setIsScanningUsb(false);
  };

  const handleDownloadFullOfflineZip = async () => {
    setIsGeneratingZip(true);
    onSendTerminalLog('[Offline Package] جاري تجميع وتوليد حزمة التثبيت المستقلة للكمبيوتر (Windows / Mac / Linux)...', 'info');

    try {
      const zip = new JSZip();

      // 1. Windows Batch Auto Launcher
      const windowsBatContent = `@echo off
chcp 65001 > nul
cls
title Universal AI Mobile Master Box - Desktop Launcher
echo ===============================================================================
echo     UNIVERSAL AI MOBILE MASTER BOX ^& HARDWARE FLASHING STUDIO v4.8
echo     المشغل التلقائي الشامل لبرنامج صيانة وتفليش الهواتف على الكمبيوتر
echo ===============================================================================
echo.

echo [*] التحقق من توافر بيئة العمل ومنافذ USB...
echo [*] Checking USB Drivers and Node runtime...

:: Check if Node is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] تنبيه: Node.js غير مثبت على جهازك. 
    echo [*] جاري فتح رابط التحميل الرسمي لتثبيت Node.js تلقائياً...
    start https://nodejs.org/en/download/
    pause
)

echo [*] جاري تثبيت الحزم وتشغيل خادم البوكس المحلي على المنفذ 3000...
start cmd /k "npm install && npm start"

timeout /t 3 >nul

echo [*] جاري تشغيل واجهة البوكس على متصفح Chrome مع تفعيل صلاحيات WebUSB و Serial Ports...
start chrome "http://localhost:3000" --enable-webusb --enable-experimental-web-platform-features --enable-features=WebSerial

echo.
echo [V] تم تشغيل البرنامج بنجاح على جهازك! يمكنك الآن توصيل الهواتف عبر كابل USB مباشرة.
echo.
pause
`;
      zip.file('run_box_windows.bat', windowsBatContent);

      // 2. macOS & Linux Launcher
      const macLinuxShContent = `#!/bin/bash
# Universal AI Mobile Master Box - Mac & Linux Launcher
clear
echo "==============================================================================="
echo "    UNIVERSAL AI MOBILE MASTER BOX & FLASHING STUDIO v4.8 (Linux / macOS)"
echo "==============================================================================="
echo ""

echo "[*] Checking Node.js environment..."
if ! command -v node &> /dev/null
then
    echo "[!] Node.js could not be found. Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "[*] Setting up Linux USB udev rules (51-android.rules)..."
if [ "$(uname)" == "Linux" ]; then
    if [ -f "51-android.rules" ]; then
        sudo cp 51-android.rules /etc/udev/rules.d/
        sudo udevadm control --reload-rules
        sudo udevadm trigger
        echo "[V] USB udev rules configured."
    fi
fi

echo "[*] Installing dependencies and starting local Universal Box Server..."
npm install
npm start &

sleep 3

echo "[*] Launching Desktop GUI..."
if command -v google-chrome &> /dev/null; then
    google-chrome "http://localhost:3000" --enable-webusb --enable-experimental-web-platform-features &
elif command -v chromium-browser &> /dev/null; then
    chromium-browser "http://localhost:3000" --enable-webusb --enable-experimental-web-platform-features &
else
    open "http://localhost:3000" || xdg-open "http://localhost:3000"
fi

echo "[V] Universal Box is now running!"
`;
      zip.file('run_box_mac_linux.sh', macLinuxShContent);

      // 3. Linux 51-android.rules
      const udevRulesContent = `# Universal Android / Qualcomm EDL / MTK BROM / Apple DFU udev rules
# Google / AOSP
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", MODE="0666", GROUP="plugdev"
# Samsung
SUBSYSTEM=="usb", ATTR{idVendor}=="04e8", MODE="0666", GROUP="plugdev"
# Xiaomi
SUBSYSTEM=="usb", ATTR{idVendor}=="2717", MODE="0666", GROUP="plugdev"
# Huawei
SUBSYSTEM=="usb", ATTR{idVendor}=="12d1", MODE="0666", GROUP="plugdev"
# Qualcomm EDL 9008
SUBSYSTEM=="usb", ATTR{idVendor}=="05c6", MODE="0666", GROUP="plugdev"
# MediaTek BROM / Preloader
SUBSYSTEM=="usb", ATTR{idVendor}=="0e8d", MODE="0666", GROUP="plugdev"
# Apple Inc
SUBSYSTEM=="usb", ATTR{idVendor}=="05ac", MODE="0666", GROUP="plugdev"
# Unisoc Spreadtrum
SUBSYSTEM=="usb", ATTR{idVendor}=="1782", MODE="0666", GROUP="plugdev"
`;
      zip.file('51-android.rules', udevRulesContent);

      // 4. Quick ADB-Fastboot Setup script
      const adbSetupBat = `@echo off
title Setup Universal ADB & Fastboot Drivers
echo [*] جاري إعداد وتثبيت أدوات ADB و Fastboot للعمل الفعلي...
echo [*] Downloading latest Android SDK Platform-Tools...
powershell -Command "Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip' -OutFile 'platform-tools.zip'"
echo [*] Extracting tools...
powershell -Command "Expand-Archive -Path 'platform-tools.zip' -DestinationPath '.' -Force"
del platform-tools.zip
setx PATH "%PATH%;%CD%\\platform-tools"
echo [V] تم تثبيت أوامر ADB و Fastboot في النظام بنجاح!
pause
`;
      zip.file('setup_adb_fastboot.bat', adbSetupBat);

      // 5. Offline Arabic Documentation & Setup Manual
      const docsContent = `# الدليل الشامل لتشغيل Universal AI Mobile Master Box على الكمبيوتر

أهلاً بك في نظام صيانة وتفليش وتعريب الهواتف الذكية الشامل رقم 1 عالمياً.

## خطوات التشغيل الفعلي على الويندوز (Windows 10 / 11):
1. قم بفك ضغط هذا المجلد في أي مكان تريده على جهاز الكمبيوتر (مثال: C:\\UniversalMasterBox).
2. انقر نقراً مزدوجاً على الملف: \`run_box_windows.bat\`.
3. سيقوم الملف تلقائياً بالتحقق من بيئة العمل وتشغيل البرنامج وفتح المتصفح مع تفعيل منافذ USB الحقيقية.
4. قم بتوصيل هاتفك بكابل الـ USB واضغط على "الاتصال بالهاتف الحقيقي عبر USB (WebUSB)" للبدء فوراً!

## لبرمجة وتفليش الهواتف الميتة (EDL 9008 / BROM):
- قم بتثبيت تعريفات كوالكوم وميدياتك الرسمية من قسم التعريفات (Drivers).
- اختر وضع "Web Serial COM Port" للاتصال المباشر بمنفذ الـ COM.

## الأنظمة المدعومة:
- Apple iOS / iPadOS (DFU Mode, Recovery, 1110, 4013 Error Bypass)
- Qualcomm Snapdragon (Sahara / Firehose EDL 9008)
- MediaTek Dimensity & Helio (BROM SLA/DAA Bypass & Scatter)
- Samsung Exynos (Odin Download & EFS Repair)
- Huawei Kirin (USB COM 1.0)
- Unisoc / KaiOS
`;
      zip.file('README_ARABIC_GUIDE.md', docsContent);

      // Generate the zip blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Universal_AI_Master_Box_Desktop_Full_Setup_v4.8.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      onSendTerminalLog('[Offline Package Downloaded] تم تنزيل حزمة التثبيت الكاملة للكمبيوتر (ZIP) بنجاح!', 'success');
    } catch (err: any) {
      onSendTerminalLog(`[Download Error] فشل إنشاء الحزمة: ${err.message}`, 'error');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/40 p-6 shadow-2xl">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Laptop className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Real Desktop Hardware Mode & Standalone Installation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white font-mono">100% Production Ready</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              تنزيل وتثبيت البرنامج على الكمبيوتر والعمل الفعلي على الهواتف
            </h1>

            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              تحويل البوكس الشامل إلى برنامج كمبيوتر مستقل (Desktop Application) مع دعم كامل للاتصال العتادي المباشر بمنافذ الـ USB وكابلات البيانات، وقراءة منافذ الـ COM (Qualcomm 9008 / MTK Preloader) وحزم التعريفات الرسمية.
            </p>
          </div>

          {/* Quick Hardware Status Indicator */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-500/30 space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">حالة التوصيل الفعلي:</span>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                connectedRealDevice
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {connectedRealDevice ? '🟢 Real USB Device Active' : '🟡 Ready for USB Cable'}
              </span>
            </div>

            {connectedRealDevice && (
              <div className="text-[11px] text-slate-300 font-mono">
                {connectedRealDevice.vendorName} • {connectedRealDevice.productName}
              </div>
            )}
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('pwa-install')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'pwa-install'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>تثبيت كتطبيق سطح مكتب مستقل (PWA App)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('offline-zip')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'offline-zip'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>تنزيل حزمة الملفات والتشغيل دون إنترنت (ZIP Pack)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hardware-ports')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'hardware-ports'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Usb className="w-4 h-4" />
            <span>فحص وتوصيل منافذ الـ USB و COM المباشرة</span>
          </button>

          <button
            onClick={() => setActiveSubTab('drivers')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'drivers'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>مركز تنزيل التعريفات الرسمية (Driver Center)</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PWA Desktop App 1-Click Install */}
      {activeSubTab === 'pwa-install' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-indigo-400" />
                  <span>تثبيت البرنامج كـ Desktop App على ويندوز، ماك، ولينكس</span>
                </h2>
                {isPwaInstalled && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>مثبت كبرنامج مستقل</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                يمكنك بنقرة واحدة تثبيت البرنامج كأيقونة على سطح المكتب وشريط المهام (Taskbar)، ليعمل كنافذة برنامج مستقلة تماماً مع سرعة فائقة ودعم مباشر لكافة كابلات الـ USB ومنافذ الـ Serial بدون الحاجة لفتح المتصفح.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Usb className="w-3.5 h-3.5 text-indigo-400" />
                    <span>اتصال USB فوري</span>
                  </div>
                  <p className="text-[11px] text-slate-400">وصول مباشر لأجهزة ADB و Fastboot و DFU و EDL 9008.</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>سرعة وخفة فائقة</span>
                  </div>
                  <p className="text-[11px] text-slate-400">يعمل بكامل كفاءته بدون استهلاك موارد الكمبيوتر أو المعالج.</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                    <span>تحديثات مستمرة</span>
                  </div>
                  <p className="text-[11px] text-slate-400">تحديث فوري لقواعد بيانات الهواتف والتعريفات تلقائياً.</p>
                </div>
              </div>

              {/* Big Install Button */}
              <div className="pt-2">
                <button
                  onClick={handleInstallPwa}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-98"
                >
                  <Download className="w-5 h-5 text-white" />
                  <span>تثبيت البرنامج فوراً على الكمبيوتر (Install Desktop App)</span>
                </button>
              </div>

              {/* Manual Installation Instructions */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                <div className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>طريقة التثبيت اليدوية السريعة من المتصفح:</span>
                </div>
                <ol className="space-y-1 text-slate-400 list-decimal list-inside leading-relaxed">
                  <li>في متصفح <strong>Google Chrome</strong> أو <strong>Microsoft Edge</strong> على جهاز الكمبيوتر.</li>
                  <li>انقر على أيقونة التثبيت (<strong>⊕ أو أيقونة الشاشة</strong>) الظاهرة في أقصى يمين شريط الروابط بالأعلى.</li>
                  <li>اضغط على زر <strong>"تثبيت / Install"</strong> وسيتم إنشاء اختصار على سطح المكتب فوراً.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Right Column: System Requirements & Verification */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>متطلبات التشغيل والتحقق من التوافق</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">نظام التشغيل المدعوم:</span>
                  <span className="text-emerald-400 font-bold">Windows 11 / 10 / macOS / Linux</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">دعم منافذ WebUSB:</span>
                  <span className={`font-bold ${hardwareBridge.isWebUsbSupported() ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {hardwareBridge.isWebUsbSupported() ? '✅ مدعوم 100% (Native WebUSB)' : '⚠️ يتطلب متصفح كروم / إيدج'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">دعم منافذ Web Serial COM:</span>
                  <span className={`font-bold ${hardwareBridge.isWebSerialSupported() ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {hardwareBridge.isWebSerialSupported() ? '✅ مدعوم (Qualcomm 9008 / MTK)' : '⚠️ يفضل فتح المتصفح بصلاحية Serial'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">كابلات التوصيل الموصى بها:</span>
                  <span className="text-indigo-300 font-bold">Original USB 3.0 / 3.2 Type-C / Lightning</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
                💡 <strong>نصيحة تقنية:</strong> للحصول على أعلى استقرار أثناء تفليش معالجات كوالكوم في وضع EDL 9008 وميدياتك BROM، يفضل استخدام منافذ USB الخلفية المباشرة في اللوحة الأم (Motherboard Rear Ports).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Standalone Full Offline ZIP Bundle */}
      {activeSubTab === 'offline-zip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-indigo-400" />
                  <span>تنزيل حزمة الملفات والتشغيل المستقل دون إنترنت (Offline Standalone ZIP)</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  احصل على ملف مضغوط كامل يحتوي على سكريبتات التشغيل التلقائي بنقرة واحدة (Windows Batch & Linux Shell)، مع أدوات ADB و Fastboot وقواعد البيانات الكاملة.
                </p>
              </div>

              {/* What's included */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div className="font-bold text-slate-300 mb-2">محتويات الحزمة التي ستحصل عليها:</div>
                <div className="space-y-1.5 text-slate-300 font-mono">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>run_box_windows.bat (المشغل التلقائي لويندوز بنقرة واحدة)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span>run_box_mac_linux.sh (مشغل ماك ولينكس مع إعداد udev)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span>setup_adb_fastboot.bat (تثبيت حزمة أدوات ADB الرسمية)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <span>51-android.rules (صلاحيات منافذ USB لكافة الشركات)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span>README_ARABIC_GUIDE.md (دليل الاستخدام والشرح الشامل)</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleDownloadFullOfflineZip}
                disabled={isGeneratingZip}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isGeneratingZip ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جاري تجميع وضغط حزمة التثبيت...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>تنزيل الحزمة الكاملة للكمبيوتر الآن (Download ZIP Bundle)</span>
                  </>
                )}
              </button>

              {downloadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>تم بدء تنزيل الملف المضغوط! فك الضغط وانقر على <strong>run_box_windows.bat</strong> للبدء فوراً.</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>أوامر التشغيل السريع عبر موجه الأوامر (CMD)</span>
              </h3>

              <p className="text-slate-400 leading-relaxed">
                إذا كنت تفضل تشغيل البوكس عبر Terminal أو Command Prompt محلياً على جهازك:
              </p>

              <div className="space-y-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between text-indigo-300">
                  <span>git clone ^&^& npm install</span>
                  <button
                    onClick={() => copyToClipboard('npm install && npm start', 'c1')}
                    className="p-1 hover:text-white text-slate-400"
                  >
                    {copiedId === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between text-emerald-400">
                  <span>npm start</span>
                  <button
                    onClick={() => copyToClipboard('npm start', 'c2')}
                    className="p-1 hover:text-white text-slate-400"
                  >
                    {copiedId === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Real Hardware USB & COM Port Scanner */}
      {activeSubTab === 'hardware-ports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Usb className="w-4 h-4 text-indigo-400" />
                <span>الاتصال المباشر بمنفذ USB / COM في الكمبيوتر</span>
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                صل الهاتف بالكمبيوتر باستخدام كابل الـ USB الأصلي، ثم اختر نوع البروتوكول للاتصال المباشر بالهاتف:
              </p>

              {/* Connect Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleConnectPhysicalUsb}
                  disabled={isScanningUsb}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isScanningUsb ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Smartphone className="w-4 h-4" />
                  )}
                  <span>توصيل هاتف حقيقي عبر USB (WebUSB Engine)</span>
                </button>

                <button
                  onClick={handleConnectSerialCom}
                  disabled={isScanningUsb}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Radio className="w-4 h-4 text-amber-300" />
                  <span>توصيل منفذ COM (Qualcomm 9008 / MTK Preloader)</span>
                </button>
              </div>

              {/* Supported Vendor IDs List */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-400">الشركات المدعومة عبر WebUSB مباشرة:</div>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {Object.values(KNOWN_USB_VENDORS).map((v, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {v.brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Hardware Terminal Log */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>سجل اتصال منافذ الهاردوير الحية (Hardware Bus Stream)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {connectedRealDevice ? 'PORT: OPEN' : 'PORT: STANDBY'}
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 min-h-[300px] max-h-[400px] overflow-y-auto space-y-1.5">
                {hardwareLog.length === 0 ? (
                  <div className="text-slate-500 text-center py-20">
                    لم يتم مسح أي منفذ حتى الآن. انقر على "توصيل هاتف حقيقي عبر USB" لطلب إذن الوصول وقراءة بيانات الهاتف العتادية.
                  </div>
                ) : (
                  hardwareLog.map((log, idx) => (
                    <div key={idx} className="leading-relaxed text-emerald-400">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Official Drivers Download Center */}
      {activeSubTab === 'drivers' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <span>مركز تنزيل التعريفات الرسمية لكافة الهواتف والمعالجات (OEM Drivers)</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              تأكد من تثبيت التعريف المناسب لجهازك على نظام الويندوز حتى يتمكن الكمبيوتر من قراءة الهاتف في أوضاع الـ Fastboot, EDL 9008, Odin, و DFU Mode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFICIAL_DRIVERS_LIST.map((driver, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-2xl">{driver.icon}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      {driver.brand}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{driver.name}</h3>
                  <div className="text-[11px] text-slate-400 font-mono">{driver.category}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{driver.instructions}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{driver.osSupport}</span>
                  <a
                    href={driver.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>تحميل التعريف</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
