import React, { useState } from 'react';
import {
  Wrench,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Terminal,
  Sparkles,
  Bot,
  Zap,
  RefreshCw,
  HelpCircle,
  Copy,
  ChevronDown,
  Layers,
  Cpu,
  Smartphone
} from 'lucide-react';
import { DeviceInfo, UniversalKnownFault, AnyFaultAiSolution } from '../types';
import { ALL_KNOWN_FAULTS_ENCYCLOPEDIA } from '../data/allKnownFaultsEncyclopedia';
import { fetchWithAuth } from '../lib/api';

interface UniversalFaultsEncyclopediaProps {
  device: DeviceInfo;
  onSendTerminalLog: (text: string, type: 'cmd' | 'output' | 'error' | 'success' | 'info') => void;
  onExecuteScriptInTerminal: (commands: string[]) => void;
}

export const UniversalFaultsEncyclopedia: React.FC<UniversalFaultsEncyclopediaProps> = ({
  device,
  onSendTerminalLog,
  onExecuteScriptInTerminal,
}) => {
  const [activeOsFilter, setActiveOsFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFault, setSelectedFault] = useState<UniversalKnownFault | null>(null);

  // Custom AI Solver State
  const [customFaultDesc, setCustomFaultDesc] = useState<string>('');
  const [customErrorLogs, setCustomErrorLogs] = useState<string>('');
  const [isSolvingCustom, setIsSolvingCustom] = useState<boolean>(false);
  const [aiSolution, setAiSolution] = useState<AnyFaultAiSolution | null>(null);
  const [isExecutingProtocol, setIsExecutingProtocol] = useState<boolean>(false);

  const filteredFaults = ALL_KNOWN_FAULTS_ENCYCLOPEDIA.filter((flt) => {
    const matchesOs =
      activeOsFilter === 'All' ||
      flt.osScope === 'All Systems' ||
      flt.osScope === activeOsFilter;
    const matchesSearch =
      searchQuery === '' ||
      flt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flt.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flt.affectedBrands.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
      flt.rootCause.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOs && matchesSearch;
  });

  const handleExecuteKnownFault = (fault: UniversalKnownFault) => {
    onSendTerminalLog(`[Fault Matrix] بدء تطبيق البروتوكول الحاسم لعطل: ${fault.title}`, 'info');
    onSendTerminalLog(`[Recommended Tool: ${fault.recommendedTool}]`, 'cmd');
    fault.directProtocolSolution.forEach((step) => {
      onSendTerminalLog(`> ${step}`, 'output');
    });
    onExecuteScriptInTerminal(fault.directProtocolSolution);
  };

  const handleSolveCustomFaultWithAi = async () => {
    if (!customFaultDesc.trim()) return;

    setIsSolvingCustom(true);
    setAiSolution(null);
    onSendTerminalLog(`[AI Universal Solver] إرسال بيانات العطل إلى محرك الذكاء الاصطناعي الشامل للتحليل الهندسي...`, 'info');

    try {
      const res = await fetchWithAuth('/api/ai/universal-any-fault-solver', {
        method: 'POST',
        body: JSON.stringify({
          device,
          faultDescription: customFaultDesc,
          rawLogsOrErrorCode: customErrorLogs,
          targetOs: device.osType,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiSolution(json.data);
        onSendTerminalLog(`[AI Solver Success] تم التوصل للسبب الجذري وصياغة خطة الإصلاح الشاملة`, 'success');
      } else {
        throw new Error(json.error || 'فشل توليد الحل بالذكاء الاصطناعي');
      }
    } catch (err: any) {
      console.error(err);
      onSendTerminalLog(`[AI Solver Error] ${err.message}`, 'error');
    } finally {
      setIsSolvingCustom(false);
    }
  };

  const handleExecuteAiCustomProtocol = async () => {
    if (!aiSolution) return;
    setIsExecutingProtocol(true);
    onSendTerminalLog(`[AI Custom Protocol] بدء تنفيذ خطوات الإصلاح المخصصة...`, 'info');

    const cmds = aiSolution.stepByStepProtocol.map((s) => s.directCommandOrPayload);
    for (let i = 0; i < aiSolution.stepByStepProtocol.length; i++) {
      const step = aiSolution.stepByStepProtocol[i];
      await new Promise((r) => setTimeout(r, 1000));
      onSendTerminalLog(`[Step ${step.stepNumber}] ${step.title}: ${step.directCommandOrPayload}`, 'cmd');
      onSendTerminalLog(`  -> ${step.actionDescription}`, 'output');
    }

    await new Promise((r) => setTimeout(r, 600));
    onSendTerminalLog(`[Protocol Complete] تم تنفيذ خطة الإصلاح بنجاح! نسبة النجاح المتوقعة: ${aiSolution.estimatedSuccessRate}%`, 'success');
    setIsExecutingProtocol(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/60 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
              <Wrench className="w-3.5 h-3.5" />
              <span>موسوعة كافة الأعطال الشاملة (Universal Faults & Any-Issue Solver)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              تشخيص وحل أي عطل في أي هاتف محمول وعلى أي نظام تشغيل
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              قاعدة بيانات موثقة لجميع أعطال البوتلوب، انهيار كوالكوم، فقدان السيريال والبيسباند، أخطاء الآيفون 1110/4013، ومحرك الذكاء الاصطناعي لحل أي عطل مخصص فوراً.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="text-right">
              <div className="text-white font-bold">{device.brand} {device.model}</div>
              <div className="text-emerald-400 font-mono text-[11px]">OS: {(device.osType || 'android').toUpperCase()} {device.androidVersion}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Custom Any-Fault Solver Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">محرك الذكاء الاصطناعي لحل أي عطل مخصص (AI Any-Fault Engine)</h3>
              <p className="text-[11px] text-slate-400">صف أي مشكلة يواجهها الهاتف أو الصق سجلات الأخطاء وسيقوم الذكاء الاصطناعي بإنشاء بروتوكول الإصلاح فوراً</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Universal Solver
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">وصف العطل أو الأعراض التي تظهر على الهاتف:</label>
            <input
              type="text"
              value={customFaultDesc}
              onChange={(e) => setCustomFaultDesc(e.target.value)}
              placeholder="مثال: الهاتف يعيد التشغيل عند ظهور الشعار، أو Baseband غير معروف بعد تحديث هوائي..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">رمز الخطأ أو سجلات الأخطاء (اختياري):</label>
            <input
              type="text"
              value={customErrorLogs}
              onChange={(e) => setCustomErrorLogs(e.target.value)}
              placeholder="مثال: Error 4013 أو SW REV CHECK FAIL أو Sahara Handshake Failed..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
            />
          </div>
        </div>

        <button
          onClick={handleSolveCustomFaultWithAi}
          disabled={isSolvingCustom || !customFaultDesc.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/20"
        >
          {isSolvingCustom ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>جاري التحليل الهندسي واستنباط بروتوكول الإصلاح بالذكاء الاصطناعي...</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              <span>تحليل المشكلة وتوليد بروتوكول الإصلاح الحاسم فوراً</span>
            </>
          )}
        </button>

        {/* AI Solution View */}
        {aiSolution && (
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">النتيجة: {aiSolution.faultClassification}</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">نسبة النجاح المتوقعة: {aiSolution.estimatedSuccessRate}%</span>
            </div>

            <div className="text-xs text-slate-300">
              <strong className="text-indigo-300">السبب الجذري للمشكلة: </strong>
              {aiSolution.rootCauseAnalysis}
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400">خطوات البروتوكول المنفذة:</div>
              <div className="space-y-1.5 font-mono text-xs">
                {aiSolution.stepByStepProtocol.map((step) => (
                  <div key={step.stepNumber} className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">
                      #{step.stepNumber}
                    </span>
                    <div className="flex-1">
                      <div className="text-slate-200 font-bold">{step.title}</div>
                      <div className="text-cyan-400 text-[11px] mt-0.5">{step.directCommandOrPayload}</div>
                      <div className="text-slate-400 text-[10px]">{step.actionDescription}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleExecuteAiCustomProtocol}
              disabled={isExecutingProtocol}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isExecutingProtocol ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري تطبيق سكريبت الإصلاح عبر المنفذ...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>تطبيق خطة الإصلاح على الهاتف الآن</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar for Known Faults */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Android', 'iOS', 'HarmonyOS', 'KaiOS'].map((os) => (
            <button
              key={os}
              onClick={() => setActiveOsFilter(os)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeOsFilter === os
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {os === 'All' ? 'كافة الأنظمة' : os}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الأعطال وحلولها..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {/* Known Faults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFaults.map((flt) => (
          <div
            key={flt.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {flt.osScope}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">{flt.title}</h3>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    flt.dangerLevel === 'Safe'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : flt.dangerLevel === 'Moderate'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {flt.dangerLevel}
                </span>
              </div>

              <div className="text-xs text-slate-300">
                <span className="text-slate-500">الأعراض: </span>
                {flt.symptoms}
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] space-y-1">
                <div className="text-slate-400">
                  <strong className="text-cyan-300">السبب الهندسي: </strong>
                  {flt.rootCause}
                </div>
                <div className="text-slate-400">
                  <strong className="text-indigo-300">الأجهزة الشائعة: </strong>
                  {flt.affectedBrands.join(', ')}
                </div>
              </div>

              {/* Protocol Steps */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-400">بروتوكول الحل القاطع:</div>
                <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside pr-1">
                  {flt.directProtocolSolution.map((s, idx) => (
                    <li key={idx} className="font-mono text-[10px] text-cyan-300/90">{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono">الأداة: {flt.recommendedTool}</span>
              <button
                onClick={() => handleExecuteKnownFault(flt)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-cyan-600/20"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>تنفيذ بروتوكول الإصلاح الآن</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
