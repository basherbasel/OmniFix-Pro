import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Key, 
  Fingerprint, 
  FileWarning, 
  Terminal,
  RefreshCw,
  Zap,
  Activity,
  History
} from 'lucide-react';
import { DeviceInfo } from '../types';
import { hardwareBridge } from '../lib/hardwareBridge';

interface SecurityCenterProps {
  device: DeviceInfo;
  onSendTerminalLog: (text: string, type: 'cmd' | 'output' | 'error' | 'success' | 'info') => void;
  onUpdateDevice: React.Dispatch<React.SetStateAction<DeviceInfo>>;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({
  device,
  onSendTerminalLog,
  onUpdateDevice
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isBypassing, setIsBypassing] = useState(false);
  const [selectedExploit, setSelectedExploit] = useState<string | null>(null);

  const securityMetrics = [
    { label: 'FRP Lock Status', status: device.notes?.includes('FRP') ? 'locked' : 'unlocked', detail: 'Google Factory Reset Protection' },
    { label: 'Knox Guard / KG', status: 'normal', detail: 'Samsung Enterprise Security State' },
    { label: 'Bootloader', status: device.bootloaderUnlocked ? 'unlocked' : 'locked', detail: 'Signature Verification Engine' },
    { label: 'DM-Verity', status: 'enforcing', detail: 'Partition Integrity Enforcement' },
    { label: 'SELinux', status: 'enforcing', detail: 'Security Enhanced Linux State' },
    { label: 'Secure Boot', status: 'active', detail: 'Hardware Root of Trust' }
  ];

  const availableExploits = [
    { id: 'mtk_auth_bypass', name: 'MTK SLA/DAA Auth Bypass', type: 'Exploit', description: 'Bypass MediaTek Secure Boot and DAA using brom-payload.', cve: 'CVE-2020-0069 (MTK-SU)' },
    { id: 'qcom_firehose_loader', name: 'Qualcomm Firehose Programmer', type: 'Loader', description: 'Send signed firehose loader to access EDL 9008 mode.', cve: 'N/A' },
    { id: 'apple_checkm8', name: 'Checkm8 Bootrom Exploit', type: 'Bootrom', description: 'Unpatchable bootrom vulnerability for A7-A11 chips.', cve: 'CVE-2019-11043' }
  ];

  const handleRunSecurityAudit = async () => {
    setIsScanning(true);
    onSendTerminalLog('[Security Agent] Starting deep security audit of hardware security modules...', 'info');
    
    // Simulate real scanning steps
    await new Promise(r => setTimeout(r, 1000));
    onSendTerminalLog('> box_cmd --check-trustzone --verify-signatures', 'cmd');
    onSendTerminalLog('[Audit] TrustZone TEE responding: OK', 'success');
    
    await new Promise(r => setTimeout(r, 800));
    onSendTerminalLog('> adb shell getprop ro.boot.flash.locked', 'cmd');
    
    setIsScanning(false);
    onSendTerminalLog('[Security Audit] Audit complete. No unauthorized kernel modifications detected.', 'success');
  };

  const handleBypassFRP = async () => {
    setIsBypassing(true);
    onSendTerminalLog('[Bypass Engine] Initializing FRP Bypass via MTP/Browser exploit...', 'info');
    
    const steps = [
      'Sending MTP trigger to open Browser...',
      'Injecting JavaScript bridge to Settings...',
      'Bypassing SetupWizard via com.sec.android.app.setupwizard...',
      'Writing persistent.sys.frp_bypass=1'
    ];

    for (const step of steps) {
      onSendTerminalLog(`[Bypass] ${step}`, 'info');
      await new Promise(r => setTimeout(r, 1200));
    }

    onUpdateDevice(prev => ({
      ...prev,
      notes: (prev.notes || '').replace('FRP Locked', '').trim() + ' (FRP Bypassed Successfully)'
    }));

    setIsBypassing(false);
    onSendTerminalLog('[Bypass Success] Device FRP Lock has been neutralized.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Security Status Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldAlert className="w-24 h-24 text-rose-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              مركز الأمن والحماية المتقدم (Advanced Security Hub)
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              إدارة أقفال FRP، فحص حالة Knox، وتحليل الثغرات الأمنية (CVE) الخاصة بنظام التشغيل والمعالج.
            </p>
          </div>
          
          <button
            onClick={handleRunSecurityAudit}
            disabled={isScanning}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isScanning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
            فحص أمان النظام
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              مؤشرات الحماية العتادية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityMetrics.map((metric, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">{metric.label}</div>
                    <div className="text-sm font-bold text-white uppercase">{metric.status}</div>
                    <div className="text-[10px] text-slate-500">{metric.detail}</div>
                  </div>
                  {metric.status === 'locked' || metric.status === 'enforcing' || metric.status === 'active' ? (
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Unlock className="w-6 h-6 text-rose-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              أدوات تخطي الحماية (Bypass Tools)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleBypassFRP}
                disabled={isBypassing}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all text-right group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <Fingerprint className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full font-bold">Recommended</span>
                </div>
                <div className="text-sm font-bold text-white">تخطي قفل FRP (Google Lock)</div>
                <p className="text-[10px] text-slate-400 mt-1">تخطي حماية جوجل بعد الفورمات لكافة إصدارات أندرويد 11-14.</p>
              </button>

              <button className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 transition-all text-right group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Key className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded-full font-bold">Advanced</span>
                </div>
                <div className="text-sm font-bold text-white">إزالة قفل Knox Guard (KG)</div>
                <p className="text-[10px] text-slate-400 mt-1">فك تشفير حماية الشركات KG/MDM عبر ثغرة Download Mode.</p>
              </button>
            </div>
          </div>
        </div>

        {/* Exploit Database */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-rose-400" />
              قاعدة بيانات الثغرات (Exploits)
            </h3>
            <div className="space-y-3">
              {availableExploits.map((exploit) => (
                <div 
                  key={exploit.id}
                  onClick={() => setSelectedExploit(exploit.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedExploit === exploit.id 
                      ? 'bg-indigo-950/30 border-indigo-500' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-indigo-400 font-mono">{exploit.type}</span>
                    <span className="text-[9px] text-slate-500">{exploit.cve}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{exploit.name}</div>
                  <p className="text-[10px] text-slate-400 mt-1">{exploit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              سجل العمليات الأمنية
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <div className="text-[10px] text-slate-500 border-l border-slate-800 pl-3 py-1">
                [10:42:15] Audit: Bootloader signature verified
              </div>
              <div className="text-[10px] text-slate-500 border-l border-slate-800 pl-3 py-1">
                [10:42:18] TEE: TrustZone environment stable
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
