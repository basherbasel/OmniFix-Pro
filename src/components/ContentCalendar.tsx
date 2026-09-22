import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, MoreHorizontal } from 'lucide-react';

export const ContentCalendar: React.FC = () => {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const month = 'سبتمبر 2026';
  
  // Dummy calendar grid
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">الجدولة والتقويم</h2>
          <p className="text-slate-400 text-sm">خطط لمحتواك القادم ووزعه على مدار الشهر.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
            <button className="p-1 hover:bg-slate-800 rounded-lg text-slate-400"><ChevronRight className="w-5 h-5" /></button>
            <span className="px-4 text-sm font-bold text-white">{month}</span>
            <button className="p-1 hover:bg-slate-800 rounded-lg text-slate-400"><ChevronLeft className="w-5 h-5" /></button>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
            <Plus className="w-4 h-4" />
            <span>موعد جديد</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-800/30">
          {days.map(day => (
            <div key={day} className="p-4 text-center text-xs font-black text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {calendarDays.map((day) => {
            const hasPost = [5, 12, 18, 24].includes(day);
            return (
              <div key={day} className="border-l border-b border-slate-800 p-2 hover:bg-slate-800/20 transition-colors group relative">
                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-400">{day}</span>
                
                {hasPost && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 p-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-lg cursor-pointer hover:bg-indigo-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <MoreHorizontal className="w-3 h-3 text-slate-500" />
                    </div>
                    <div className="text-[9px] text-indigo-200 truncate font-bold">منشور إنستغرام</div>
                    <div className="text-[7px] text-indigo-400 mt-0.5">10:00 PM</div>
                  </motion.div>
                )}

                {day === 15 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-1 p-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg cursor-pointer hover:bg-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <MoreHorizontal className="w-3 h-3 text-slate-500" />
                    </div>
                    <div className="text-[9px] text-emerald-200 truncate font-bold">فيديو تيك توك</div>
                    <div className="text-[7px] text-emerald-400 mt-0.5">08:30 PM</div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">12</div>
          <div>
            <div className="text-xs text-slate-500">منشورات مجدولة</div>
            <div className="text-lg font-bold text-white">هذا الشهر</div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">04</div>
          <div>
            <div className="text-xs text-slate-500">حملات نشطة</div>
            <div className="text-lg font-bold text-white">قيد التنفيذ</div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">08</div>
          <div>
            <div className="text-xs text-slate-500">مسودات معلقة</div>
            <div className="text-lg font-bold text-white">بانتظار المراجعة</div>
          </div>
        </div>
      </div>
    </div>
  );
};
