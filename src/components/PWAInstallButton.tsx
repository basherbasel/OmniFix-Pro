import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-900/40"
      >
        <Download className="w-4 h-4" />
        <span>تثبيت كبرنامج (Desktop)</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition"
        >
          <PlusSquare className="w-4 h-4" />
          <span>تثبيت على iOS</span>
        </button>

        <AnimatePresence>
          {showIOSGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-['Cairo']">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm rounded-[2rem] bg-slate-900 border border-slate-800 p-8 shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowIOSGuide(false)}
                  className="absolute top-4 left-4 p-2 text-slate-500 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-white">تثبيت على iPhone</h3>
                </div>

                <div className="space-y-6 text-right">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">1</div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      اضغط على زر <strong className="text-white flex items-center gap-1 inline-flex">المشاركة <Share className="w-3.5 h-3.5" /></strong> في متصفح سفاري.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">2</div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      قم بالتمرير للأسفل واضغط على <strong className="text-white">إضافة إلى الصفحة الرئيسية (Add to Home Screen)</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="mt-8 w-full rounded-xl bg-slate-800 py-3 text-sm font-bold text-white hover:bg-slate-700 transition"
                >
                  فهمت ذلك
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return null;
};
