import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Search, 
  Smartphone, 
  Filter, 
  Cpu, 
  Globe2, 
  ShieldCheck, 
  AlertCircle,
  HardDrive,
  Clock,
  ExternalLink,
  ChevronRight,
  FileCode,
  Tag
} from 'lucide-react';

interface Firmware {
  id: string;
  name: string;
  brand: string;
  model: string;
  version: string;
  size: string;
  region: string;
  date: string;
  type: 'Official' | 'Custom' | 'Engineering';
  status: 'available' | 'hot' | 'legacy';
}

const DUMMY_FIRMWARES: Firmware[] = [
  { id: '1', name: 'G998BXXU9EWI1', brand: 'Samsung', model: 'Galaxy S21 Ultra 5G', version: 'Android 13', size: '6.4 GB', region: 'KSA (KSA)', date: '2023-10-12', type: 'Official', status: 'hot' },
  { id: '2', name: 'V14.0.5.0.TLCMIXM', brand: 'Xiaomi', model: 'Xiaomi 13', version: 'MIUI 14', size: '5.2 GB', region: 'Global', date: '2023-09-20', type: 'Official', status: 'available' },
  { id: '3', name: 'NE2211_11_C.26', brand: 'OnePlus', model: 'OnePlus 10 Pro', version: 'OxygenOS 13', size: '4.8 GB', region: 'India', date: '2023-08-15', type: 'Official', status: 'available' },
  { id: '4', name: 'ENG_BOOT_SM-G975F', brand: 'Samsung', model: 'Galaxy S10+', version: 'Repair Boot', size: '120 MB', region: 'World', date: '2022-05-10', type: 'Engineering', status: 'legacy' },
  { id: '5', name: 'PD2185_A_13.1.10.2', brand: 'Vivo', model: 'Vivo X80 Pro', version: 'Funtouch OS 13', size: '5.9 GB', region: 'Global', date: '2023-11-01', type: 'Official', status: 'hot' },
];

export const FirmwareRepository: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [selectedFirmware, setSelectedFirmware] = useState<Firmware | null>(null);

  const filtered = DUMMY_FIRMWARES.filter(f => 
    (f.name.toLowerCase().includes(search.toLowerCase()) || f.model.toLowerCase().includes(search.toLowerCase())) &&
    (filterBrand === 'All' || f.brand === filterBrand)
  );

  const brands = ['All', 'Samsung', 'Xiaomi', 'OnePlus', 'Vivo', 'Huawei'];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header & Stats */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <HardDrive className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">مستودع الفيرموير العالمي</h2>
            <p className="text-slate-400 text-sm">أضخم قاعدة بيانات لملفات الروم الرسمية والملفات الهندسيّة</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-black text-white">2.4M+</div>
            <div className="text-[10px] text-slate-500 uppercase font-black">ملف متاح</div>
          </div>
          <div className="w-px h-10 bg-slate-800"></div>
          <div className="text-center">
            <div className="text-2xl font-black text-indigo-400">450TB</div>
            <div className="text-[10px] text-slate-500 uppercase font-black">حجم البيانات</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Search & Filter Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase mr-2">البحث السريع</label>
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث بالموديل أو رقم الإصدار..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pr-11 pl-4 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase mr-2">تصفية حسب الشركة</label>
              <div className="flex flex-wrap gap-2">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setFilterBrand(brand)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      filterBrand === brand 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-500">تنبيه أمني</span>
              </div>
              <p className="text-[11px] text-amber-200/70 leading-relaxed">
                تأكد دائماً من مطابقة الـ Binary والـ Region قبل عملية التفليش لتجنب موت الجهاز.
              </p>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2rem] p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-black mb-1">طلب روم خاص</h3>
              <p className="text-xs opacity-80 mb-4">هل تبحث عن فلاشة نادرة؟ اطلبها الآن من مهندسينا.</p>
              <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-all">
                فتح تذكرة طلب
              </button>
            </div>
            <Download className="absolute bottom-[-10%] left-[-10%] w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>

        {/* Firmware List */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((fw) => (
              <motion.div
                key={fw.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onClick={() => setSelectedFirmware(fw)}
                className={`p-5 bg-slate-900 border rounded-3xl cursor-pointer transition-all hover:translate-x-[-4px] flex items-center justify-between group ${
                  selectedFirmware?.id === fw.id ? 'border-indigo-500 shadow-lg shadow-indigo-900/20' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${
                    selectedFirmware?.id === fw.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 group-hover:text-indigo-400'
                  }`}>
                    <Smartphone className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-white">{fw.model}</h4>
                      {fw.status === 'hot' && (
                        <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase rounded-full">Hot Update</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {fw.brand}</span>
                      <span className="flex items-center gap-1"><Globe2 className="w-3 h-3" /> {fw.region}</span>
                      <span className="flex items-center gap-1"><FileCode className="w-3 h-3" /> {fw.version}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-xs font-black text-white mb-1">{fw.size}</div>
                  <div className="text-[10px] text-slate-500">{fw.date}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-700">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-400">لا توجد نتائج بحث</h3>
                <p className="text-sm text-slate-600">جرب البحث بكلمات مختلفة أو اختر ماركة أخرى.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Firmware Detail Modal (Overlaid or Side Sheet style) */}
      <AnimatePresence>
        {selectedFirmware && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setSelectedFirmware(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative z-10 space-y-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">{selectedFirmware.model}</h3>
                    <p className="text-indigo-400 font-mono text-sm">{selectedFirmware.name}</p>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-2xl text-indigo-400">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'الإصدار', value: selectedFirmware.version, icon: Tag },
                    { label: 'المنطقة', value: selectedFirmware.region, icon: Globe2 },
                    { label: 'الحجم', value: selectedFirmware.size, icon: HardDrive },
                    { label: 'تاريخ الرفع', value: selectedFirmware.date, icon: Clock },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <item.icon className="w-4 h-4 text-slate-500" />
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{item.label}</div>
                      <div className="text-xs font-black text-white">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <h4 className="text-xs font-black text-white flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-emerald-400" /> تفاصيل المحتوى (Files)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {['BL_XXX.tar.md5', 'AP_XXX.tar.md5', 'CP_XXX.tar.md5', 'CSC_XXX.tar.md5'].map((file, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] text-slate-400 p-2 hover:bg-slate-900 rounded-lg transition-colors">
                          <span>{file}</span>
                          <span className="text-emerald-500 font-mono">Verified Hash ✅</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-900/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Download className="w-6 h-6" /> تحميل الآن
                  </button>
                  <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 border border-slate-700">
                    <ExternalLink className="w-6 h-6" /> المصدر الرسمي
                  </button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
