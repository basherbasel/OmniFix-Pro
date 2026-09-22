import React, { useState } from 'react';
import { 
  FileCode, 
  Sparkles, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Edit3, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  Code,
  FileText
} from 'lucide-react';
import { SAMPLE_STRINGS_XML } from '../data/devicePresets';
import { TranslationResult, StringTranslationItem } from '../types';
import { fetchWithAuth } from '../lib/api';

export const XmlStringsTranslator: React.FC = () => {
  const [xmlInput, setXmlInput] = useState<string>(SAMPLE_STRINGS_XML);
  const [dialect, setDialect] = useState<string>('فصحى قياسية مطابقة لمصطلحات جوجل وسامسونج الرسمية');
  const [context, setContext] = useState<string>('تطبيق إعدادات النظام وواجهة أندرويد (Settings & SystemUI)');
  const [preserveTags, setPreserveTags] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'editor' | 'raw_xml'>('editor');
  const [copiedXml, setCopiedXml] = useState<boolean>(false);

  const handleTranslate = async () => {
    if (!xmlInput.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth('/api/ai/translate-strings', {
        method: 'POST',
        body: JSON.stringify({
          xmlContent: xmlInput,
          context,
          dialect,
          preserveTags,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'حدث خطأ أثناء ترجمة ملف XML');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setXmlInput(content);
    };
    reader.readAsText(file);
  };

  const handleItemEdit = (index: number, newArabicText: string) => {
    if (!result) return;
    const updatedItems = [...result.items];
    updatedItems[index].arabic = newArabicText;
    
    // Regenerate XML
    const newXml = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n` +
      updatedItems.map(item => `    <string name="${item.key}">${item.arabic}</string>`).join('\n') +
      `\n</resources>`;

    setResult({
      ...result,
      items: updatedItems,
      translatedXml: newXml,
    });
  };

  const downloadXmlFile = () => {
    if (!result) return;
    const blob = new Blob([result.translatedXml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strings.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyTranslatedXml = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.translatedXml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  const filteredItems = result?.items.filter(
    (item) =>
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.arabic.includes(searchQuery)
  ) || [];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <FileCode className="w-3.5 h-3.5" /> مترجم موارد وتطبيقات الأندرويد الذكي (Android XML & APK Localizer)
          </div>
          <h2 className="text-xl font-bold text-white">
            ترجمة ملفات <span className="text-blue-400">strings.xml</span> وتوطين تطبيقات النظام
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            محرك ذكي مخصص لفهم سياق نصوص الأندرويد، والحفاظ على المتغيرات التقنية مثل <code className="text-emerald-400">%1$s</code> و <code className="text-emerald-400">%d</code> وعلامات التنسيق مع معايير المصطلحات العربية المعتمدة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-slate-700">
            <Upload className="w-3.5 h-3.5" />
            <span>رفع ملف XML</span>
            <input type="file" accept=".xml,.txt" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleTranslate}
            disabled={isLoading || !xmlInput.trim()}
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'جاري التعريب بالذكاء الاصطناعي...' : 'ترجمة وتعريب الآن'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-2xl text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Main Grid: Input & Options vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Input XML & Translation Settings */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span>محتوى ملف strings.xml الأصلي (English)</span>
              </label>
              <button
                onClick={() => setXmlInput(SAMPLE_STRINGS_XML)}
                className="text-[11px] text-blue-400 hover:underline"
              >
                استعادة النموذج التجريبي
              </button>
            </div>

            <textarea
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
              rows={14}
              placeholder="الصق محتوى ملف XML هنا..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
              dir="ltr"
            />
          </div>

          {/* Configuration Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white">إعدادات التعريب والسياق التقني</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">أسلوب ومصطلحات التعريب</label>
                <select
                  value={dialect}
                  onChange={(e) => setDialect(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="فصحى قياسية مطابقة لمصطلحات جوجل وسامسونج الرسمية">فصحى معتمدة لأندرويد (Google / Samsung Standard)</option>
                  <option value="فصحى مبسطة وسهلة للمستخدم العادي">فصحى مبسطة (User Friendly)</option>
                  <option value="لهجة خليجية سعودية تقنية">لهجة خليجية / سعودية (Saudi Arabic)</option>
                  <option value="لهجة مصرية تقنية">لهجة مصرية (Egyptian Arabic)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">نوع التطبيق / سياق النصوص</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="مثال: إعدادات الهاتف، الكاميرا، إدارة الملفات"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={preserveTags}
                  onChange={(e) => setPreserveTags(e.target.checked)}
                  className="rounded border-slate-700 text-blue-500 focus:ring-blue-500 bg-slate-800 w-4 h-4"
                />
                <span className="text-slate-300 font-medium">الحفاظ الصارم على وسوم التنسيق والمتغيرات (%s, %d, HTML)</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Translated Result View & Interactive Editor */}
        <div className="lg:col-span-7 space-y-4">
          
          {isLoading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto"></div>
              <div className="text-sm font-bold text-blue-300">الذكاء الاصطناعي يقوم بتعريب وترجمة عناصر XML...</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                الحفاظ على المتغيرات التقنية وصياغة مصطلحات أندرويد الدقيقة...
              </p>
            </div>
          )}

          {!result && !isLoading && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <FileCode className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">لا توجد ترجمة حالية</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                انقر على زر "ترجمة وتعريب الآن" لتحويل نصوص ملف XML إلى العربية بدقة متناهية مع إمكانية التعديل والتحميل الفوري.
              </p>
            </div>
          )}

          {result && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-in fade-in">
              
              {/* Results Topbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    تم تعريب {result.items.length} عنصر
                  </span>
                  {result.translationSummary.formattedVariablesPreserved && (
                    <span className="bg-blue-500/10 text-blue-400 text-[11px] px-2 py-0.5 rounded-md">
                      تم حفظ {result.translationSummary.formattedVariablesPreserved} متغير
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setActiveTab('editor')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        activeTab === 'editor' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      جدول التعديل (Editor)
                    </button>
                    <button
                      onClick={() => setActiveTab('raw_xml')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        activeTab === 'raw_xml' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      كود XML النهائي
                    </button>
                  </div>

                  <button
                    onClick={downloadXmlFile}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل strings.xml</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Interactive Table Editor */}
              {activeTab === 'editor' && (
                <div className="space-y-3">
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="بحث في المفاتيح أو النصوص الأصلية أو المترجمة..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Items List */}
                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {filteredItems.map((item, idx) => (
                      <div
                        key={item.key}
                        className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs transition hover:border-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-blue-400 font-semibold text-[11px] bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/50">
                            name="{item.key}"
                          </span>
                          {item.isFormatted && (
                            <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded">
                              يحتوي متغيرات
                            </span>
                          )}
                        </div>

                        <div className="text-slate-400 font-sans text-[11px] bg-slate-900/40 p-2 rounded border border-slate-850" dir="ltr">
                          {item.original}
                        </div>

                        <div>
                          <input
                            type="text"
                            value={item.arabic}
                            onChange={(e) => handleItemEdit(idx, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-750 rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-medium focus:outline-none focus:border-emerald-500"
                            dir="rtl"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* Tab 2: Raw XML Output */}
              {activeTab === 'raw_xml' && (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      onClick={copyTranslatedXml}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1"
                    >
                      {copiedXml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedXml ? 'تم النسخ' : 'نسخ كود XML'}</span>
                    </button>
                  </div>
                  <pre
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[480px] leading-relaxed select-all"
                    dir="ltr"
                  >
                    {result.translatedXml}
                  </pre>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
