import React, { useState } from 'react';
import { 
  Settings2, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  Code,
  Radio
} from 'lucide-react';
import { DeviceInfo, CscPatchResult } from '../types';
import { fetchWithAuth } from '../lib/api';

interface CscPatchStudioProps {
  device: DeviceInfo;
  onSendTerminalLog: (text: string, type: 'cmd' | 'output' | 'error' | 'success' | 'info') => void;
}

export const CscPatchStudio: React.FC<CscPatchStudioProps> = ({
  device,
  onSendTerminalLog,
}) => {
  const [targetRegion, setTargetRegion] = useState('KSA (المملكة العربية السعودية)');
  const [carrierCode, setCarrierCode] = useState('KSA');
  const [enableCallRecording, setEnableCallRecording] = useState(true);
  const [enableVoLteArab, setEnableVoLteArab] = useState(true);
  const [enableArabicKeyboard, setEnableArabicKeyboard] = useState(true);
  const [enableHijriCalendar, setEnableHijriCalendar] = useState(true);
  const [enableCameraMute, setEnableCameraMute] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [patchResult, setPatchResult] = useState<CscPatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const regionPresets = [
    { code: 'KSA', name: 'السعودية (KSA)' },
    { code: 'XSG', name: 'الإمارات (XSG)' },
    { code: 'EGY', name: 'مصر (EGY)' },
    { code: 'MID', name: 'العراق والشرق الأوسط (MID)' },
    { code: 'KOR/GLB', name: 'عالمي موحد (MEA Unified)' },
    { code: 'TUN', name: 'تونس (TUN)' },
    { code: 'ALG', name: 'الجزائر (ALG)' },
    { code: 'MOR', name: 'المغرب (MAT)' },
  ];

  const handleGenerateCsc = async () => {
    setIsLoading(true);
    setError(null);

    const enabledFeatures = [];
    if (enableCallRecording) enabledFeatures.push('تفعيل تسجيل المكالمات التلقائي Voice Call Recording');
    if (enableVoLteArab) enabledFeatures.push('تفعيل VoLTE و 5G للشبكات العربية STC, Mobily, Zain, Vodafone, Orange');
    if (enableArabicKeyboard) enabledFeatures.push('تعيين اللغة العربية كافتراضية في لوحة المفاتيح');
    if (enableHijriCalendar) enabledFeatures.push('تفعيل التقويم الهجري في شاشة القفل');
    if (enableCameraMute) enabledFeatures.push('إتاحة زر كتم صوت الكاميرا');

    try {
      const response = await fetchWithAuth('/api/ai/generate-csc-patch', {
        method: 'POST',
        body: JSON.stringify({
          brand: device.brand,
          targetRegion,
          carrierCode,
          enabledFeatures,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setPatchResult(data.data);
      } else {
        setError(data.error || 'فشل في توليد ملفات CSC');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyViaAdb = () => {
    if (!patchResult) return;
    onSendTerminalLog(`[CSC] جاري حقن ملفات CSC في المسار: ${patchResult.targetPathOnDevice}`, 'info');
    patchResult.installationCommands.forEach((cmd) => {
      onSendTerminalLog(`$ ${cmd}`, 'cmd');
    });
    onSendTerminalLog(`[CSC] تم تطبيق إعدادات CSC بنجاح. يلزم إعادة تشغيل الهاتف لتفعيل التعديلات.`, 'success');
  };

  const downloadCscXml = () => {
    if (!patchResult) return;
    const blob = new Blob([patchResult.cscXmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cscfeature.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Settings2 className="w-3.5 h-3.5" /> استوديو تخصيص ملفات CSC والشبكات (Samsung & Android CSC Studio)
          </div>
          <h2 className="text-xl font-bold text-white">
            تعديل كود المنطقة <span className="text-amber-400">CSC & OMC Features</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            تفعيل مميزات الدول العربية كتمكين تسجيل المكالمات المدمج بدون روت/بالروت، وضبط شبكات VoLTE و 5G لمشغلي الاتصالات في الشرق الأوسط وشمال أفريقيا.
          </p>
        </div>

        <button
          onClick={handleGenerateCsc}
          disabled={isLoading}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 transition active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'جاري التوليد بالذكاء الاصطناعي...' : 'توليد حزمة CSC الذكية'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-2xl text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Region & Toggles */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>اختيار كود المنطقة العربية (CSC Sales Code)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {regionPresets.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => {
                    setCarrierCode(r.code);
                    setTargetRegion(r.name);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition text-right ${
                    carrierCode === r.code
                      ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Features Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>الميزات والخصائص المضمنة بالحزمة</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition">
                <input
                  type="checkbox"
                  checked={enableCallRecording}
                  onChange={(e) => setEnableCallRecording(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800 w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-slate-200">تفعيل تسجيل المكالمات الأصلي (Call Recording)</div>
                  <div className="text-[11px] text-slate-400">إظهار زر التسجيل داخل واجهة الاتصال بدون رسالة تحذير.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition">
                <input
                  type="checkbox"
                  checked={enableVoLteArab}
                  onChange={(e) => setEnableVoLteArab(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800 w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-slate-200">تفعيل VoLTE & 5G للشبكات العربية</div>
                  <div className="text-[11px] text-slate-400">فك قيود المكالمات الصوتية فائقة الوضوح لمشغلي الشرق الأوسط.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition">
                <input
                  type="checkbox"
                  checked={enableArabicKeyboard}
                  onChange={(e) => setEnableArabicKeyboard(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800 w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-slate-200">الكيبورد العربي الافتراضي واللغات المتاحة</div>
                  <div className="text-[11px] text-slate-400">تفعيل حزم التنبؤ بالنصوص العربية في لوحة المفاتيح.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition">
                <input
                  type="checkbox"
                  checked={enableHijriCalendar}
                  onChange={(e) => setEnableHijriCalendar(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800 w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-slate-200">دعم التقويم الهجري والمناسبات العربية</div>
                  <div className="text-[11px] text-slate-400">إظهار التاريخ الهجري في قفل الشاشة والتقويم المدمج.</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Result & XML Output */}
        <div className="lg:col-span-7 space-y-4">
          
          {isLoading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto"></div>
              <div className="text-sm font-bold text-amber-300">الذكاء الاصطناعي يقوم بإنشاء ملفات CSC المخصصة...</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                ضبط قيم OMC FeatureSet وحزم المشغلين العرب...
              </p>
            </div>
          )}

          {!patchResult && !isLoading && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Settings2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">لم يتم توليد ملفات CSC بعد</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                حدد كود الدولة والميزات المطلوبة ثم اضغط على "توليد حزمة CSC الذكية" للحصول على الأكواد وأوامر الحقن.
              </p>
            </div>
          )}

          {patchResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">حزمة CSC المولدة ({carrierCode})</h3>
                  <div className="text-xs text-slate-400">
                    المسار المستهدف: <code className="text-amber-400 font-mono text-[11px]">{patchResult.targetPathOnDevice}</code>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyViaAdb}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>حقن عبر ADB</span>
                  </button>

                  <button
                    onClick={downloadCscXml}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل XML</span>
                  </button>
                </div>
              </div>

              {/* Features List Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {patchResult.featuresList.map((f, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                    <div className="font-mono text-amber-400 text-[11px] font-bold truncate">
                      {f.tag} = {f.value}
                    </div>
                    <div className="text-slate-300 text-[11px]">{f.description}</div>
                  </div>
                ))}
              </div>

              {/* XML Code Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-amber-400" />
                    <span>محتوى ملف cscfeature.xml</span>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(patchResult.cscXmlContent);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
                  </button>
                </div>

                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto max-h-64 leading-relaxed" dir="ltr">
                  {patchResult.cscXmlContent}
                </pre>
              </div>

              {/* Shell Commands */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">أوامر التثبيت عبر الشل (Terminal Commands):</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto" dir="ltr">
                  {patchResult.installationCommands.map((cmd, idx) => (
                    <div key={idx}>{cmd}</div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
