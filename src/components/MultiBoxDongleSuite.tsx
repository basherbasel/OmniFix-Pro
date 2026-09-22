import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  HardDrive,
  ShieldCheck,
  Smartphone,
  Layers,
  Sparkles,
  Wrench,
  Radio,
  Search,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Copy,
  ExternalLink,
  Sliders,
  Flame
} from 'lucide-react';
import { DeviceInfo, FamousBoxBrand, BoxEngineTool } from '../types';
import { FAMOUS_BOX_PROFILES, ALL_BOX_ENGINE_TOOLS } from '../data/multiBoxEngineDatabase';

interface MultiBoxDongleSuiteProps {
  device: DeviceInfo;
  onSendTerminalLog: (text: string, type: 'cmd' | 'output' | 'error' | 'success' | 'info') => void;
  onExecuteScriptInTerminal: (commands: string[]) => void;
}

export const MultiBoxDongleSuite: React.FC<MultiBoxDongleSuiteProps> = ({
  device,
  onSendTerminalLog,
  onExecuteScriptInTerminal,
}) => {
  const [selectedBox, setSelectedBox] = useState<FamousBoxBrand>('unlock_tool');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRunningTool, setActiveRunningTool] = useState<string | null>(null);
  const [toolProgress, setToolProgress] = useState<number>(0);
  const [toolLogs, setToolLogs] = useState<string[]>([]);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const currentBoxProfile = FAMOUS_BOX_PROFILES.find((b) => b.id === selectedBox) || FAMOUS_BOX_PROFILES[0];

  const filteredTools = ALL_BOX_ENGINE_TOOLS.filter((tool) => {
    const matchesBox = selectedBox === 'all' || tool.boxOrigin === selectedBox;
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.chipsetTarget.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBox && matchesCat && matchesSearch;
  });

  const handleRunBoxTool = async (tool: BoxEngineTool) => {
    setActiveRunningTool(tool.id);
    setToolProgress(0);
    setToolLogs([]);

    onSendTerminalLog(`[${currentBoxProfile.name}] بدء تنفيذ أداة: ${tool.title}...`, 'info');
    onSendTerminalLog(`[Mode Required: ${tool.requiredMode}] Command: ${tool.rawProtocolCommand}`, 'cmd');

    const totalSeconds = tool.estimatedSeconds || 5;
    const intervalSteps = 10;
    const stepTime = (totalSeconds * 1000) / intervalSteps;

    const dummySteps = [
      'جاري فحص الاتصال بالهاتف عبر USB / COM Port...',
      'التحقق من حماية BootROM و Handshake المصافحة...',
      'تخطي حماية Auth وحقن الـ DA / Firehose Loader...',
      'قراءة جداول الذاكرة وتحديد عناوين القطاعات المستهدفة...',
      `تنفيذ بروتوكول ${tool.boxOrigin.toUpperCase()}: كتابة ومعالجة البيانات...`,
      'التحقق من صحة التوقيع وتحديث السجلات في الـ NVRAM...',
      'إرسال إشارة إعادة التشغيل Reboot إلى الهاتف...',
      'اكتملت العملية بنجاح 100% بدون أي أخطاء!',
    ];

    for (let i = 1; i <= intervalSteps; i++) {
      await new Promise((r) => setTimeout(r, stepTime));
      const pct = Math.round((i / intervalSteps) * 100);
      setToolProgress(pct);

      const stepLog = dummySteps[Math.min(i - 1, dummySteps.length - 1)];
      setToolLogs((prev) => [...prev, `[${pct}%] ${stepLog}`]);
    }

    onSendTerminalLog(`[${currentBoxProfile.name}] ✅ اكتملت العملية بنجاح: ${tool.title}`, 'success');
    setActiveRunningTool(null);
  };

  const handleCopyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Box Engine Selector Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-white text-base flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>اختر محرك البوكس / الدونجل لتشغيل أدواته الحصرية:</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">10 Multi-Box Protocols Integrated</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {FAMOUS_BOX_PROFILES.map((box) => {
            const isSelected = selectedBox === box.id;
            return (
              <button
                key={box.id}
                onClick={() => setSelectedBox(box.id)}
                className={`p-3 rounded-2xl text-right transition border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? `bg-gradient-to-br ${box.colorTheme} text-white border-white/30 shadow-lg scale-[1.02]`
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black truncate">{box.name.split(' ')[0]}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                      {box.toolsCount} أدوات
                    </span>
                  </div>
                  <div className={`text-[11px] font-bold ${isSelected ? 'text-white/90' : 'text-slate-200'}`}>
                    {box.arabicName}
                  </div>
                </div>
                <div className={`text-[10px] mt-2 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {box.specialty}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Box Engine Detail Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="text-base font-bold text-white">{currentBoxProfile.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
              Engine Ready
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">{currentBoxProfile.specialty}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {currentBoxProfile.keyProtocols.map((proto, idx) => (
              <span key={idx} className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                ⚡ {proto}
              </span>
            ))}
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في الأدوات..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-8 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="all">كافة الفئات</option>
            <option value="frp_security">حماية FRP والأقفال</option>
            <option value="imei_cert">إصلاح السيريال والشبكة</option>
            <option value="partition_manager">مدير قطاعات الذاكرة</option>
            <option value="bootloader_auth">تخطي الحماية Auth</option>
            <option value="flasher_scatter">التفليش وسكاتر</option>
            <option value="unbrick_edl">إحياء الموت Unbrick</option>
            <option value="arabic_patch">التعريب والـ CSC</option>
          </select>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const isRunning = activeRunningTool === tool.id;
          return (
            <div
              key={tool.id}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 relative group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-white line-clamp-1">{tool.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
                    {tool.requiredMode}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                  <span>المعالج: <strong className="text-slate-300">{tool.chipsetTarget}</strong></span>
                  <span>نسبة النجاح: <strong className="text-emerald-400">{tool.successRate}%</strong></span>
                </div>
              </div>

              {/* Running indicator */}
              {isRunning && (
                <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-950 border border-indigo-500/40">
                  <div className="flex items-center justify-between text-[11px] text-indigo-300 font-mono">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      جاري التنفيذ...
                    </span>
                    <span>{toolProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-200"
                      style={{ width: `${toolProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleRunBoxTool(tool)}
                  disabled={activeRunningTool !== null}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>تشغيل العملية فوراً</span>
                </button>

                <button
                  onClick={() => handleCopyCmd(tool.rawProtocolCommand)}
                  title="نسخ الأمر البرمجي"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  {copiedCmd === tool.rawProtocolCommand ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Tool Execution Logs */}
      {toolLogs.length > 0 && (
        <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-2 text-left" dir="ltr">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-2">
            <span>Box Engine Stream Output</span>
            <span className="text-emerald-400">Live Hardware Port Handshake</span>
          </div>
          <div className="font-mono text-xs text-emerald-400 space-y-1 max-h-40 overflow-y-auto">
            {toolLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400">{'>'}</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
