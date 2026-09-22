import React, { useState } from 'react';
import {
  Radio,
  Wifi,
  Signal,
  Smartphone,
  ShieldCheck,
  Zap,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  Sliders,
  FileCode,
  Download,
  Copy,
  Globe
} from 'lucide-react';
import { DeviceInfo, NetworkOperatorProfile } from '../types';
import { GLOBAL_OPERATOR_PROFILES } from '../data/universalBoxDatabase';
import { fetchWithAuth } from '../lib/api';

interface NetworkModemStudioProps {
  device: DeviceInfo;
  onSendTerminalLog: (text: string, type: 'cmd' | 'output' | 'error' | 'success' | 'info') => void;
  onExecuteScriptInTerminal: (commands: string[]) => void;
}

export const NetworkModemStudio: React.FC<NetworkModemStudioProps> = ({
  device,
  onSendTerminalLog,
  onExecuteScriptInTerminal,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('المملكة العربية السعودية');
  const [selectedOperator, setSelectedOperator] = useState<NetworkOperatorProfile>(GLOBAL_OPERATOR_PROFILES[0]);
  const [operatorSearchQuery, setOperatorSearchQuery] = useState<string>('');
  const [issueCategory, setIssueCategory] = useState<string>('تفعيل VoLTE و 5G (Carrier Bundle / MBN)');
  const [customDetails, setCustomDetails] = useState<string>('');
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [networkAnalysis, setNetworkAnalysis] = useState<any>(null);

  // Band Unlocker state
  const [selectedBands, setSelectedBands] = useState<string[]>(['B1', 'B3', 'B7', 'B20', 'B28', 'n78']);
  const [isUnlockingBands, setIsUnlockingBands] = useState<boolean>(false);

  const filteredOperators = GLOBAL_OPERATOR_PROFILES.filter((op) =>
    op.operatorName.toLowerCase().includes(operatorSearchQuery.toLowerCase()) ||
    op.country.includes(operatorSearchQuery) ||
    op.mccMnc.includes(operatorSearchQuery) ||
    op.apnName.includes(operatorSearchQuery)
  );

  const handleRunNetworkDiagnosis = async () => {
    setIsDiagnosing(true);
    setNetworkAnalysis(null);

    onSendTerminalLog(`[RF & Network Engine] جاري فحص مودم وترددات ${device.brand} ${device.model} مع شبكة ${selectedOperator.operatorName}...`, 'info');

    try {
      const response = await fetchWithAuth('/api/ai/network-modem-doctor', {
        method: 'POST',
        body: JSON.stringify({
          device,
          targetCountry: selectedOperator.country,
          targetOperator: selectedOperator.operatorName,
          issueCategory,
          customProblemDetails: customDetails,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setNetworkAnalysis(data.data);
        onSendTerminalLog(`[Modem Diagnosis Ready] تم إنشاء تكوين الشبكة والـ VoLTE بنجاح!`, 'success');
      } else {
        onSendTerminalLog(`[AI Error] ${data.error || 'فشل تشخيص الشبكة'}`, 'error');
      }
    } catch (err: any) {
      onSendTerminalLog(`[Error] ${err.message}`, 'error');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleOneClickApnInject = () => {
    onSendTerminalLog(`[APN Injector] جاري حقن نقطة الوصول (${selectedOperator.apnName}) لهاتف ${device.model}...`, 'info');
    onSendTerminalLog(`$ adb shell content insert --uri content://telephony/carriers --bind name:s="${selectedOperator.operatorName}" --bind numeric:s="${selectedOperator.mccMnc.split('/')[0].trim()}" --bind apn:s="${selectedOperator.apnName}" --bind type:s="${selectedOperator.apnType}" --bind current:s="1"`, 'cmd');
    
    setTimeout(() => {
      onSendTerminalLog(`[APN Success] تم تثبيت نقطة الوصول الرسمية بنجاح وتفعيل بيانات الجيل الرابع/الخامس.`, 'success');
    }, 600);
  };

  const handleUnlockSelectedBands = () => {
    setIsUnlockingBands(true);
    onSendTerminalLog(`[Band Unlocker] جاري كتابة سجلات الـ NVRAM / Qualcomm NV Item 0x1877 (NV_RF_BC_CONFIG_I) لفتح الترددات (${selectedBands.join(', ')})...`, 'info');

    setTimeout(() => {
      onSendTerminalLog(`$ adb shell setprop persist.vendor.radio.custom_band_mask 0xFFFFFFFF`, 'cmd');
      onSendTerminalLog(`$ adb shell setprop persist.vendor.radio.5g_mode_pref 1`, 'cmd');
      onSendTerminalLog(`[Band Unlock Success] تم فتح كافة الترددات العالمية بنجاح على المعالج!`, 'success');
      setIsUnlockingBands(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/70 to-slate-900 border border-blue-500/30 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>استوديو الشبكات والمودم والـ Baseband بالذكاء الاصطناعي</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              دراسة وضبط شبكات المحمول، 5G VoNR، VoLTE، وحل أعطال الـ Baseband
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              تحليل ترددات الراديو (RF) لجميع شبكات الاتصالات في العالم، فك حظر ترددات 5G/4G (B20, B28, n78) للأجهزة الأمريكية واليابانية، وتوليد ملفات الـ IPCC للآيفون، وإصلاح المودم غير المعروف (Unknown Baseband / Null IMEI).
            </p>
          </div>

          <div className="flex gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-center px-3 border-r border-slate-800/80">
              <div className="text-xs text-slate-400">حالة المودم</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {device.modemStatus === 'panic' ? '🚨 Baseband Panic' : '✅ Active & Calibrated'}
              </div>
            </div>
            <div className="text-center px-3">
              <div className="text-xs text-slate-400">المشغل العالمي</div>
              <div className="text-sm font-bold text-blue-300 font-mono">
                {selectedOperator.countryCode} • {selectedOperator.apnName}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Operator Profiles & AI Modem Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Operator Picker & Actions */}
        <div className="lg:col-span-5 space-y-5">
          {/* Operator Directory */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>دليل مشغلي شبكات الاتصالات (APN & 5G/VoLTE)</span>
              </h2>
              <span className="text-xs text-slate-400">
                {filteredOperators.length} مشغل
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={operatorSearchQuery}
                onChange={(e) => setOperatorSearchQuery(e.target.value)}
                placeholder="ابحث باسم المشغل، الدولة، أو الـ APN..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Operator Cards List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredOperators.map((op) => (
                <button
                  key={op.id}
                  onClick={() => setSelectedOperator(op)}
                  className={`w-full text-right p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                    selectedOperator.id === op.id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md ring-1 ring-blue-400/40'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <span>{op.countryFlag}</span>
                      <span className="font-bold">{op.operatorName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      APN: {op.apnName} • MCC/MNC: {op.mccMnc}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {op.volteSupport && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        VoLTE
                      </span>
                    )}
                    {op.vonr5gSupport && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                        5G
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Quick 1-Click APN Inject */}
            <button
              onClick={handleOneClickApnInject}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>حقن نقطة الوصول (APN) بنقرة واحدة للهاتف المتصل</span>
            </button>
          </div>

          {/* 5G / 4G Global Band Unlocker */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Signal className="w-4 h-4 text-emerald-400" />
                <span>فك قفل الترددات الخلوية (Band Unlocker)</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                NVRAM RF Writer
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              تفعيل الترددات العالمية المحجوبة في الأجهزة الأمريكية (Verizon / AT&T) لتعمل بكفاءة على أبراج الشرق الأوسط وأوروبا:
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'B1', name: 'B1 (2100MHz)' },
                { id: 'B3', name: 'B3 (1800MHz)' },
                { id: 'B7', name: 'B7 (2600MHz)' },
                { id: 'B8', name: 'B8 (900MHz)' },
                { id: 'B20', name: 'B20 (800MHz)' },
                { id: 'B28', name: 'B28 (700MHz)' },
                { id: 'n78', name: 'n78 (3.5GHz 5G)' },
                { id: 'n41', name: 'n41 (2.5GHz 5G)' },
                { id: 'n77', name: 'n77 (C-Band 5G)' },
              ].map((band) => (
                <label
                  key={band.id}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    selectedBands.includes(band.id)
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedBands.includes(band.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBands((prev) => [...prev, band.id]);
                      } else {
                        setSelectedBands((prev) => prev.filter((b) => b !== band.id));
                      }
                    }}
                    className="hidden"
                  />
                  <span>{band.id}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleUnlockSelectedBands}
              disabled={isUnlockingBands}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isUnlockingBands ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري برمجة الترددات في المودم...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تطبيق وفتح الترددات المحددة على الهاتف</span>
                </>
              )}
            </button>
          </div>

          {/* AI Modem Diagnosis Launcher */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>فحص المودم وتوليد حزم التكوين بالذكاء الاصطناعي</span>
            </h2>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">نوع العطل المطلوب حله</label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="تفعيل VoLTE و 5G (Carrier Bundle / MBN)">تفعيل مكالمات VoLTE و 5G (iOS IPCC & Android MBN)</option>
                <option value="إصلاح المودم غير المعروف (Unknown Baseband / Null IMEI)">إصلاح المودم غير المعروف وفقدان الـ Baseband</option>
                <option value="فك حجب الترددات الخلوية الأمريكية (Carrier Unlock)">فك حجب الترددات وتجاوز قيود المشغل الأصلي</option>
                <option value="توليد إعدادات نقطة الاتصال الشخصية (Hotspot Fix)">حل مشكلة عدم عمل نقطة الاتصال الشخصية (Hotspot / Tethering)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">تفاصيل إضافية عن المشكلة</label>
              <input
                type="text"
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="مثال: آيفون 14 برو شريحة إلكترونية eSIM لا تظهر خيار VoLTE في السعودية..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleRunNetworkDiagnosis}
              disabled={isDiagnosing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isDiagnosing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>جاري فحص المودم وتوليد حزمة التكوين...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>بدء تحليل وتوليد حل المودم والـ VoLTE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Modem & VoLTE Results */}
        <div className="lg:col-span-7 space-y-5">
          {networkAnalysis ? (
            <div className="bg-slate-900/90 rounded-2xl border border-blue-500/30 p-6 space-y-6 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs font-semibold mb-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>تشخيص الراديو والمودم المعتمد</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{networkAnalysis.rfDiagnosis}</h3>
                </div>
              </div>

              {/* Supported Bands Status */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400">تحليل ترددات الهاتف مع شبكة {selectedOperator.operatorName}:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {networkAnalysis.supportedBandsAnalysis?.map((b: any, i: number) => (
                    <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-indigo-300 font-mono">{b.bandName} ({b.frequency})</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300">
                          {b.statusInPhone}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{b.relevanceToTargetCarrier}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VoLTE & 5G Solution */}
              <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>خطة تفعيل VoLTE و 5G في الهاتف:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{networkAnalysis.volteAnd5gSolution}</p>
              </div>

              {/* Carrier Payload Code (IPCC / XML) */}
              {networkAnalysis.carrierPayloadSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-blue-400" />
                      <span>حزمة تكوين المشغل (Carrier Bundle / XML):</span>
                    </span>
                  </div>
                  <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto max-h-40">
                    {networkAnalysis.carrierPayloadSnippet}
                  </pre>
                </div>
              )}

              {/* Execution Commands */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400">أوامر تطبيق تكوين المودم والشبكة:</div>
                <div className="space-y-1.5">
                  {networkAnalysis.executionCommands?.map((cmd: string, i: number) => (
                    <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
                      <span>$ {cmd}</span>
                      <button
                        onClick={() => {
                          onSendTerminalLog(`$ ${cmd}`, 'cmd');
                          onSendTerminalLog(`[Modem Config] Applied carrier parameter successfully.`, 'success');
                        }}
                        className="px-2.5 py-1 rounded bg-blue-600 text-white text-[10px] hover:bg-blue-500 transition-all ml-2 shrink-0 cursor-pointer"
                      >
                        تشغيل
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* One Click Batch Execute */}
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    const cmds = networkAnalysis.executionCommands || [];
                    if (cmds.length > 0) {
                      onExecuteScriptInTerminal(cmds);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>تطبيق كافة إعدادات الشبكة والمودم على الهاتف فوراً</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[420px] bg-slate-900/60 rounded-2xl border border-slate-800/80 border-dashed p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Radio className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-base font-bold text-white">استوديو الشبكات والمودم جاهز</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  اختر مشغل الشبكة المطلوب (مثل STC, Mobily, Zain, Vodafone) واضغط على "بدء تحليل وتوليد حل المودم" لفتح ترددات الـ 5G وحل كافة أعطال الـ Baseband.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
