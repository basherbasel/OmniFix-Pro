import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { TrendingUp, Users, Eye, Target, Share2, Globe } from 'lucide-react';
import { MOCK_ANALYTICS } from '../data/socialMockData';

const RADAR_DATA = [
  { subject: 'الوصول', A: 120, B: 110, fullMark: 150 },
  { subject: 'التفاعل', A: 98, B: 130, fullMark: 150 },
  { subject: 'المحتوى', A: 86, B: 130, fullMark: 150 },
  { subject: 'النمو', A: 99, B: 100, fullMark: 150 },
  { subject: 'التحويل', A: 85, B: 90, fullMark: 150 },
  { subject: 'الانتشار', A: 65, B: 85, fullMark: 150 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export const SocialAnalytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">التحليلات المتقدمة</h2>
        <p className="text-slate-400 text-sm">بيانات دقيقة وتحليلات مدعومة بالذكاء الاصطناعي لنمو حساباتك.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Over Time (Bar Chart) */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-indigo-400" />
            تحليل التفاعل اليومي
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ANALYTICS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(val) => val.split('-')[2]} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="engagement" fill="#6366f1" radius={[4, 4, 0, 0]} name="التفاعل" />
                <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} name="التحويل" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Performance */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            بصمة الأداء الشاملة
          </h3>
          <div className="h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#334155" />
                <Radar name="الأسبوع الحالي" dataKey="B" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Radar name="الأسبوع الماضي" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-400" />
            توزيع الوصول حسب المنصة
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Instagram', value: 45 },
                    { name: 'TikTok', value: 35 },
                    { name: 'X', value: 15 },
                    { name: 'YouTube', value: 5 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-8 rounded-2xl flex flex-col justify-center">
          <div className="bg-indigo-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">توصية الذكاء الاصطناعي اليوم</h3>
          <p className="text-slate-300 leading-relaxed mb-6">
            لاحظ نظامنا زيادة بنسبة <span className="text-emerald-400 font-bold">24%</span> في التفاعل مع محتوى الفيديو القصير على TikTok بين الساعة 8 و 10 مساءً. ننصحك بتركيز حملتك القادمة "إطلاق V2" على هذا التوقيت لزيادة التحويل.
          </p>
          <div className="flex gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all">
              تطبيق التوصية
            </button>
            <button className="text-slate-400 hover:text-white text-sm font-bold transition-all">
              عرض التفاصيل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
