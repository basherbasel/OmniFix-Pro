import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ChevronRight, 
  Layers, 
  AlertTriangle, 
  RefreshCw,
  Terminal,
  Zap,
  RotateCcw
} from 'lucide-react';
import { DeviceInfo, DiagnosisResult } from '../types';
import { fetchWithAuth } from '../lib/api';

interface AiDiagnosisRoadmapProps {
  device: DeviceInfo;
  onExecuteScriptInTerminal: (commands: string[]) => void;
}

export const AiDiagnosisRoadmap: React.FC<AiDiagnosisRoadmapProps> = ({
  device,
  onExecuteScriptInTerminal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedFullScript, setCopiedFullScript] = useState(false);

  const handleRunAiDiagnosis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth('/api/ai/diagnose-device', {
        method: 'POST',
        body: JSON.stringify({
          brand: device.brand,
          model: device.model,
          androidVersion: device.androidVersion,
          chipset: device.chipset,
          carrier: device.carrier,
          buildNumber: device.buildNumber,
          isRooted: device.isRooted,
          bootloaderUnlocked: device.bootloaderUnlocked,
          currentLanguage: device.currentLocale,
          problemDescription: device.notes,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setDiagnosis(data.data);
      } else {
        setError(data.error || 'فشل في تشخيص الجهاز بالذكاء الاصطناعي');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (typeof index === 'number') {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedFullScript(true);
      setTimeout(() => setCopiedFullScript(false), 2000);
    }
  };

  const downloadBatScript = () => {
    if (!diagnosis || !diagnosis.adbScriptCommands) return;
    const batContent = `@echo off
chcp 65001 > nul
title Android Arabization Studio AI - ${device.model}
color 0A
echo ========================================================
echo   Android Arabization Studio AI - Automated Script
echo   Device: ${device.brand} ${device.model}
echo   Carrier: ${device.carrier}
echo ========================================================
echo.
echo [1/3] Checking ADB connection...
adb wait-for-device
echo Connection OK!
echo.
echo [2/3] Executing Arabization Commands...
${diagnosis.adbScriptCommands.map((cmd) => `echo Running: ${cmd}\n${cmd}`).join('\n')}
echo.
echo [3/3] Arabization process completed successfully!
pause
`;

    const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arabize_${device.brand}_${device.model.replace(/\s+/g, '_')}.bat`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> محرك التحليل وخريطة الطريق الشاملة (AI Roadmap Engine)
          </div>
          <h2 className="text-xl font-bold text-white">
            تشخيص هندسي متقدم لتعريب <span className="text-purple-400">{device.brand} {device.model}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            يستخدم نموذج Gemini AI المتقدم لتحليل المعالج ({device.chipset})، وتوجيه المشغل الأمريكي/الآسيوي ({device.carrier})، وإصدار النظام لإنشاء أفضل استراتيجية تعريب بدون أخطاء.
          </p>
        </div>

        <button
          onClick={handleRunAiDiagnosis}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-xl shadow-purple-600/30 flex items-center gap-2 transition active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'جاري التحليل بالذكاء الاصطناعي...' : 'بدء التحليل والتوليد الذكي'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-2xl text-red-300 text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Initial Empty State */}
      {!diagnosis && !isLoading && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-white">لم يتم إجراء تشخيص بالذكاء الاصطناعي بعد</h3>
            <p className="text-xs text-slate-400">
              اضغط على زر "بدء التحليل والتوليد الذكي" بالأعلى لتحليل هاتف {device.model} وإنشاء خطة تعريب مخصصة مع أوامر ADB جاهزة.
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto"></div>
          <div className="text-sm font-bold text-purple-300">الذكاء الاصطناعي يقوم بفحص مصفوفة الأمان والمشغل...</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            تحليل معمارية المعالج ونظام One UI / HyperOS والتحقق من قيود شركات الاتصالات...
          </p>
        </div>
      )}

      {/* Diagnosis Results */}
      {diagnosis && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Summary & Difficulty Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:col-span-2 space-y-2">
              <div className="text-xs font-semibold text-purple-400">ملخص تشخيص الجهاز وإمكانية التعريب</div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {diagnosis.deviceSummary}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">أفضل طريقة موصى بها:</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
                  {diagnosis.bestMethod}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-semibold text-slate-400">مستوى الصعوبة المتوقع</div>
              <div className="text-lg font-bold text-purple-300">
                {diagnosis.arabizationDifficulty}
              </div>
              <div className="text-[11px] text-slate-400">
                الخطوط الموصى بها:
                <div className="flex flex-wrap gap-1 mt-1">
                  {diagnosis.fontRecommendations.map((f, i) => (
                    <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Methods List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>طرق التعريب المتاحة لهذا الجهاز ({diagnosis.methods.length})</span>
            </h3>

            <div className="space-y-4">
              {diagnosis.methods.map((method, mIdx) => (
                <div 
                  key={mIdx}
                  className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                        {mIdx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{method.title}</h4>
                        <span className="text-[11px] text-slate-400">{method.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> {method.estimatedTime}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        method.requiresRoot 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {method.requiresRoot ? 'يتطلب روت' : 'بدون روت (آمن)'}
                      </span>
                      <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        نسبة النجاح: {method.successRate}%
                      </span>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2 pt-2 border-t border-slate-850">
                    {method.steps.map((step) => (
                      <div key={step.stepNumber} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-200">
                          <span className="font-semibold text-emerald-400">
                            الخطوة {step.stepNumber}: {step.instruction}
                          </span>
                        </div>
                        {step.command && (
                          <div className="mt-1 flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px] text-emerald-300">
                            <span className="truncate">{step.command}</span>
                            <button
                              onClick={() => copyToClipboard(step.command!)}
                              className="p-1 hover:text-white text-slate-400 rounded shrink-0 ml-2"
                              title="نسخ الأمر"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        {step.explanation && (
                          <p className="text-[11px] text-slate-400 pt-0.5">{step.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Direct ADB Execution Batch Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>سكريبت أوامر ADB المباشرة القابلة للتنفيذ</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تم توليد {diagnosis.adbScriptCommands.length} أوامر مخصصة لهذا الموديل بالتحديد
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onExecuteScriptInTerminal(diagnosis.adbScriptCommands)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>تشغيل في الطرفية (Terminal)</span>
                </button>

                <button
                  onClick={downloadBatScript}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل ملف Windows (.bat)</span>
                </button>

                <button
                  onClick={() => copyToClipboard(diagnosis.adbScriptCommands.join('\n'))}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5 border border-slate-700"
                >
                  {copiedFullScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFullScript ? 'تم النسخ' : 'نسخ الكل'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto space-y-1">
              {diagnosis.adbScriptCommands.map((cmd, idx) => (
                <div key={idx} className="flex items-center justify-between hover:bg-slate-900/60 px-2 py-1 rounded">
                  <span>{cmd}</span>
                  <button
                    onClick={() => copyToClipboard(cmd, idx)}
                    className="text-slate-500 hover:text-slate-300 p-1"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings & Rollback Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Warnings */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>تحذيرات وإرشادات السلامة (Safety Warnings)</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-200/90 list-disc list-inside">
                {diagnosis.warnings.map((w, idx) => (
                  <li key={idx} className="leading-relaxed">{w}</li>
                ))}
              </ul>
            </div>

            {/* Rollback Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span>خطة التراجع والاستعادة (Rollback & Recovery)</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {diagnosis.rollbackPlan.map((r, idx) => (
                  <li key={idx} className="leading-relaxed">{r}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
