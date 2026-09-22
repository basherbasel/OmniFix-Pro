import React from 'react';
import { 
  Smartphone, 
  Battery, 
  Shield, 
  ShieldCheck, 
  Globe2, 
  Cpu, 
  Layers, 
  RotateCw, 
  Terminal, 
  Zap, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { DeviceInfo } from '../types';

interface DeviceInspectorBarProps {
  device: DeviceInfo;
  onOpenModal: () => void;
  onQuickReboot: () => void;
  onForceArabic: () => void;
  onNavigateToArabization?: () => void;
  onConnectRealUsb?: () => void;
  isApplyingQuickAction: boolean;
}

export const DeviceInspectorBar: React.FC<DeviceInspectorBarProps> = ({
  device,
  onOpenModal,
  onQuickReboot,
  onForceArabic,
  onNavigateToArabization,
  onConnectRealUsb,
  isApplyingQuickAction,
}) => {
  const isRealHardware = device.connectionType === 'webusb' || device.connectionType === 'webserial';
  const isDisconnected = device.connectionStatus === 'disconnected';

  return (
    <div className={`border rounded-2xl p-4 shadow-lg mb-6 transition-all duration-300 ${
      isDisconnected
        ? 'bg-rose-950/20 border-rose-600/50 shadow-rose-950/30'
        : isRealHardware
        ? 'bg-slate-900 border-emerald-500/40 shadow-emerald-950/20'
        : 'bg-slate-900 border-slate-800'
    }`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left: Device Core Info */}
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner ${
            isDisconnected
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 ring-2 ring-rose-500/30 animate-pulse'
              : isRealHardware 
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30' 
              : 'bg-gradient-to-br from-indigo-600/20 to-slate-800 border-indigo-500/30 text-indigo-400'
          }`}>
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                {device.brand} {device.model}
              </h2>
              {isDisconnected ? (
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/60 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  الكابل مفصول (Disconnected)
                </span>
              ) : isRealHardware ? (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  هاتف حقيقي متصل بكابل USB (Live Connected)
                </span>
              ) : (
                <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  جاهز للتشغيل والربط
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1 font-mono">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                {device.androidVersion} (SDK {device.sdkLevel})
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 font-mono">
                <Cpu className="w-3.5 h-3.5 text-slate-500" />
                {device.chipset}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-medium bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                {device.carrier}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Key Status Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className={`px-3 py-1.5 rounded-xl flex items-center gap-2 border ${
            isDisconnected 
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-300' 
              : 'bg-slate-950/60 border-slate-800 text-slate-300'
          }`}>
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span>البطارية: <strong className="text-white">{device.batteryLevel}%</strong></span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-slate-300">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <span>اللغة: <strong className="text-white">{device.currentLocale}</strong></span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-slate-300">
            {device.isRooted ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">مروّت (Rooted)</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400">بدون روت</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 self-end lg:self-center w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          {onConnectRealUsb && (
            <button
              onClick={onConnectRealUsb}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-700/30"
              title="توصيل كابل USB وقراءة الهاتف الحقيقي فوراً من المتصفح"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>توصيل USB حقيقي</span>
            </button>
          )}

          {onNavigateToArabization && (
            <button
              onClick={onNavigateToArabization}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
              title="فتح استوديو التعريب الشامل وكافة الدول"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>استوديو التعريب</span>
            </button>
          )}

          <button
            onClick={onForceArabic}
            disabled={isApplyingQuickAction}
            className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
            title="إرسال أمر تعريب سريع مباشر للجهاز"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>تعريب فوري (ar-SA)</span>
          </button>

          <button
            onClick={onQuickReboot}
            disabled={isApplyingQuickAction}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700"
            title="إعادة تشغيل الهاتف"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>إعادة تشغيل</span>
          </button>

          <button
            onClick={onOpenModal}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-2 rounded-xl transition flex items-center gap-1 border border-slate-700"
          >
            <span>الأجهزة</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
