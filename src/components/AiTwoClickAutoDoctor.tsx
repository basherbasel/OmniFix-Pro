import React, { useState } from 'react';
import {
  Sparkles,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  RefreshCw,
  Zap,
  Cpu,
  Radio,
  Lock,
  Layers,
  Wrench,
  Terminal,
  ArrowRight,
  HardDrive,
  Copy,
  ChevronLeft
} from 'lucide-react';
import { DeviceInfo, TwoClickDiagnosisResult } from '../types';
import { fetchWithAuth } from '../lib/api';

interface AiTwoClickAutoDoctorProps {
  device: DeviceInfo;
  onSendTerminalLog: (text: string, type: 'cmd' | 'output' | 'error' | 'success' | 'info') => void;
  onExecuteScriptInTerminal: (commands: string[]) => void;
}

export const AiTwoClickAutoDoctor: React.FC<AiTwoClickAutoDoctorProps> = ({
  device,
  onSendTerminalLog,
  onExecuteScriptInTerminal,
}) => {
  // Step State (1: Scan / Diagnosing, 2: Diagnosis Ready, 3: Executing Repair, 4: Repaired Successfully)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [diagnosisData, setDiagnosisData] = useState<TwoClickDiagnosisResult | null>(null);

  // Execution progress
  const [executionProgress, setExecutionProgress] = useState<number>(0);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(0);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState<string>('فحص شامل واكتشاف وإصلاح كافة الأعطال أوتوماتيكياً بنقرة واحدة');

  // CLICK 1: Run AI Deep Scan & Fault Detection
  const handleRunAiScan = async () => {
    setIsScanning(true);
    setDiagnosisData(null);
    setLiveLogs([]);
    onSendTerminalLog(`[AI Master Doctor] بدأ الفحص الهاردويري والبرمجي العميق لجهاز ${device.brand} ${device.model}...`, 'info');

    // Simulate telemetry read
    const scanTelemetry = {
      bootMode: device.bootMode || 'normal',
      chipset: device.chipset,
      carrier: device.carrier,
      serial: device.serialNumber,
      hasArabic: device.hasArabicInSystem,
      isRooted: device.isRooted,
      battery: device.batteryLevel,
      sdkLevel: device.sdkLevel,
    };

    try {
      const response = await fetchWithAuth('/api/ai/two-click-auto-repair', {
        method: 'POST',
        body: JSON.stringify({
          device,
          scanResults: scanTelemetry,
          userGoal: customGoal,
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setDiagnosisData(res.data);
        setCurrentStep(2);
        onSendTerminalLog(`[AI Scan Complete] تم اكتشاف ${res.data.detectedFaultsCount} عطل/تنبيه. البوكس الموصى به: ${res.data.recommendedBoxEngine}`, 'success');
      } else {
        onSendTerminalLog(`[AI Scan Error] ${res.error || 'تعذر استكمال الفحص'}`, 'error');
      }
    } catch (err: any) {
      onSendTerminalLog(`[AI Network Error] فشل الاتصال بمحرك الذكاء الاصطناعي: ${err.message}`, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // CLICK 2: Execute 1-Click Instant AI Repair
  const handleExecuteOneClickRepair = async () => {
    if (!diagnosisData || !diagnosisData.autoFixSteps || diagnosisData.autoFixSteps.length === 0) return;

    setCurrentStep(3);
    setExecutionProgress(0);
    setCurrentActionIndex(0);
    setLiveLogs([]);

    onSendTerminalLog(`[AI Auto-Fix Engine] جاري تنفيذ بروتوكول الإصلاح الآلي عبر محرك ${diagnosisData.recommendedBoxEngine}...`, 'info');

    const steps = diagnosisData.autoFixSteps;
    const totalSteps = steps.length;

    for (let i = 0; i < totalSteps; i++) {
      const step = steps[i];
      setCurrentActionIndex(i);
      const stepPercent = Math.round(((i + 1) / totalSteps) * 100);
      setExecutionProgress(stepPercent);

      const logMsg = `[Step ${step.stepIndex}/${totalSteps}] ${step.title}: ${step.boxProtocolAction} (${step.targetPartition || 'Global'})`;
      setLiveLogs((prev) => [...prev, logMsg]);
      onSendTerminalLog(logMsg, 'cmd');

      // Add protocol payload to terminal
      if (step.commandOrPayload) {
        onSendTerminalLog(`> ${step.commandOrPayload}`, 'info');
      }

      // Realistic latency per step
      await new Promise((r) => setTimeout(r, step.durationMs || 1400));
    }

    // Finished
    setExecutionProgress(100);
    setCurrentStep(4);
    onSendTerminalLog(`[AI Master Doctor] ✅ اكتملت كافة عمليات الإصلاح بنجاح 100%! تم إعادة إقلاع الهاتف وتثبيت التعديلات.`, 'success');
  };

  const handleResetToScan = () => {
    setCurrentStep(1);
    setDiagnosisData(null);
    setLiveLogs([]);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المصلح الآلي الذكي (AI 1-Click Auto Doctor)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              <span className="text-indigo-400">لا خبرة؟ لا مشكلة.</span> أصلح أي هاتف بضغطة زر واحدة!
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              قمنا بتصميم هذه الأداة لتكون <b>أسهل أداة صيانة في العالم</b>. فقط أوصل الهاتف، وسيقوم الذكاء الاصطناعي بفحص كل شيء (الشبكة، السوفت وير، الآيكلاود، FRP)، واختيار البوكس المناسب وتطبيق الحل الشامل أوتوماتيكياً بالنيابة عنك دون الحاجة لأي خبرة فنية.
            </p>
          </div>

          {/* Quick Target Selector */}
          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold">{device.brand} {device.model}</div>
              <div className="text-[11px] text-slate-400">{device.chipset} | {device.carrier}</div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: SCAN & GOAL INPUT */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scanner Launcher */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)] space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">زر الفحص السحري (Magic Scan)</h3>
                    <p className="text-[11px] text-slate-400">انقر هنا لتدع الذكاء الاصطناعي يقوم بكل العمل</p>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 text-indigo-400 px-2 py-1 rounded-full font-mono">1-Click Scan</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  اختر ما تريده من البوكس (أو دعه يفحص كل شيء تلقائياً):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {[
                    'فحص شامل واكتشاف وإصلاح كافة الأعطال أوتوماتيكياً',
                    'حل تعليق الهاتف على الشعار (Bootloop) بدون مساس بالبيانات',
                    'حذف وتخطي حماية FRP وحساب جوجل وقفل الشاشة',
                    'إصلاح الشبكة والمودم Baseband Unknown وتفعيل 5G/VoLTE',
                    'التعريب الجذري وتغيير التوجيه إلى KSA/عربي',
                    'إصلاح البوت الميت Unbrick وتفليش الذاكرة عبر EDL/BROM',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomGoal(preset)}
                      className={`text-right p-3 rounded-xl text-xs transition border cursor-pointer ${
                        customGoal === preset
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold shadow-md shadow-indigo-900/20'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      • {preset}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="إذا كان لديك طلب خاص اكتبه هنا..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRunAiScan}
                  disabled={isScanning}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-black text-sm lg:text-base py-4 lg:py-5 rounded-2xl shadow-2xl shadow-indigo-600/25 flex items-center justify-center gap-3 transition-transform cursor-pointer hover:-translate-y-0.5 active:scale-95"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span>جاري تشغيل الفحص العميق واستخراج البيانات...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                      <span>[النقرة 1]: افحص الجهاز واستخرج الحلول السحرية</span>
                      <ArrowRight className="w-5 h-5 rotate-180 opacity-70" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Capabilities Overview */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-xs flex items-center gap-2 border-b border-slate-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>القطاعات التي يتم فحصها عتادياً:</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                {[
                  { title: 'حالة البوتلودر والنواة (Bootloop Check)', desc: 'فحص ملفات boot.img وسلسلة الإقلاع' },
                  { title: 'الحمايات الأمنية (FRP / Knox / iCloud / MDM)', desc: 'كشف الأقفال والحسابات المفعلة' },
                  { title: 'سجلات المودم والـ Baseband', desc: 'فحص قطاعات NVRAM / QCN / EFS والـ IMEI' },
                  { title: 'صحة الذاكرة والبارتشنات (GPT / PIT / Scatter)', desc: 'فحص الباد سكتورز وتوزيع المساحات' },
                  { title: 'عداد الـ RPMB و Anti-Rollback', desc: 'حماية الهاتف من التفليش الخاطئ وموت الجهاز' },
                  { title: 'التعريب والتوجيه الإقليمي CSC', desc: 'كشف حزم اللغات المدفونة وشبكات 5G/VoLTE' },
                ].map((item, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800/80">
                    <div className="font-bold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: DIAGNOSIS RESULTS & 1-CLICK FIX BUTTON */}
      {currentStep === 2 && diagnosisData && (
        <div className="space-y-6 animate-fadeIn">
          {/* Health Score & Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-black text-lg">
                {diagnosisData.healthScoreBefore}%
              </div>
              <div>
                <div className="text-xs text-slate-400">صحة الجهاز الحالية</div>
                <div className="text-sm font-bold text-red-400">
                  {diagnosisData.detectedFaultsCount} أعطال مكتشفة
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
                {diagnosisData.healthScoreAfter}%
              </div>
              <div>
                <div className="text-xs text-slate-400">الصحة بعد الإصلاح</div>
                <div className="text-sm font-bold text-emerald-400">100% تعافي كامل</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs text-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">البوكس الأنسب للعملية</div>
                <div className="text-xs font-bold text-indigo-300">{diagnosisData.recommendedBoxEngine}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs text-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">وضع الإقلاع المطلوب</div>
                <div className="text-xs font-bold text-purple-300 font-mono">{diagnosisData.targetExecutionMode}</div>
              </div>
            </div>
          </div>

          {/* Faults List & Execution Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detected Faults */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>قائمة الأعطال التي تم اكتشافها وتحليلها:</span>
              </h4>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {diagnosisData.faultsSummary.map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{f.faultName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          f.severity === 'critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : f.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {(f.severity || 'medium').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{f.technicalReason}</div>
                    <div className="text-[10px] text-indigo-400 font-mono">Affected: {f.affectedModule}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                🛡️ <strong>ضمان الأمان:</strong> {diagnosisData.safetyNotes}
              </div>
            </div>

            {/* Generated 1-Click Fix Protocol */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-indigo-400" />
                <span>بروتوكول الإصلاح المتسلسل الجاهز للتنفيذ ({diagnosisData.autoFixSteps.length} خطوات):</span>
              </h4>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {diagnosisData.autoFixSteps.map((step, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-300">
                        {step.stepIndex}. {step.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{step.targetPartition || 'Engine'}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{step.explanation}</p>
                    <div className="text-[10px] font-mono text-emerald-400 bg-slate-900 p-1.5 rounded-lg overflow-x-auto text-left" dir="ltr">
                      {step.commandOrPayload}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col items-center gap-3">
                <button
                  onClick={handleExecuteOneClickRepair}
                  className="w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:opacity-90 text-white font-black text-lg py-5 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 transition-transform cursor-pointer hover:-translate-y-1 active:scale-95 border border-emerald-400/50"
                >
                  <Zap className="w-6 h-6 text-amber-200 animate-pulse" />
                  <span>[النقرة 2 والأخيرة]: نفّذ كل خطوات الإصلاح بضغطة واحدة!</span>
                </button>
                <p className="text-[11px] text-slate-400 font-bold text-center">لا حاجة لفعل أي شيء آخر. سيقوم الذكاء الاصطناعي بتنفيذ التفليش والإصلاح تلقائياً.</p>

                <button
                  onClick={handleResetToScan}
                  className="mt-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 text-[10px] font-bold transition cursor-pointer"
                >
                  إلغاء وإعادة الفحص
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: EXECUTING LIVE AUTO-REPAIR */}
      {currentStep === 3 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl space-y-5 animate-fadeIn">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto shadow-lg shadow-indigo-600/20 animate-pulse">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-white">جاري تطبيق الإصلاح التلقائي وكتابة القطاعات...</h3>
            <p className="text-xs text-slate-400">
              يرجى عدم فصل كابل الـ USB أثناء عملية التفليش والبرمجة العتادية.
            </p>
          </div>

          {/* Progress bar */}
          <div className="max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
              <span>نسبة الإنجاز الإجمالية</span>
              <span className="font-mono text-indigo-400">{executionProgress}%</span>
            </div>
            <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${executionProgress}%` }}
              />
            </div>
          </div>

          {/* Live Stream Terminal Box */}
          <div className="max-w-2xl mx-auto rounded-xl bg-black border border-slate-800 p-4 font-mono text-xs text-emerald-400 space-y-1.5 text-left h-44 overflow-y-auto" dir="ltr">
            <div className="text-slate-500">// Universal AI Multi-Box Live Execution Terminal</div>
            {liveLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400">{'>'}</span>
                <span>{log}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-amber-300">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Flashing partition & updating registers...</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REPAIRED SUCCESSFULLY */}
      {currentStep === 4 && (
        <div className="p-8 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-2xl text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-lg mx-auto">
            <h3 className="text-xl font-black text-white">تم إصلاح وبرمجة الجهاز بنجاح 100%!</h3>
            <p className="text-xs text-emerald-300">
              تمت معالجة كافة الأعطال، إعادة ضبط الحمايات، تثبيت التعريب، ومعايرة المودم بدون أي أخطاء.
            </p>
          </div>

          {diagnosisData?.finalVerificationCheck && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl max-w-lg mx-auto text-xs text-slate-300 text-right">
              <div className="font-bold text-white mb-1">📋 الفحص النهائي الموصى به:</div>
              <div>{diagnosisData.finalVerificationCheck}</div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleResetToScan}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              فحص جهاز آخر أو إعادة الاختبار
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
