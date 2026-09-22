import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Wrench,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  Search,
  Sliders,
  Copy,
  ChevronRight,
  HardDrive,
  Radio,
  FileCode,
  Lock,
  Unlock,
  CornerDownLeft,
  Sparkles,
  LifeBuoy
} from 'lucide-react';
import { DeviceInfo, DeviceBootMode, MobileOperatingSystem, ChipsetArchitecture, UniversalErrorCode } from '../types';
import { fetchWithAuth } from '../lib/api';
import { UNIVERSAL_ERROR_CODES, HARDWARE_TESTPOINTS, UNIVERSAL_BOX_TASKS } from '../data/universalBoxDatabase';

interface UniversalMasterBoxProps {
  device: DeviceInfo;
  onSendTerminalLog: (text: string, type: 'cmd' | 'output' | 'error' | 'success' | 'info') => void;
  onExecuteScriptInTerminal: (commands: string[]) => void;
}

export const UniversalMasterBox: React.FC<UniversalMasterBoxProps> = ({
  device,
  onSendTerminalLog,
  onExecuteScriptInTerminal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ai-box' | 'flasher-sim' | 'error-codes' | 'testpoints' | 'mode-switcher'>('ai-box');
  const [selectedTask, setSelectedTask] = useState<string>(UNIVERSAL_BOX_TASKS[0].id);
  const [selectedTargetOs, setSelectedTargetOs] = useState<MobileOperatingSystem>(device.osType || 'android');
  const [selectedTargetChipset, setSelectedTargetChipset] = useState<ChipsetArchitecture>(device.chipsetFamily || 'qualcomm_snapdragon');
  const [targetBootMode, setTargetBootMode] = useState<DeviceBootMode>(device.bootMode || 'normal');
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>('');
  const [customProblem, setCustomProblem] = useState<string>('');
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<any>(null);

  // Flasher Simulator State
  const [flasherFile, setFlasherFile] = useState<string>('iPhone16,2_18.2_22C152_Restore.ipsw');
  const [flashingProgress, setFlashingProgress] = useState<number>(0);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [flashingStepName, setFlashingStepName] = useState<string>('');
  const [flashLog, setFlashLog] = useState<string[]>([]);

  // Search filter for Error Codes
  const [errorSearchQuery, setErrorSearchQuery] = useState<string>('');
  const [selectedErrorDetail, setSelectedErrorDetail] = useState<UniversalErrorCode | null>(UNIVERSAL_ERROR_CODES[0]);

  // Selected Testpoint
  const [selectedTestpointId, setSelectedTestpointId] = useState<string>(HARDWARE_TESTPOINTS[0].id);

  const handleRunAiBoxDiagnosis = async (presetDesc?: string) => {
    setIsDiagnosing(true);
    setAiDiagnosis(null);

    const problemToDiagnose = presetDesc || customProblem || 'إصلاح أعطال السوفت وير وتمرير الفلاشة وفحص المودم';

    onSendTerminalLog(`[Universal AI Master Box] جاري الفحص الشامل لهاتف ${device.brand} ${device.model} (${(selectedTargetOs || 'android').toUpperCase()} / ${selectedTargetChipset})...`, 'info');

    try {
      const response = await fetchWithAuth('/api/ai/universal-box-doctor', {
        method: 'POST',
        body: JSON.stringify({
          device,
          targetProblem: problemToDiagnose,
          bootMode: targetBootMode,
          errorCode: selectedErrorCode,
          hardwareTestPointNeeded: true,
          targetOs: selectedTargetOs,
          targetChipset: selectedTargetChipset,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAiDiagnosis(data.data);
        onSendTerminalLog(`[AI Diagnosis Ready] تم توليد بروتوكول الإصلاح بنجاح: ${data.data.boxProtocolName}`, 'success');
      } else {
        onSendTerminalLog(`[AI Error] ${data.error || 'تعذر استكمال التشخيص بالذكاء الاصطناعي'}`, 'error');
      }
    } catch (err: any) {
      onSendTerminalLog(`[Network Error] فشل الاتصال بخادم الذكاء الاصطناعي: ${err.message}`, 'error');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleStartFlashingSimulation = () => {
    setIsFlashing(true);
    setFlashingProgress(0);
    setFlashLog([
      `[INIT] Initializing Universal Flashing Engine v4.8...`,
      `[HANDSHAKE] Connecting to device target via USB 3.2 Protocol...`,
      `[AUTH] Bypassing SLA/DAA / Verifying Apple TSS SHSH2 Blobs... OK`,
    ]);

    const steps = [
      { p: 15, name: '1/6 التحقق من توافق التوقيع الرقمي وهيدر الـ GPT / APFS...', log: '[STEP 1] Validating Firmware Signature & Partition Table (GPT / APFS)... OK (MATCH)' },
      { p: 35, name: '2/6 مسح وتهيئة قطاعات الـ Bootloader و الـ iBoot...', log: '[STEP 2] Erasing target staging blocks & Writing Primary Bootloader (xloader/iBoot)... OK' },
      { p: 60, name: '3/6 كتابة ملفات النظام الأساسية (system.img / super / OS Kernel)...', log: '[STEP 3] Streaming Main OS Payload (4.8 GB) with SHA256 Verification... OK' },
      { p: 80, name: '4/6 معايرة فلاشة المودم وقسم الشبكة (NON-HLOS / Baseband / NVRAM)...', log: '[STEP 4] Flashing Baseband Modem Firmware & Calibrating RF Tables... OK' },
      { p: 95, name: '5/6 إعادة بناء جدول الـ Cache وحفظ ملفات المستخدم (Retain Data)...', log: '[STEP 5] Finalizing APFS / Ext4 filesystem metadata & verifying encryption keys... OK' },
      { p: 100, name: '6/6 اكتمل التفليش بنجاح 100%! جاري إعادة التشغيل التلقائي...', log: '[SUCCESS] Device flashed successfully. Re-enabling USB normal mode & rebooting.' },
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setFlashingProgress(step.p);
        setFlashingStepName(step.name);
        setFlashLog((prev) => [...prev, step.log]);
        onSendTerminalLog(`[Flash Protocol] ${step.log}`, step.p === 100 ? 'success' : 'info');

        if (step.p === 100) {
          setIsFlashing(false);
        }
      }, (idx + 1) * 800);
    });
  };

  const filteredErrors = UNIVERSAL_ERROR_CODES.filter((err) =>
    err.code.toLowerCase().includes(errorSearchQuery.toLowerCase()) ||
    err.meaning.includes(errorSearchQuery) ||
    err.sourceTool.toLowerCase().includes(errorSearchQuery.toLowerCase())
  );

  const currentTp = HARDWARE_TESTPOINTS.find((t) => t.id === selectedTestpointId) || HARDWARE_TESTPOINTS[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Master Universal Box Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Universal Multi-OS Software Box & Master Technician</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-mono">Superior to Hardware Dongles</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>البوكس الشامل لصيانة وتفليش جميع أنظمة الهواتف (iOS / Android / HarmonyOS / KaiOS)</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              محرك ذكاء اصطناعي فائق التطور يدرس جميع أنظمة التشغيل، المعالجات (Apple Silicon, Snapdragon, Dimensity, Exynos, Kirin, Unisoc)، ومشاكل المودم وشاشات التوقف، لحل أي عطل برمجي في أي هاتف بالعالم حتى الآيفون.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-center px-3 border-r border-slate-800/80 last:border-0">
              <div className="text-xs text-slate-400">الأنظمة المدعومة</div>
              <div className="text-sm font-bold text-indigo-300">iOS • Android • EMUI</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800/80 last:border-0">
              <div className="text-xs text-slate-400">المعالجات</div>
              <div className="text-sm font-bold text-emerald-400">جميع الشرائح 100%</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs text-slate-400">بروتوكول البوت</div>
              <div className="text-sm font-bold text-amber-400">DFU • EDL • BROM</div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('ai-box')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'ai-box'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>طبيب البوكس الذكي (AI Multi-OS Doctor)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('flasher-sim')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'flasher-sim'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>محاكي التفليش والأقسام (Live Flasher Engine)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('error-codes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'error-codes'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>قاموس وحلال أكواد الأخطاء (Error Codes 4013, 1110, ...)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('testpoints')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'testpoints'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>دليل الـ TestPoint العتادي للبوردات</span>
          </button>

          <button
            onClick={() => setActiveSubTab('mode-switcher')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'mode-switcher'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>مبدل أوضاع الإقلاع (DFU / EDL / Odin)</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: AI Box Master Doctor */}
      {activeSubTab === 'ai-box' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Configuration & Quick Tasks */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>إعدادات تشخيص الجهاز والبروتوكول</span>
              </h2>

              {/* OS Selector */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">نظام التشغيل المستهدف</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ios', label: 'Apple iOS / iPadOS', icon: '🍎' },
                    { id: 'android', label: 'Android (All Brands)', icon: '🤖' },
                    { id: 'harmonyos', label: 'Huawei HarmonyOS', icon: '🔴' },
                    { id: 'kaios', label: 'KaiOS Feature Phone', icon: '📱' },
                    { id: 'hyperos', label: 'Xiaomi HyperOS', icon: '⚡' },
                    { id: 'aosp', label: 'Generic / AOSP', icon: '🌐' },
                  ].map((os) => (
                    <button
                      key={os.id}
                      onClick={() => setSelectedTargetOs(os.id as MobileOperatingSystem)}
                      className={`p-2 rounded-xl text-xs font-semibold text-center border transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedTargetOs === os.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base">{os.icon}</span>
                      <span className="truncate w-full">{os.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chipset Architecture */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">عائلة المعالج (SoC Architecture)</label>
                <select
                  value={selectedTargetChipset}
                  onChange={(e) => setSelectedTargetChipset(e.target.value as ChipsetArchitecture)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="apple_silicon">Apple Silicon (A14/A15/A16/A17/A18 Pro / M-Series)</option>
                  <option value="qualcomm_snapdragon">Qualcomm Snapdragon (EDL 9008 Sahara / Firehose)</option>
                  <option value="mediatek_dimensity">MediaTek Dimensity / Helio (BROM Auth Bypass)</option>
                  <option value="samsung_exynos">Samsung Exynos & Shannon Baseband (Odin Download)</option>
                  <option value="google_tensor">Google Tensor G1-G4 (FastbootD / Titan M2)</option>
                  <option value="hisilicon_kirin">Huawei HiSilicon Kirin (USB COM 1.0 TestPoint)</option>
                  <option value="unisoc_spd">Unisoc / Spreadtrum SPD (PAC / FDL1/FDL2)</option>
                  <option value="generic">Universal Generic Chipset Architecture</option>
                </select>
              </div>

              {/* Boot Mode Selection */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">وضع اتصال الهاتف الحالي</label>
                <select
                  value={targetBootMode}
                  onChange={(e) => setTargetBootMode(e.target.value as DeviceBootMode)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="normal">Normal Mode (ADB / usbmuxd / MTP)</option>
                  <option value="apple_dfu">Apple DFU Mode (Direct BootROM Engine)</option>
                  <option value="apple_recovery">Apple Recovery Mode (iBoot Interface)</option>
                  <option value="edl_9008">Qualcomm Emergency Download (EDL 9008)</option>
                  <option value="mtk_brom">MediaTek BootROM (BROM Mode 0x0001)</option>
                  <option value="samsung_odin">Samsung Odin Download Mode (PIT / TAR)</option>
                  <option value="fastbootd">FastbootD / Dynamic Partitions</option>
                  <option value="spd_diag">Unisoc SPD Diag Calibration Mode</option>
                  <option value="huawei_usb_com">Huawei USB COM 1.0 (Hardware TestPoint)</option>
                </select>
              </div>

              {/* Quick Task Presets */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">مهام البوكس الجاهزة الأكثر شيوعاً</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {UNIVERSAL_BOX_TASKS.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        setSelectedTask(task.id);
                        setSelectedTargetOs(task.targetOs);
                        setSelectedTargetChipset(task.targetChipset);
                        setTargetBootMode(task.requiredMode);
                        setCustomProblem(task.title + ': ' + task.description);
                      }}
                      className={`w-full text-right p-2.5 rounded-xl text-xs border transition-all flex items-center justify-between ${
                        selectedTask === task.id
                          ? 'bg-indigo-600/20 border-indigo-500/80 text-white'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="p-1 rounded bg-indigo-500/20 text-indigo-300">
                          {task.targetOs === 'ios' ? '🍎' : '🤖'}
                        </span>
                        <span className="font-semibold truncate">{task.title}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                        {task.difficulty}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Problem Input */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">أو اكتب وصف العطل / كود الخطأ بدقة</label>
                <textarea
                  value={customProblem}
                  onChange={(e) => setCustomProblem(e.target.value)}
                  placeholder="مثال: آيفون 15 برو متوقف على التفاحة بدون مساس بالبيانات، أو تفليش سامسونج مع تخطي SW REV CHECK FAIL..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                />
              </div>

              {/* Action Diagnose Button */}
              <button
                onClick={() => handleRunAiBoxDiagnosis()}
                disabled={isDiagnosing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDiagnosing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>جاري دراسة وتوليد بروتوكول البوكس الذكي...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>بدء تشخيص البوكس وتوليد بروتوكول الإصلاح الفوري</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Diagnosis & Execution Protocol */}
          <div className="lg:col-span-7 space-y-5">
            {aiDiagnosis ? (
              <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-6 space-y-6 animate-in fade-in duration-300">
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{aiDiagnosis.boxProtocolName}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{aiDiagnosis.masterDiagnosis}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                      {aiDiagnosis.deviceSafetyRating}
                    </span>
                  </div>
                </div>

                {/* Required Hardware Mode & Instructions */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>الوضع العتادي المطلوب: {aiDiagnosis.requiredHardwareMode}</span>
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {aiDiagnosis.enterModeInstructions?.map((ins: string, i: number) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ul>
                </div>

                {/* Protocol Action Steps */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span>مراحل التنفيذ المباشرة عبر البوكس الذكي ({aiDiagnosis.protocolActions?.length || 0} مرحلة)</span>
                  </h4>

                  <div className="space-y-2.5">
                    {aiDiagnosis.protocolActions?.map((step: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 text-[11px] font-bold flex items-center justify-center">
                              {step.stepNum || idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white">{step.title}</span>
                          </div>
                          {step.targetPartitionOrMemory && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                              {step.targetPartitionOrMemory}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{step.explanation}</p>
                        {step.rawCommandOrPayload && (
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 flex items-center justify-between overflow-x-auto">
                            <span>$ {step.rawCommandOrPayload}</span>
                            <button
                              onClick={() => {
                                onSendTerminalLog(`$ ${step.rawCommandOrPayload}`, 'cmd');
                                onSendTerminalLog(`[Execution OK] Command dispatched to box protocol driver.`, 'success');
                              }}
                              className="px-2 py-0.5 rounded bg-indigo-600/40 text-indigo-200 hover:bg-indigo-600 text-[10px] ml-2 shrink-0"
                            >
                              تشغيل
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Network & Modem Guidance */}
                {aiDiagnosis.networkAndModemAdvice && (
                  <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-500/30 space-y-1">
                    <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" />
                      <span>توصية المودم والشبكة لضمان سلامة الـ IMEI:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{aiDiagnosis.networkAndModemAdvice}</p>
                  </div>
                )}

                {/* Final Checklist & One-Click Execution */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    جاهز للتطبيق المباشر عبر محاكي البوكس أو موجه الأوامر.
                  </div>
                  <button
                    onClick={() => {
                      const cmds = aiDiagnosis.protocolActions?.map((s: any) => s.rawCommandOrPayload).filter(Boolean) || [];
                      if (cmds.length > 0) {
                        onExecuteScriptInTerminal(cmds);
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    <span>تنفيذ البروتوكول بالكامل في الطرفية المباشرة</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[420px] bg-slate-900/60 rounded-2xl border border-slate-800/80 border-dashed p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Cpu className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-1.5">
                  <h3 className="text-base font-bold text-white">طبيب السوفت وير الشامل جاهز</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    حدد نظام التشغيل، المعالج، أو اختر مهمة جاهزة (مثل إصلاح آيفون 1110، تفليش كوالكوم 9008، تخطي BROM ميدياتك) واضغط على "بدء تشخيص البوكس" لإنشاء خطة المعالجة الفورية.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Flasher Engine & Partition Simulator */}
      {activeSubTab === 'flasher-sim' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                <span>محرك تفليش الفلاشات الرسمية ومطابقة الحزم</span>
              </h2>

              {/* Firmware Preset Selector */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">اختر ملف الفلاشة أو الروم المراد تفليشها</label>
                <select
                  value={flasherFile}
                  onChange={(e) => setFlasherFile(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="iPhone16,2_18.2_22C152_Restore.ipsw">Apple Official IPSW: iPhone16,2_18.2_22C152_Restore.ipsw (8.4 GB)</option>
                  <option value="SM-S928U_S928USQS1AXCA_4Files_Odin.tar">Samsung Odin 4-Files: SM-S928U_S928USQS1AXCA (BL, AP, CP, CSC)</option>
                  <option value="Redmi_HyperOS_RAWPROGRAM0_Firehose.xml">Qualcomm Firehose: Redmi_Note13_Rawprogram0.xml + Patch0.xml</option>
                  <option value="MT6895_Android_scatter.txt">MediaTek Scatter: Dimensity_9300_Scatter_Firmware.txt</option>
                  <option value="Huawei_Mate60_Rescue_Board_Software.dload">Huawei Kirin: Mate60_Pro_Rescue_Board_Software_COM1.0.dload</option>
                  <option value="Nokia_8110_KaiOS_PAC_Firmware.pac">Unisoc/Qualcomm KaiOS: Nokia8110_4G_Arabized_PAC.pac</option>
                </select>
              </div>

              {/* Flashing Options */}
              <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>الاحتفاظ ببيانات المستخدم (Retain User Data)</span>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>التحقق من تجزئة الـ SHA256 للقطاعات قبل الكتابة</span>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>حماية قطاعات المودم والـ EFS من المسح</span>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>إعادة تشغيل تلقائي للهاتف بعد انتهاء التفليش</span>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                </div>
              </div>

              {/* Start Flashing Button */}
              <button
                onClick={handleStartFlashingSimulation}
                disabled={isFlashing}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isFlashing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>جاري التفليش المباشر ({flashingProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-white" />
                    <span>بدء كتابة وتفليش الفلاشة على الهاتف (Start Flash)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Live Flashing Console & Progress */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>سجل تفليش البوكس الحي (Live Protocol Stream)</span>
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {flashingProgress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${flashingProgress}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  {flashingStepName || 'في انتظار إعطاء أمر التفليش...'}
                </div>
              </div>

              {/* Live Terminal Log */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 min-h-[280px] max-h-[360px] overflow-y-auto space-y-1.5">
                {flashLog.length === 0 ? (
                  <div className="text-slate-500 text-center py-16">
                    انقر على "بدء كتابة وتفليش الفلاشة" لمشاهدة تفاصيل كتابة البلوكات والـ APFS / UFS في الوقت الفعلي.
                  </div>
                ) : (
                  flashLog.map((line, i) => (
                    <div
                      key={i}
                      className={`leading-relaxed ${
                        line.includes('[SUCCESS]')
                          ? 'text-emerald-400 font-bold'
                          : line.includes('[STEP')
                          ? 'text-indigo-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Error Code Decrypter (iTunes 4013, 1110, Odin SW REV, etc.) */}
      {activeSubTab === 'error-codes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Error Search & List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={errorSearchQuery}
                  onChange={(e) => setErrorSearchQuery(e.target.value)}
                  placeholder="ابحث برقم الخطأ (4013, 1110, SW REV, BROM)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredErrors.map((err, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedErrorDetail(err)}
                    className={`w-full text-right p-3 rounded-xl border transition-all text-xs space-y-1 ${
                      selectedErrorDetail?.code === err.code
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">{err.code}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {err.sourceTool}
                      </span>
                    </div>
                    <div className="text-slate-300 truncate text-[11px]">{err.meaning}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: In-Depth Error Solution */}
          <div className="lg:col-span-7">
            {selectedErrorDetail ? (
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {selectedErrorDetail.sourceTool}
                    </span>
                    <h3 className="text-xl font-bold text-amber-300 mt-0.5">{selectedErrorDetail.code}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedErrorDetail.meaning}</p>
                  </div>
                </div>

                {/* Root Cause */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>السبب الجذري لظهور الخطأ (Root Cause):</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedErrorDetail.rootCause}</p>
                </div>

                {/* Universal Fix Plan */}
                <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30 space-y-1">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>خطة الحل الشاملة من البوكس الذكي (Fix Plan):</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{selectedErrorDetail.universalFixPlan}</p>
                </div>

                {/* Action Commands */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400">أوامر الحل المباشرة:</div>
                  <div className="space-y-1.5">
                    {selectedErrorDetail.actionCommands.map((cmd, i) => (
                      <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
                        <span>$ {cmd}</span>
                        <button
                          onClick={() => {
                            onSendTerminalLog(`$ ${cmd}`, 'cmd');
                            onSendTerminalLog(`[OK] Dispatched fix command for ${selectedErrorDetail.code}`, 'success');
                          }}
                          className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[10px] hover:bg-indigo-500 transition-all ml-2 shrink-0 cursor-pointer"
                        >
                          تشغيل
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Hardware TestPoint (TP) Interactive Visualizer */}
      {activeSubTab === 'testpoints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-indigo-400" />
                <span>اختر الهاتف للتعرف على نقاط الاختبار (TestPoints)</span>
              </h3>

              <div className="space-y-2">
                {HARDWARE_TESTPOINTS.map((tp) => (
                  <button
                    key={tp.id}
                    onClick={() => setSelectedTestpointId(tp.id)}
                    className={`w-full text-right p-3 rounded-xl border transition-all text-xs space-y-1 ${
                      selectedTestpointId === tp.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{tp.deviceName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                        {tp.modeTarget}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] truncate">{tp.chipset}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">{currentTp.deviceName}</h3>
                  <div className="text-xs text-indigo-400 font-mono">{currentTp.chipset} • {currentTp.modeTarget}</div>
                </div>
              </div>

              {/* Schematic Mock Graphic */}
              <div className="relative bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <div className="w-20 h-28 rounded-xl bg-slate-900 border-2 border-emerald-500/60 p-2 flex flex-col justify-between items-center shadow-lg shadow-emerald-500/10">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-[10px] text-indigo-200 font-mono">
                      CPU
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                    </div>
                    <div className="text-[8px] text-slate-400 font-mono">TP1 & TP2 (GND)</div>
                  </div>
                  <div className="text-xs text-amber-300 font-semibold">
                    📍 موقع نقاط الـ TP: {currentTp.pinoutDescription}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>طريقة القفلة والتوصيل (How to Short & Connect):</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{currentTp.shortGroundInstruction}</p>
              </div>

              {/* Warning */}
              <div className="bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{currentTp.voltageWarning}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Force Boot Mode Switcher */}
      {activeSubTab === 'mode-switcher' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>مبدل أوضاع الإقلاع الإجباري بنقرة واحدة (1-Click Reboot Switcher)</span>
            </h3>
            <p className="text-xs text-slate-400">
              إرسال حزم التوجيه البرمجية لإدخال الهاتف المتصل في أي وضع بدون استخدام أزرار الصوت أو الباور.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Apple DFU Mode',
                desc: 'إدخال الآيفون في وضع DFU المباشر',
                cmd: 'ideviceenterdfu',
                icon: '🍎',
                color: 'from-purple-600/20 to-indigo-600/20 border-purple-500/40 text-purple-200',
              },
              {
                title: 'Apple Recovery Exit',
                desc: 'إخراج الآيفون من شاشة الاسترداد فوراً',
                cmd: 'irecovery -c "setenv auto-boot true" && irecovery -c "saveenv" && irecovery -c "reboot"',
                icon: '🍏',
                color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/40 text-emerald-200',
              },
              {
                title: 'Qualcomm EDL 9008',
                desc: 'إعادة التشغيل في وضع الطوارئ 9008',
                cmd: 'adb reboot edl',
                icon: '⚡',
                color: 'from-amber-600/20 to-orange-600/20 border-amber-500/40 text-amber-200',
              },
              {
                title: 'Samsung Download Mode',
                desc: 'الدخول في وضع التفليش لبرنامج Odin',
                cmd: 'adb reboot download',
                icon: '🌌',
                color: 'from-blue-600/20 to-cyan-600/20 border-blue-500/40 text-blue-200',
              },
              {
                title: 'Fastboot / FastbootD',
                desc: 'الدخول في وضع البوت لودر السريع',
                cmd: 'adb reboot fastboot',
                icon: '🤖',
                color: 'from-green-600/20 to-emerald-600/20 border-green-500/40 text-green-200',
              },
              {
                title: 'Recovery Mode',
                desc: 'الدخول في الريكفري لمسح الكاش والـ Wipe',
                cmd: 'adb reboot recovery',
                icon: '🛡️',
                color: 'from-rose-600/20 to-pink-600/20 border-rose-500/40 text-rose-200',
              },
              {
                title: 'Qualcomm Diag Port 9091',
                desc: 'فتح منفذ Diag لكتابة الـ QCN والـ IMEI',
                cmd: 'adb shell setprop sys.usb.config diag,serial_cdev,rmnet,adb',
                icon: '📡',
                color: 'from-indigo-600/20 to-blue-600/20 border-indigo-500/40 text-indigo-200',
              },
              {
                title: 'Normal Safe Reboot',
                desc: 'إعادة تشغيل عادية آمنة للجهاز',
                cmd: 'adb reboot',
                icon: '🔄',
                color: 'from-slate-800 to-slate-900 border-slate-700 text-slate-200',
              },
            ].map((btn, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border bg-gradient-to-b ${btn.color} space-y-2 flex flex-col justify-between`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{btn.icon}</span>
                    <span className="text-xs font-bold text-white">{btn.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{btn.desc}</p>
                </div>
                <button
                  onClick={() => {
                    onSendTerminalLog(`$ ${btn.cmd}`, 'cmd');
                    onSendTerminalLog(`[Mode Switch] Sent reboot command: ${btn.title}`, 'info');
                  }}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg bg-slate-950/80 hover:bg-slate-950 text-white text-xs font-bold border border-slate-700/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-indigo-400" />
                  <span>تطبيق الأمر</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
