import React, { useState, useMemo } from 'react';
import { 
  X, 
  Usb, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Sparkles, 
  HelpCircle, 
  Radio, 
  Cpu, 
  Layers,
  Search,
  Check,
  Globe2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { DeviceInfo } from '../types';
import { POPULAR_DEVICES } from '../data/devicePresets';
import { hardwareBridge, KNOWN_USB_VENDORS } from '../lib/hardwareBridge';

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDevice: DeviceInfo;
  onSelectDevice: (device: DeviceInfo) => void;
  onCustomDeviceCreate: (device: DeviceInfo) => void;
}

export const DeviceModal: React.FC<DeviceModalProps> = ({
  isOpen,
  onClose,
  activeDevice,
  onSelectDevice,
  onCustomDeviceCreate,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'webusb' | 'custom' | 'guide'>('presets');
  const [webUsbStatus, setWebUsbStatus] = useState<string>('');
  const [isSearchingUsb, setIsSearchingUsb] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');

  // Custom device form state
  const [customBrand, setCustomBrand] = useState('Samsung');
  const [customModel, setCustomModel] = useState('Galaxy S22 Ultra (SM-S908U)');
  const [customAndroid, setCustomAndroid] = useState('14.0');
  const [customChipset, setCustomChipset] = useState('Snapdragon 8 Gen 1');
  const [customCarrier, setCustomCarrier] = useState('Verizon Wireless (VZW)');
  const [customIsRooted, setCustomIsRooted] = useState(false);
  const [customBootloaderUnlocked, setCustomBootloaderUnlocked] = useState(false);
  const [customNotes, setCustomNotes] = useState('جهاز مقفل لغات من الشركة المصنعة');

  const brandFilters = [
    { id: 'all', label: 'كافة الأجهزة العالمية' },
    { id: 'Samsung', label: 'سامسونج (Galaxy)' },
    { id: 'Xiaomi', label: 'شاومي / ريدمي / بوكو' },
    { id: 'Google', label: 'جوجل بيكسل (Pixel)' },
    { id: 'Huawei', label: 'هواوي / هونر' },
    { id: 'Motorola', label: 'موتورولا (Moto)' },
    { id: 'LG', label: 'إل جي (LG UX)' },
    { id: 'Sony', label: 'سوني إكسبيريا (Xperia)' },
    { id: 'OnePlus', label: 'ون بلس / أوبو / ريلمي' },
    { id: 'Universal', label: 'أي جهاز أندرويد بالعالم' },
  ];

  const filteredPresets = useMemo(() => {
    return POPULAR_DEVICES.filter((d) => {
      const matchesSearch = 
        d.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.notes?.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedBrandFilter === 'all') return matchesSearch;
      if (selectedBrandFilter === 'Samsung') return matchesSearch && d.brand === 'Samsung';
      if (selectedBrandFilter === 'Xiaomi') return matchesSearch && (d.brand === 'Xiaomi' || d.model.includes('Redmi') || d.model.includes('Poco'));
      if (selectedBrandFilter === 'Google') return matchesSearch && d.brand === 'Google';
      if (selectedBrandFilter === 'Huawei') return matchesSearch && (d.brand === 'Huawei' || d.brand === 'Honor');
      if (selectedBrandFilter === 'Motorola') return matchesSearch && d.brand === 'Motorola';
      if (selectedBrandFilter === 'LG') return matchesSearch && d.brand === 'LG';
      if (selectedBrandFilter === 'Sony') return matchesSearch && d.brand === 'Sony';
      if (selectedBrandFilter === 'OnePlus') return matchesSearch && (d.brand === 'OnePlus' || d.brand === 'Oppo' || d.brand === 'Realme');
      if (selectedBrandFilter === 'Universal') return matchesSearch && (d.brand.includes('Universal') || d.model.includes('Generic'));
      return matchesSearch;
    });
  }, [searchQuery, selectedBrandFilter]);

  if (!isOpen) return null;

  // WebUSB Direct Physical Connection Handler
  const handleConnectWebUsb = async () => {
    setIsSearchingUsb(true);
    setWebUsbStatus('جاري فتح نافذة إذن WebUSB من المتصفح... يرجى اختيار هاتفك المتصل بالكابل.');

    const res = await hardwareBridge.requestWebUsbDevice();
    if (res.success && res.device) {
      const dev = res.device;
      const newRealDevice: DeviceInfo = {
        brand: dev.vendorName || 'Real USB Device',
        model: dev.productName || 'USB Connected Device',
        manufacturer: dev.vendorName || 'OEM',
        androidVersion: '14.0 (Live Hardware USB)',
        sdkLevel: 34,
        buildNumber: 'LIVE.USB.' + dev.productId.toString(16).toUpperCase(),
        serialNumber: dev.serialNumber || 'SN-USB-' + Math.random().toString(36).substring(6).toUpperCase(),
        batteryLevel: 90,
        isRooted: false,
        bootloaderUnlocked: false,
        cpuAbi: 'arm64-v8a',
        chipset: 'Auto Hardware Detected',
        carrier: 'Real USB Hardware Port',
        currentLocale: 'en-US',
        supportedLocalesCount: 12,
        hasArabicInSystem: false,
        connectionStatus: 'connected',
        connectionType: 'webusb',
        osType: (dev.mode === 'apple_dfu' || dev.mode === 'apple_recovery') ? 'ios' : 'android',
        notes: `تم الاتصال بنجاح بالجهاز عبر منفذ USB الحقيقي: ${dev.vendorName} ${dev.productName} (VID: 0x${(dev.vendorId || 0).toString(16)})`,
      };

      onSelectDevice(newRealDevice);
      setWebUsbStatus(`✅ تم الاتصال بنجاح بالهاتف الحقيقي: ${dev.vendorName} ${dev.productName}`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setWebUsbStatus(`${res.error || 'لم يتم اختيار أي جهاز.'}`);
    }
    setIsSearchingUsb(false);
  };

  // Web Serial COM Port Connection Handler
  const handleConnectSerialCom = async () => {
    setIsSearchingUsb(true);
    setWebUsbStatus('جاري البحث عن منافذ الـ COM (Qualcomm 9008 / MTK Preloader)...');

    const res = await hardwareBridge.requestWebSerialPort(115200);
    if (res.success && res.device) {
      const dev = res.device;
      const newRealDevice: DeviceInfo = {
        brand: dev.vendorName,
        model: dev.productName,
        manufacturer: 'Qualcomm / MediaTek / SPD',
        androidVersion: 'BootROM Level',
        sdkLevel: 34,
        buildNumber: 'COM-LIVE',
        serialNumber: dev.serialNumber,
        batteryLevel: 100,
        isRooted: true,
        bootloaderUnlocked: true,
        cpuAbi: 'arm64-v8a',
        chipset: 'Qualcomm / MTK / Unisoc',
        carrier: 'COM Serial Port',
        currentLocale: 'en-US',
        supportedLocalesCount: 1,
        hasArabicInSystem: false,
        connectionStatus: 'connected',
        connectionType: 'webusb',
        bootMode: (dev.mode === 'edl_9008' ? 'edl_9008' : dev.mode === 'mtk_brom' ? 'mtk_brom' : 'spd_diag') as any,
        notes: `متصل فعلياً عبر منفذ تسلسلي COM Port (${dev.productName})`,
      };

      onSelectDevice(newRealDevice);
      setWebUsbStatus(`✅ تم الاتصال بمنفذ الـ COM بنجاح: ${dev.productName}`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setWebUsbStatus(`⚠️ ${res.error || 'لم يتم اختيار منفذ COM.'}`);
    }
    setIsSearchingUsb(false);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const newDevice: DeviceInfo = {
      brand: customBrand,
      model: customModel,
      manufacturer: customBrand,
      androidVersion: customAndroid,
      sdkLevel: parseInt(customAndroid) >= 14 ? 34 : 33,
      buildNumber: 'CUSTOM.' + Math.random().toString(36).substring(7).toUpperCase(),
      serialNumber: 'SN-' + Math.random().toString(36).substring(5).toUpperCase(),
      batteryLevel: 90,
      isRooted: customIsRooted,
      bootloaderUnlocked: customBootloaderUnlocked,
      cpuAbi: 'arm64-v8a',
      chipset: customChipset,
      carrier: customCarrier,
      currentLocale: 'en-US',
      supportedLocalesCount: 6,
      hasArabicInSystem: false,
      connectionStatus: 'connected',
      connectionType: 'simulated',
      notes: customNotes,
    };
    onCustomDeviceCreate(newDevice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">إدارة وتحديد أجهزة الأندرويد العالمية (Universal Device Library)</h2>
              <p className="text-xs text-slate-400">اختر هاتفك أو قم بتوصيله عبر USB لتعريبه بضغطة زر واحدة بالذكاء الاصطناعي</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'presets'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            مكتبة كافة الهواتف العالمية ({POPULAR_DEVICES.length}+ جهاز)
          </button>
          
          <button
            onClick={() => setActiveTab('webusb')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'webusb'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            توصيل هاتف حقيقي (WebUSB)
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'custom'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة أي هاتف بالعالم
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            دليل تفعيل تصحيح USB
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Tab 1: Global Presets with Search & Filter */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن أي ماركة أو موديل (مثال: S24, Note 20, Xiaomi 14, Pixel, LG, Xperia, Motorola)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      مسح
                    </button>
                  )}
                </div>
              </div>

              {/* Brand Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {brandFilters.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrandFilter(brand.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      selectedBrandFilter === brand.id
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 font-bold'
                        : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {brand.label}
                  </button>
                ))}
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {filteredPresets.map((device) => {
                  const isSelected = activeDevice.model === device.model;
                  return (
                    <div
                      key={device.model}
                      onClick={() => {
                        onSelectDevice(device);
                        onClose();
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-right ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-950/50'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          <span className="font-bold text-sm text-white">{device.brand}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 font-mono">
                          {device.carrier}
                        </span>
                      </div>
                      
                      <div className="mt-2 text-xs font-semibold text-slate-200 truncate">
                        {device.model}
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-500" /> أندرويد {device.androidVersion.split(' ')[0]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-slate-500" /> {device.chipset.split(' ')[0]}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-700/50 text-[10px] text-slate-400 line-clamp-2">
                        {device.notes}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredPresets.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  لم يتم العثور على أجهزة مطابقة للبحث. يمكنك إضافة جهازك يدوياً عبر تبويب "إضافة جهاز مخصص".
                </div>
              )}
            </div>
          )}

          {/* Tab 2: WebUSB & Real Hardware Connection */}
          {activeTab === 'webusb' && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <Usb className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-white">توصيل هاتف حقيقي عبر كابل USB أو منفذ COM</h3>
                <p className="text-xs text-slate-400 mt-1">
                  يدعم الاستوديو تقنية WebUSB و Web Serial المباشرة للتعرف الفعلي على أجهزة الأندرويد، الآيفون (DFU)، ومنافذ كوالكوم (EDL 9008) وميدياتك (BROM).
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 max-w-md mx-auto text-right text-xs space-y-2">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> متطلبات التوصيل السريع والفعلي:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pr-2">
                  <li>تفعيل خيار "تصحيح أخطاء USB" (USB Debugging) في الأندرويد.</li>
                  <li>لهواتف كوالكوم الميتة: الإقلاع في وضع <strong>EDL 9008</strong> عبر TestPoint أو كابل EDL.</li>
                  <li>لهواتف الآيفون: الدخول في وضع <strong>DFU Mode</strong> أو <strong>Recovery Mode</strong>.</li>
                  <li>استخدام متصفح <strong>Google Chrome</strong> أو <strong>Microsoft Edge</strong> على الكمبيوتر.</li>
                </ul>
              </div>

              {webUsbStatus && (
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-emerald-300 max-w-md mx-auto text-center">
                  {webUsbStatus}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <button
                  onClick={handleConnectWebUsb}
                  disabled={isSearchingUsb}
                  className="w-full sm:w-auto flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-lg shadow-emerald-600/30 inline-flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {isSearchingUsb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Usb className="w-4 h-4" />}
                  <span>اتصال USB مباشر (ADB / DFU)</span>
                </button>

                <button
                  onClick={handleConnectSerialCom}
                  disabled={isSearchingUsb}
                  className="w-full sm:w-auto flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-lg shadow-indigo-600/30 inline-flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {isSearchingUsb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                  <span>منفذ COM (Qualcomm 9008 / MTK)</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Custom Device Creator */}
          {activeTab === 'custom' && (
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div className="text-xs text-slate-400">
                أدخل بيانات أي هاتف أندرويد في العالم ليقوم الذكاء الاصطناعي بتحليله وتوليد سكريبت تعريب فائق الأمان خاص به:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الشركة المصنعة (Brand)</label>
                  <input
                    type="text"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    required
                    placeholder="مثال: Samsung, Xiaomi, LG, Motorola, Sony, Vivo, Oppo, Infinix"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">اسم الموديل / الرمز البرمجي (Model)</label>
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    required
                    placeholder="مثال: Galaxy S24 Ultra SM-S928U"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">إصدار أندرويد (Android Version)</label>
                  <input
                    type="text"
                    value={customAndroid}
                    onChange={(e) => setCustomAndroid(e.target.value)}
                    required
                    placeholder="مثال: 14.0 أو 13.0 أو 12.0 أو 11.0"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">المعالج (Chipset)</label>
                  <input
                    type="text"
                    value={customChipset}
                    onChange={(e) => setCustomChipset(e.target.value)}
                    placeholder="مثال: Snapdragon 8 Gen 3 / Dimensity 9300 / Exynos"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">المشغل / توجيه الهاتف (Carrier / Region)</label>
                  <input
                    type="text"
                    value={customCarrier}
                    onChange={(e) => setCustomCarrier(e.target.value)}
                    placeholder="مثال: Verizon USA (VZW) / AT&T / Docomo Japan / China ROM / Global"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 py-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={customIsRooted}
                      onChange={(e) => setCustomIsRooted(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800 w-4 h-4"
                    />
                    <span>الهاتف مروّت (Rooted)?</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={customBootloaderUnlocked}
                      onChange={(e) => setCustomBootloaderUnlocked(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800 w-4 h-4"
                    />
                    <span>البوتلودر مفتوح (Bootloader Unlocked)?</span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات أو مشاكل محددة في هذا الهاتف</label>
                  <textarea
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    rows={2}
                    placeholder="مثال: الهاتف لا يظهر اللغة العربية في الإعدادات، أو تختفي بعد إعادة التشغيل"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  حفظ وتعيين للتعريب الفوري
                </button>
              </div>
            </form>
          )}

          {/* Tab 4: Step by Step Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> طريقة تفعيل خيارات المطور وتصحيح USB على أي جهاز أندرويد:
                </h4>
                
                <div className="space-y-2 text-slate-300">
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                    <p>افتح <strong>الإعدادات (Settings)</strong> ثم اذهب إلى <strong>حول الهاتف (About Phone)</strong>.</p>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                    <p>ابحث عن <strong>رقم الإصدار (Build Number)</strong> واضغط عليه <strong>7 مرات متتالية</strong> حتى تظهر رسالة "أنت الآن مطور برامج!".</p>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                    <p>ارجع للإعدادات وادخل إلى <strong>خيارات المطور (Developer Options)</strong> وقم بتفعيلها.</p>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-emerald-400 font-bold flex items-center justify-center shrink-0">4</span>
                    <p>فعل خيار <strong>تصحيح أخطاء USB (USB Debugging)</strong>.</p>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-emerald-400 font-bold flex items-center justify-center shrink-0">5</span>
                    <p>عند توصيل الهاتف بالكمبيوتر، ستظهر نافذة على شاشة الهاتف تطلب <strong>"السماح بتصحيح أخطاء USB"</strong>، ضع علامة صح على <strong>"السماح دائماً من هذا الكمبيوتر"</strong> ثم اضغط <strong>موافق (Allow)</strong>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">ملاحظة لأجهزة شاومي (Xiaomi / Redmi / POCO):</div>
                  <p className="text-[11px] text-amber-200/90 mt-0.5">
                    في أجهزة شاومي يجب أيضاً تفعيل خياري <strong>"USB Debugging (Security settings)"</strong> و <strong>"Install via USB"</strong> من خيارات المطور لمنح الصلاحيات بنجاح.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
