import React from 'react';
import { motion } from 'motion/react';
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Globe, 
  RefreshCcw, 
  Link2, 
  Trash2, 
  Plus,
  ExternalLink,
  Users,
  Eye,
  MessageCircle
} from 'lucide-react';
import { MOCK_SOCIAL_ACCOUNTS } from '../data/socialMockData';

export const AccountsManager: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة الحسابات</h2>
          <p className="text-slate-400 text-sm">اربط وقم بإدارة كافة منصاتك الرقمية من مكان واحد.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
          <Plus className="w-4 h-4" />
          إضافة حساب جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_SOCIAL_ACCOUNTS.map((acc, idx) => (
          <motion.div
            key={acc.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-indigo-500/30 transition-all"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    acc.platform === 'instagram' ? 'bg-pink-500/20 text-pink-400' :
                    acc.platform === 'tiktok' ? 'bg-slate-800 text-white' :
                    acc.platform === 'twitter' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {acc.platform === 'instagram' && <Instagram className="w-6 h-6" />}
                    {acc.platform === 'twitter' && <Twitter className="w-6 h-6" />}
                    {acc.platform === 'youtube' && <Youtube className="w-6 h-6" />}
                    {acc.platform === 'linkedin' && <Linkedin className="w-6 h-6" />}
                    {acc.platform === 'tiktok' && <div className="font-bold text-lg">T</div>}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{acc.username}</h4>
                    <p className="text-[10px] text-slate-400 capitalize">{acc.platform}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                  acc.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {acc.status === 'connected' ? 'نشط' : 'يتطلب إعادة ربط'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-slate-800/50 p-2 rounded-xl text-center">
                  <Users className="w-3 h-3 mx-auto mb-1 text-indigo-400" />
                  <div className="text-xs font-bold text-white">{acc.followersCount.toLocaleString()}</div>
                  <div className="text-[8px] text-slate-500">متابع</div>
                </div>
                <div className="bg-slate-800/50 p-2 rounded-xl text-center">
                  <Eye className="w-3 h-3 mx-auto mb-1 text-emerald-400" />
                  <div className="text-xs font-bold text-white">45K</div>
                  <div className="text-[8px] text-slate-500">وصول</div>
                </div>
                <div className="bg-slate-800/50 p-2 rounded-xl text-center">
                  <MessageCircle className="w-3 h-3 mx-auto mb-1 text-purple-400" />
                  <div className="text-xs font-bold text-white">1.2K</div>
                  <div className="text-[8px] text-slate-500">تفاعل</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                  <RefreshCcw className="w-3 h-3" />
                  تزامن البيانات
                </button>
                <button className="p-2.5 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-all border border-transparent">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-slate-800/30 px-6 py-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 italic">آخر مزامنة: {new Date(acc.lastSyncAt).toLocaleDateString('ar-SA')}</span>
              <button className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                فتح الحساب <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          </motion.div>
        ))}

        <button className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl flex flex-col items-center justify-center p-8 transition-all group">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-indigo-500/10 group-hover:scale-110 transition-all">
            <Plus className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" />
          </div>
          <span className="text-slate-400 font-bold group-hover:text-white transition-colors">إضافة حساب جديد</span>
          <p className="text-[10px] text-slate-600 mt-2">دعم TikTok, IG, FB, X, YT</p>
        </button>
      </div>
    </div>
  );
};
