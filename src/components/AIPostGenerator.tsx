import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Send, 
  Calendar, 
  Hash, 
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Type,
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SocialPlatform } from '../types';
import { fetchWithAuth } from '../lib/api';

export const AIPostGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [editableContent, setEditableContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const platforms: { id: SocialPlatform, icon: any, color: string }[] = [
    { id: 'instagram', icon: Instagram, color: 'hover:text-pink-400' },
    { id: 'twitter', icon: Twitter, color: 'hover:text-blue-400' },
    { id: 'tiktok', icon: ({className}: any) => <div className={className}>T</div>, color: 'hover:text-white' },
    { id: 'youtube', icon: Youtube, color: 'hover:text-red-400' },
  ];

  const [seed, setSeed] = useState(Math.random());

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setSeed(Math.random());
    
    try {
      const response = await fetchWithAuth('/api/social/generate-post', {
        method: 'POST',
        body: JSON.stringify({ topic, platform }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setGeneratedContent(data);
      setEditableContent(data.content);
    } catch (err: any) {
      setError(err.message || 'فشل توليد المحتوى. يرجى المحاولة لاحقاً.');
      // Mock data for demo if API fails
      const mockData = {
        content: `استكشف مستقبل الابتكار مع تمكين الرقمية! 🚀\n\nنحن هنا لمساعدتك على تحويل رؤيتك إلى واقع ملموس باستخدام أحدث تقنيات الذكاء الاصطناعي. \n\n#تمكين_الرقمية #ذكاء_اصطناعي #ابتكار #تكنولوجيا`,
        imagePrompt: 'A futuristic digital workspace with holographic interfaces, warm ambient lighting, highly detailed, 8k, professional photography',
        hashtags: ['#تمكين_الرقمية', '#ذكاء_اصطناعي', '#ابتكار']
      };
      setGeneratedContent(mockData);
      setEditableContent(mockData.content);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            مولد المحتوى الذكي
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">ماذا تريد أن تنشر اليوم؟</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثلاً: حملة ترويجية لخدماتنا الجديدة في شهر سبتمبر..."
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">اختر المنصة المستهدفة</label>
              <div className="grid grid-cols-4 gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      platform === p.id 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 ' + p.color
                    }`}
                  >
                    <p.icon className="w-6 h-6" />
                    <span className="text-[10px] capitalize">{p.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                  <span>جاري التوليد...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>توليد المنشور بالذكاء الاصطناعي</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {generatedContent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Content Preview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">T</div>
                    <div>
                      <div className="text-sm font-bold text-white">Tamkeen Pro</div>
                      <div className="text-[10px] text-slate-400">معاينة المنشور على {platform}</div>
                    </div>
                  </div>
                  <Globe className="w-4 h-4 text-slate-500" />
                </div>

                <div className="p-4 space-y-4">
                  {/* Image Placeholder */}
                  <div className="aspect-square rounded-xl bg-slate-800 flex flex-col items-center justify-center text-slate-500 relative group overflow-hidden border border-slate-700">
                    <img 
                      src={`https://picsum.photos/seed/${seed}/800`} 
                      alt="generated" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-6 text-center">
                      <div className="bg-indigo-600/80 p-3 rounded-full mb-4 cursor-pointer hover:scale-110 transition-transform" onClick={() => setSeed(Math.random())}>
                        <RefreshCcw className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-xs text-white mb-2 font-bold uppercase tracking-wider">وصف الصورة المقترح:</p>
                      <p className="text-[10px] text-slate-200 line-clamp-3 italic leading-relaxed">"{generatedContent.imagePrompt}"</p>
                    </div>
                  </div>

                  {/* Post Text */}
                  <div className="p-1">
                    <textarea 
                      value={editableContent}
                      onChange={(e) => setEditableContent(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-200 leading-relaxed font-['Cairo'] outline-none focus:border-indigo-500/50 transition-colors min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setSeed(Math.random())}
                      className="text-slate-400 hover:text-white transition-colors" 
                      title="تغيير الصورة"
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </button>
                    <button className="text-slate-400 hover:text-white transition-colors"><ImageIcon className="w-5 h-5" /></button>
                    <button className="text-slate-400 hover:text-white transition-colors"><Hash className="w-5 h-5" /></button>
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                    <Calendar className="w-4 h-4" />
                    جدولة النشر
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-sm transition-all border border-slate-700">
                  حفظ كمسودة
                </button>
                <button className="bg-white text-slate-950 hover:bg-slate-100 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  نشر الآن
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Type className="w-8 h-8 text-slate-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-400 mb-2">بانتظار إبداعك...</h4>
              <p className="text-sm text-slate-500 max-w-xs">أدخل موضوعاً في القائمة الجانبية وسيقوم الذكاء الاصطناعي بتوليد المنشور والصورة المناسبة لك فوراً.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
