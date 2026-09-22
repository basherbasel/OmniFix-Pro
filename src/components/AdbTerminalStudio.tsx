import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  ShieldAlert, 
  Zap,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { DeviceInfo, TerminalLog, AdbCommandPreset } from '../types';
import { ADB_COMMAND_PRESETS } from '../data/adbCommands';

interface AdbTerminalStudioProps {
  device: DeviceInfo;
  logs: TerminalLog[];
  onClearLogs: () => void;
  onExecuteCommand: (command: string) => void;
}

export const AdbTerminalStudio: React.FC<AdbTerminalStudioProps> = ({
  device,
  logs,
  onClearLogs,
  onExecuteCommand,
}) => {
  const [inputCommand, setInputCommand] = useState('adb shell getprop ro.product.model');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedLogs, setCopiedLogs] = useState(false);

  const categories = [
    { id: 'all', label: 'الكل (All)' },
    { id: 'arabization', label: 'التعريب وتغيير اللغة' },
    { id: 'permissions', label: 'صلاحيات النظام (Permissions)' },
    { id: 'csc', label: 'إعدادات CSC والشبكات' },
    { id: 'diagnosis', label: 'فحص وتشخيص' },
    { id: 'reboot', label: 'أوضاع إعادة التشغيل' },
  ];

  const filteredPresets = selectedCategory === 'all'
    ? ADB_COMMAND_PRESETS
    : ADB_COMMAND_PRESETS.filter((p) => p.category === selectedCategory);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;
    onExecuteCommand(inputCommand.trim());
    setInputCommand('');
  };

  const handlePresetClick = (preset: AdbCommandPreset) => {
    setInputCommand(preset.command);
    onExecuteCommand(preset.command);
  };

  const copyAllLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${(l.type || 'info').toUpperCase()}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  const downloadLogFile = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${(l.type || 'info').toUpperCase()}] ${l.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adb_terminal_log_${device.brand}_${device.model.replace(/\s+/g, '_')}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <Terminal className="w-3.5 h-3.5" /> طرفية التحكم وأوامر الأندرويد الاحترافية (ADB Shell & Terminal Studio)
          </div>
          <h2 className="text-xl font-bold text-white">
            تشغيل أوامر الشل والتحكم بهاتف <span className="text-emerald-400">{device.brand} {device.model}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            تنفيذ أوامر تصحيح أخطاء الأندرويد (ADB)، ومنح أذونات النظام العميقة، وفحص خصائص النظام واللغات، وتعديل إعدادات المشغل بمرونة تامة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyAllLogs}
            disabled={logs.length === 0}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700"
          >
            {copiedLogs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLogs ? 'تم النسخ' : 'نسخ السجل'}</span>
          </button>

          <button
            onClick={downloadLogFile}
            disabled={logs.length === 0}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>حفظ كملف Log</span>
          </button>

          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 disabled:opacity-50 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1 border border-slate-700 hover:border-red-500/50"
            title="مسح سجل الطرفية"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Presets vs Terminal Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): ADB Command Presets Library */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>مكتبة أوامر التعريب الجاهزة (One-Click Presets)</span>
            </h3>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition font-medium ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Command Cards */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900/80 transition-all cursor-pointer space-y-1.5 group text-right"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition">
                      {preset.title}
                    </span>
                    {preset.requiresRoot ? (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded font-semibold">
                        يتطلب روت
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                        آمن (No Root)
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-[10px] text-emerald-400/90 bg-slate-900 p-1.5 rounded border border-slate-800/80 truncate" dir="ltr">
                    {preset.command}
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal">
                    {preset.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Terminal Screen & Command Input */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono shadow-2xl flex flex-col h-[560px]">
            
            {/* Terminal Window Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="mr-2 text-slate-400 text-[11px]">adb-shell@{device.model.toLowerCase().replace(/\s+/g, '-')}:~#</span>
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active</span>
              </div>
            </div>

            {/* Terminal Output Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-1.5 text-xs pr-1 scrollbar-thin scrollbar-thumb-slate-800" dir="ltr">
              {logs.length === 0 ? (
                <div className="text-slate-600 text-xs py-8 text-center" dir="rtl">
                  الطرفية جاهزة. اكتب أي أمر ADB أو اختر من المكتبة السريعة على اليمين.
                </div>
              ) : (
                logs.map((log) => {
                  let colorClass = 'text-slate-300';
                  if (log.type === 'cmd') colorClass = 'text-emerald-400 font-bold';
                  if (log.type === 'success') colorClass = 'text-teal-300';
                  if (log.type === 'error') colorClass = 'text-red-400';
                  if (log.type === 'info') colorClass = 'text-cyan-300';

                  return (
                    <div key={log.id} className="leading-relaxed flex items-start gap-2">
                      <span className="text-slate-600 text-[10px] shrink-0 select-none">
                        [{log.timestamp}]
                      </span>
                      <span className={`${colorClass} break-all select-text`}>
                        {log.text}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Command Input Bar */}
            <form onSubmit={handleFormSubmit} className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-xs shrink-0 select-none">$</span>
              <input
                type="text"
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                placeholder="أدخل أمر ADB... مثل: adb shell pm list packages"
                className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder:text-slate-600 font-mono"
                dir="ltr"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>تنفيذ</span>
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
};
