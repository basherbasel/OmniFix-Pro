import React, { useState } from 'react';
import { 
  PackageCheck, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Code, 
  FolderArchive,
  Terminal,
  ShieldCheck,
  Check
} from 'lucide-react';
import JSZip from 'jszip';
import { DeviceInfo, MagiskModuleResult } from '../types';
import { fetchWithAuth } from '../lib/api';

interface MagiskModuleBuilderProps {
  device: DeviceInfo;
  onSendTerminalLog: (text: string, type: 'cmd' | 'output' | 'error' | 'success' | 'info') => void;
}

export const MagiskModuleBuilder: React.FC<MagiskModuleBuilderProps> = ({
  device,
  onSendTerminalLog,
}) => {
  const [moduleName, setModuleName] = useState('Arabic System Localization Suite');
  const [author, setAuthor] = useState('Android Arabization Studio AI');
  const [fontSelection, setFontSelection] = useState('خط القاهرة (Cairo Arabic Font)');
  const [targetAndroid, setTargetAndroid] = useState('Android 10 - 15');
  const [targetProps, setTargetProps] = useState('persist.sys.locale=ar-SA\npersist.sys.language=ar\npersist.sys.country=SA');
  const [includeRroOverlay, setIncludeRroOverlay] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [moduleResult, setModuleResult] = useState<MagiskModuleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);

  const fontOptions = [
    { name: 'خط القاهرة (Cairo Arabic Font)', desc: 'خط حديث وواضح جداً لواجهات الأندرويد والشاشات عالية الدقة' },
    { name: 'خط المراعي (Almarai Font)', desc: 'خط هندسي ناعم وممتاز للقراءة وسهل على العين' },
    { name: 'خط تجوال (Tajawal Font)', desc: 'خط عصري متناسق مع واجهات سامسونج One UI وشاومي' },
    { name: 'خط نوتو النسخ (Noto Naskh Arabic)', desc: 'خط جوجل الرسمي القياسي لأجهزة بيكسل والأندرويد الخام' },
    { name: 'الخط الأميري (Amiri Classic)', desc: 'خط عربي كلاسيكي أصيل عالي الدقة' },
  ];

  const handleGenerateModule = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth('/api/ai/generate-magisk-module', {
        method: 'POST',
        body: JSON.stringify({
          moduleName,
          author,
          fontSelection,
          androidVersion: targetAndroid,
          targetProps,
          includeRroOverlay,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setModuleResult(data.data);
      } else {
        setError(data.error || 'فشل في بناء موديل ماجيسك');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!moduleResult) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();

      // Root files
      zip.file('module.prop', moduleResult.moduleProp);
      zip.file('system.prop', moduleResult.systemProp);
      zip.file('customize.sh', moduleResult.customizeSh);
      zip.file('README.md', moduleResult.readmeMd);

      // System fonts directory
      const systemFolder = zip.folder('system');
      const etcFolder = systemFolder?.folder('etc');
      etcFolder?.file('fonts.xml', moduleResult.fontsXmlOverride);

      const fontsFolder = systemFolder?.folder('fonts');
      fontsFolder?.file('README_FONTS.txt', `Arabic Font: ${fontSelection}\nPackaged by Android Arabization Studio AI.`);

      if (includeRroOverlay) {
        const overlayFolder = systemFolder?.folder('app')?.folder('ArabicOverlay');
        overlayFolder?.file('README_OVERLAY.txt', 'Runtime Resource Overlay for Arabic strings and layout RTL');
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      const cleanName = moduleName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      a.download = `${cleanName}_magisk_flashable.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setZipDownloaded(true);
      setTimeout(() => setZipDownloaded(false), 3000);

      onSendTerminalLog(`[Magisk] تم إنشاء وتحميل حزمة الموديل بنجاح: ${a.download}`, 'success');
    } catch (err: any) {
      console.error('Zipping error:', err);
      setError('فشل في ضغط ملف Zip');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <PackageCheck className="w-3.5 h-3.5" /> صانع موديلات الروت الشامل (Magisk, KernelSU & APatch Builder)
          </div>
          <h2 className="text-xl font-bold text-white">
            بناء موديل ماجيسك قابل للتفليش <span className="text-emerald-400">Systemless Arabization Zip</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            يقوم بتوليد حزمة روت كاملة وقابلة للتثبيت الفوري عبر تطبيق Magisk أو KernelSU أو TWRP، تحتوي على خطوط عربية فاخرة وخصائص اللغة وتجاوز حماية النظام بدون تعديل ملفات النظام الأصلية.
          </p>
        </div>

        <button
          onClick={handleGenerateModule}
          disabled={isLoading}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'جاري بناء الموديل...' : 'توليد ملفات الموديل الآن'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-2xl text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Main Form & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Module Parameters */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white">بيانات وإعدادات حزمة الموديل</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">اسم الموديل (Module Name)</label>
                <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">المطور / الصانع (Author)</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">الخط العربي المختار (Arabic Font Family)</label>
                <select
                  value={fontSelection}
                  onChange={(e) => setFontSelection(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {fontOptions.map((f, i) => (
                    <option key={i} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">خصائص النظام المحقونة (system.prop)</label>
                <textarea
                  value={targetProps}
                  onChange={(e) => setTargetProps(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-emerald-400 focus:outline-none focus:border-emerald-500"
                  dir="ltr"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={includeRroOverlay}
                  onChange={(e) => setIncludeRroOverlay(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800 w-4 h-4"
                />
                <span className="text-slate-300 font-medium">تضمين طبقة RRO Overlay للترجمة الحية</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Result Preview & Download Zip */}
        <div className="lg:col-span-7 space-y-4">
          
          {isLoading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>
              <div className="text-sm font-bold text-emerald-300">الذكاء الاصطناعي يقوم بتجميع وتنسيق ملفات الموديل...</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                إنشاء سكريبتات customize.sh وحقن خط {fontSelection} وتكوين fonts.xml...
              </p>
            </div>
          )}

          {!moduleResult && !isLoading && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <FolderArchive className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">لم يتم توليد الموديل بعد</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                اضغط على "توليد ملفات الموديل الآن" لإنشاء حزمة ماجيسك متكاملة جاهزة للتنزيل بصيغة zip والتفليش المباشر على الهاتف.
              </p>
            </div>
          )}

          {moduleResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
              
              {/* Topbar with Download Zip Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>تم تجهيز حزمة الموديل بنجاح</span>
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">{moduleResult.structureExplanation}</div>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition active:scale-95 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{isZipping ? 'جاري الضغط...' : zipDownloaded ? 'تم التحميل!' : 'تحميل حزمة Zip للماجيسك'}</span>
                </button>
              </div>

              {/* Module.prop Code Box */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">محتوى ملف module.prop:</span>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed" dir="ltr">
                  {moduleResult.moduleProp}
                </pre>
              </div>

              {/* Customize.sh Code Box */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">سكريبت التثبيت customize.sh:</span>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-48 leading-relaxed" dir="ltr">
                  {moduleResult.customizeSh}
                </pre>
              </div>

              {/* Readme Guide */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>طريقة التثبيت على الهاتف:</span>
                </span>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {moduleResult.readmeMd}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
