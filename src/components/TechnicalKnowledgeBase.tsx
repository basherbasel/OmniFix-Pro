import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Tag, 
  Cpu, 
  Zap, 
  Radio, 
  Unlock,
  ChevronLeft,
  X,
  Save,
  Clock,
  User,
  Filter
} from 'lucide-react';
import { knowledgeService, KnowledgeArticle } from '../lib/firebaseKnowledge';
import { auth } from '../lib/firebase';

export const TechnicalKnowledgeBase: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  
  const [newArticle, setNewArticle] = useState<Partial<KnowledgeArticle>>({
    title: '',
    content: '',
    category: 'hardware',
    tags: []
  });

  useEffect(() => {
    const unsubscribe = knowledgeService.subscribeToArticles(setArticles);
    return () => unsubscribe();
  }, []);

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) return;
    
    await knowledgeService.addArticle({
      title: newArticle.title!,
      content: newArticle.content!,
      category: (newArticle.category as any) || 'hardware',
      tags: newArticle.tags || []
    });

    setIsAdding(false);
    setNewArticle({ title: '', content: '', category: 'hardware', tags: [] });
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryIcons: Record<string, any> = {
    hardware: Cpu,
    software: Zap,
    network: Radio,
    frp: Unlock
  };

  const categoryNames: Record<string, string> = {
    hardware: 'أعطال الهاردوير',
    software: 'حلول السوفتوير',
    network: 'مشاكل الشبكة',
    frp: 'تخطي الحسابات'
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">موسوعة الحلول التقنية</h2>
            <p className="text-slate-400 text-sm mt-0.5">قاعدة معرفية متنامية تضم أحدث حلول صيانة المحمول</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/20"
        >
          <Plus className="w-5 h-5" />
          إضافة حل جديد
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-5 space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="بحث في الموسوعة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-xs text-white outline-none focus:border-indigo-500/50"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase px-2 mb-2">التصنيفات</p>
              {[
                { id: 'all', label: 'الكل', icon: BookOpen },
                { id: 'hardware', label: 'الهاردوير', icon: Cpu },
                { id: 'software', label: 'السوفتوير', icon: Zap },
                { id: 'network', label: 'الشبكة', icon: Radio },
                { id: 'frp', label: 'تخطي الحسابات', icon: Unlock },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                      : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Content */}
        <div className="lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article) => {
                const Icon = categoryIcons[article.category] || BookOpen;
                return (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedArticle(article)}
                    className="group bg-slate-900/40 border border-slate-800/50 rounded-3xl p-5 hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-colors" />
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className={`p-2.5 rounded-xl ${
                        article.category === 'hardware' ? 'bg-orange-500/10 text-orange-400' :
                        article.category === 'software' ? 'bg-indigo-500/10 text-indigo-400' :
                        article.category === 'network' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(article.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{article.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">{article.content}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-500 rounded text-[9px] font-bold">#{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
              <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-500">لم يتم العثور على حلول</h3>
              <p className="text-slate-600 text-sm">حاول تغيير كلمة البحث أو التصنيف</p>
            </div>
          )}
        </div>
      </div>

      {/* Article Detail View Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-y-auto no-scrollbar"
            >
              <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    {React.createElement(categoryIcons[selectedArticle.category] || BookOpen, { className: "w-5 h-5" })}
                  </div>
                  <h2 className="text-xl font-black text-white">{selectedArticle.title}</h2>
                </div>
                <button onClick={() => setSelectedArticle(null)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-6 mb-8 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" />
                    <span className="text-[11px] font-bold text-slate-400">الناشر: الإدارة التقنية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-[11px] font-bold text-slate-400">{new Date(selectedArticle.createdAt).toLocaleString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-indigo-400" />
                    <span className="text-[11px] font-bold text-slate-400">{categoryNames[selectedArticle.category]}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none prose-sm">
                  <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">{selectedArticle.content}</p>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex gap-2">
                    {selectedArticle.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-800 text-indigo-400 rounded-full text-[10px] font-bold">#{tag}</span>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 text-indigo-400 text-xs font-bold hover:underline">
                    تحميل الملفات المرفقة
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Article Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-black text-white">إضافة حل تقني جديد</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddArticle} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 mr-2">العنوان</label>
                  <input 
                    required type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-white focus:border-indigo-500/50 outline-none"
                    value={newArticle.title}
                    onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 mr-2">التصنيف</label>
                    <select 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-white focus:border-indigo-500/50 outline-none"
                      value={newArticle.category}
                      onChange={e => setNewArticle({...newArticle, category: e.target.value as any})}
                    >
                      <option value="hardware">هاردوير</option>
                      <option value="software">سوفتوير</option>
                      <option value="network">شبكة</option>
                      <option value="frp">FRP / حماية</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 mr-2">الوسوم (مفصولة بفاصلة)</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-white focus:border-indigo-500/50 outline-none"
                      onChange={e => setNewArticle({...newArticle, tags: e.target.value.split(',').map(s => s.trim())})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 mr-2">المحتوى التقني (شرح العطل والحل)</label>
                  <textarea 
                    required rows={6}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-white focus:border-indigo-500/50 outline-none resize-none"
                    value={newArticle.content}
                    onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" /> حفظ الحل في الموسوعة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
