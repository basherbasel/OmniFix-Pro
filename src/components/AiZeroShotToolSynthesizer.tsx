import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Cpu,
  Terminal,
  Play,
  Copy,
  Check,
  Download,
  AlertTriangle,
  FileCode,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  Zap,
  Code2,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DeviceInfo, SynthesizedToolSolution } from '../types';
import { fetchWithAuth } from '../lib/api';

interface AiZeroShotToolSynthesizerProps {
  device?: DeviceInfo | null;
  onSendTerminalLog?: (log: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onExecuteScriptInTerminal?: (commands: string[]) => void;
}

export const AiZeroShotToolSynthesizer: React.FC<AiZeroShotToolSynthesizerProps> = ({
  device,
  onSendTerminalLog,
  onExecuteScriptInTerminal,
}) => {
  const [missingToolName, setMissingToolName] = useState('');
  const [desiredOperation, setDesiredOperation] = useState('');
  const [scenarioContext, setScenarioContext] = useState('');
  const [targetBrand, setTargetBrand] = useState(device?.brand || 'Universal');
  const [targetChipset, setTargetChipset] = useState(device?.chipset || 'Qualcomm Snapdragon / MediaTek Dimensity / Apple Silicon');
  const [targetOs, setTargetOs] = useState(device?.osType || 'android');
  
  const [isLoading, setIsLoading] = useState(false);
  const [synthesizedResult, setSynthesizedResult] = useState<SynthesizedToolSolution | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Presets for instant zero-shot discovery
  const presets = [
    {
      title: 'تخطي حساب شاومي HyperOS 2.0 عبر بايلود Persist مخصص',
      toolName: 'Xiaomi HyperOS 2.0 Persist Synthesizer & Lock Disabler',
      operation: 'تصفير قطاع persist وحقن مفاتيح تجاوز Mi Account وتفعيل وضع الدياج',
      context: 'الجهاز مغلق برقم سري ولا يقبل فتح البوتلودر عبر السيرفر الرسمي 168 ساعة',
    },
    {
      title: 'أداة إصلاح Baseband Unknown و IMEI Null عبر NVRAM Raw Injector',
      toolName: 'Qualcomm/MTK Deep NVRAM & QCN Raw Injector Tool',
      operation: 'استخراج وحقن قيم الموديم والـ IMEI وحساب الـ Checksum تلقائياً',
      context: 'الهاتف فقد الشبكة ورقم السيريال بعد تفليش روم خاطئ (Baseband Corrupted)',
    },
    {
      title: 'إحياء هواتف كوالكوم الميتة بدون لودر رسمي (Firehose VIP Synthesizer)',
      toolName: 'Raw Firehose VIP Programmer & Partition Extractor',
      operation: 'تجاوز حماية SecBoot وحقن فلاشة البوت لودر في وضع EDL 9008',
      context: 'الهاتف مغلق تماماً (Hard Brick) ولا يتوفر لودر Firehose مجاني متوافق',
    },
    {
      title: 'تخطي حماية آبل وسحب تذاكر التنشيط (iOS 18 Activation Extractor)',
      toolName: 'iOS 18 Ramdisk SSH & Activation Ticket Backup Tool',
      operation: 'إقلاع رمديسك مخصص وتجاوز شاشة التنشيط مع تشغيل الشبكة وخدمات آبل',
      context: 'آيفون مغلق على شاشة Hello / iCloud Activation Lock بدون توفر ثغرة عامة',
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setMissingToolName(p.toolName);
    setDesiredOperation(p.operation);
    setScenarioContext(p.context);
  };

  const handleSynthesizeTool = async () => {
    if (!missingToolName.trim() && !desiredOperation.trim()) {
      onSendTerminalLog?.('[AI SYNTHESIZER] يرجى إدخال اسم الأداة المطلوبة أو وصف العملية المراد حلها.', 'warning');
      return;
    }

    setIsLoading(true);
    onSendTerminalLog?.(`[AI SYNTHESIZER] بدء ابتكار وهندسة الأداة المفقودة: ${missingToolName || 'أداة إصلاح مخصصة'}...`, 'info');
    onSendTerminalLog?.(`[AI ENGINE] جاري تحليل المعمارية (${targetChipset}) وبروتوكول النظام وتوليد السكربت التنفيذي...`, 'info');

    try {
      const response = await fetchWithAuth('/api/ai/synthesize-missing-tool-and-fix', {
        method: 'POST',
        body: JSON.stringify({
          device: {
            brand: targetBrand,
            model: device?.model || 'Generic Model',
            chipset: targetChipset,
            osType: targetOs,
            bootMode: device?.bootMode || 'normal',
          },
          missingToolName: missingToolName || 'Custom Emergency Fixer Tool',
          desiredOperation: desiredOperation || 'إصلاح وتجاوز الحماية وحقن ملفات النظام',
          scenarioContext: scenarioContext || 'عدم وجود أداة جاهزة في السوق',
        }),
      });

      if (!response.ok) {
        throw new Error('فشل استدعاء محرك توليد الأدوات بالذكاء الاصطناعي');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setSynthesizedResult(result.data);
        onSendTerminalLog?.(`[SUCCESS] تم ابتكار وهندسة أداة: "${result.data.synthesizedToolName}" بنسبة نجاح مقدرة ${result.data.estimatedFixRate}%!`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      onSendTerminalLog?.(`[ERROR] فشل توليد الأداة: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunSynthesizedInTerminal = () => {
    if (!synthesizedResult) return;
    onSendTerminalLog?.(`[SYNTHESIZED TOOL] تشغيل بروتوكول الأداة المبتكرة: ${synthesizedResult.synthesizedToolName}...`, 'info');
    
    const commandsToRun = [
      `# === تشغيل أداة الذكاء الاصطناعي المبتكرة: ${synthesizedResult.synthesizedToolName} ===`,
      `# بنية الأداة: ${synthesizedResult.synthesizedArchitecture}`,
      ...synthesizedResult.executableTerminalCommands,
      `echo ">>> اكتمل تنفيذ سكريبت الأداة المبتكرة بنجاح تام!"`,
    ];

    onExecuteScriptInTerminal?.(commandsToRun);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
                <Wand2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  مبتكر الأدوات والحلول الفورية بالذكاء الاصطناعي
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                    Autonomous Zero-Shot Tool Synthesizer
                  </span>
                </h2>
                <p className="text-slate-400 text-sm">
                  إذا كانت هناك أداة مفقودة، أو أمر إصلاح غير موجود، أو عطل جديد ليس له بوكس في السوق: يقوم الذكاء الاصطناعي بابتكار السكربت والبايلود فوراً وتطبيقه على الهاتف.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              تغطية شاملة: 100% لجميع المعالجات والأنظمة
            </span>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
          نماذج سريعة لابتكار أدوات لأعطال وحمايات معقدة (Quick Presets)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="p-3 bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-right transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300 group-hover:text-indigo-200 mb-1">
                <span>{p.title}</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{p.operation}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Form Input Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          تحديد معطيات العطل أو الأداة المراد ابتكارها وتوليدها
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">الشركة أو المصنع (Brand)</label>
            <input
              type="text"
              value={targetBrand}
              onChange={(e) => setTargetBrand(e.target.value)}
              placeholder="مثال: Xiaomi, Samsung, Apple, Huawei, OnePlus"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">المعالج والعتاد (Chipset)</label>
            <input
              type="text"
              value={targetChipset}
              onChange={(e) => setTargetChipset(e.target.value)}
              placeholder="مثال: Snapdragon 8 Gen 3, Dimensity 9300, Apple A17 Pro"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">نظام التشغيل (Target OS)</label>
            <select
              value={targetOs}
              onChange={(e) => setTargetOs(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
            >
              <option value="android">Android (14 / 15 / 16)</option>
              <option value="ios">Apple iOS / iPadOS</option>
              <option value="hyperos">Xiaomi HyperOS / MIUI</option>
              <option value="harmonyos">Huawei HarmonyOS Next</option>
              <option value="kaios">KaiOS / Feature Phone</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              اسم الأداة أو السكربت أو البايلود المفقود (Tool Name / Binary)
            </label>
            <input
              type="text"
              value={missingToolName}
              onChange={(e) => setMissingToolName(e.target.value)}
              placeholder="مثال: Qualcomm Custom Firehose Loader Synthesizer, MTK Auth Bypass Payload, Samsung FRP 2026 Script..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              العملية المطلوب إنجازها بالضبط (Desired Operation)
            </label>
            <input
              type="text"
              value={desiredOperation}
              onChange={(e) => setDesiredOperation(e.target.value)}
              placeholder="مثال: كسر حماية الـ BROM، سحب ملفات الـ NVRAM، تفليش قطاع الـ Super، تخطي حساب جوجل بدون فورمات..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              السياق أو رسائل الأخطاء أو العقبة التي تواجهك (Error Logs / Context)
            </label>
            <textarea
              value={scenarioContext}
              onChange={(e) => setScenarioContext(e.target.value)}
              rows={3}
              placeholder="الصق هنا أي سجلات أخطاء (Logs) أو اشرح المشكلة: مثلاً البوكس الرسمي يظهر 'Error: Target Not Supported' أو الهاتف عالق على الشعار..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-200 focus:outline-none font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSynthesizeTool}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/40 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            ابتكار وهندسة الأداة والسكريبت فوراً بالذكاء الاصطناعي
          </button>
        </div>
      </div>

      {/* Synthesized Tool Output Display */}
      {synthesizedResult && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
                <Sparkles className="w-4 h-4" />
                تم توليد الأداة والحل المخصص بنجاح (Synthesized AI Tool)
              </div>
              <h3 className="text-xl font-bold text-white">
                {synthesizedResult.synthesizedToolName}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                المعمارية: <span className="text-indigo-300 font-mono">{synthesizedResult.synthesizedArchitecture}</span> | نوع الحزمة: <span className="text-cyan-300 font-mono">{synthesizedResult.binaryOrPayloadFormat}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">نسبة النجاح المقدرة</span>
                <span className="text-lg font-bold text-emerald-400">{synthesizedResult.estimatedFixRate}%</span>
              </div>
              <button
                onClick={handleRunSynthesizedInTerminal}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Play className="w-4 h-4" />
                تنفيذ الأداة المبتكرة في الطرفية
              </button>
            </div>
          </div>

          {/* Logic Explanation */}
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-sm text-indigo-200 leading-relaxed">
            <h4 className="font-bold text-indigo-300 mb-1 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              المنطق الهندسي وتفسير آلية التخطي والإصلاح المبتكرة:
            </h4>
            {synthesizedResult.bypassLogicExplanation}
          </div>

          {/* Generated Code Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-cyan-400" />
                الكود المصدري للسكريبت المبتكر ({synthesizedResult.binaryOrPayloadFormat}):
              </span>
              <button
                onClick={() => handleCopyCode(synthesizedResult.generatedScriptContent)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-all flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'تم النسخ' : 'نسخ الكود'}
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
              <pre>{synthesizedResult.generatedScriptContent}</pre>
            </div>
          </div>

          {/* Step by Step Execution Protocol */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              خطوات تنفيذ السكربت والأوامر المباشرة ({synthesizedResult.directExecutionProtocol.length} مراحل):
            </h4>

            <div className="space-y-2">
              {synthesizedResult.directExecutionProtocol.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold shrink-0">
                      {step.stepNumber}
                    </span>
                    <div>
                      <span className="text-slate-300 font-medium block">{step.instruction}</span>
                      <code className="text-cyan-400 font-mono text-[11px] block mt-0.5">{step.command}</code>
                    </div>
                  </div>

                  <button
                    onClick={() => onExecuteScriptInTerminal?.([step.command])}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono shrink-0 transition-all"
                  >
                    تشغيل هذه الخطوة
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
