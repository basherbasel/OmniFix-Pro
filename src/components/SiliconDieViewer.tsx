import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, Thermometer, ShieldCheck } from 'lucide-react';

interface DieRegion {
  id: string;
  name: string;
  type: 'core' | 'gpu' | 'modem' | 'secure' | 'cache';
  status: 'active' | 'idle' | 'throttling' | 'error';
  temp: number;
}

export const SiliconDieViewer: React.FC = () => {
  const [regions, setRegions] = useState<DieRegion[]>([
    { id: 'cpu_p', name: 'Performance Cores', type: 'core', status: 'active', temp: 42 },
    { id: 'cpu_e', name: 'Efficiency Cores', type: 'core', status: 'idle', temp: 35 },
    { id: 'gpu', name: 'Neural Engine', type: 'gpu', status: 'active', temp: 45 },
    { id: 'modem', name: '5G Baseband DSP', type: 'modem', status: 'active', temp: 38 },
    { id: 'secure', name: 'Secure Enclave (TEE)', type: 'secure', status: 'active', temp: 33 },
    { id: 'cache', name: 'L3 Cache Matrix', type: 'cache', status: 'idle', temp: 31 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRegions(prev => prev.map(r => ({
        ...r,
        temp: r.temp + (Math.random() - 0.5) * 2,
        status: Math.random() > 0.8 ? (r.status === 'active' ? 'idle' : 'active') : r.status
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">SoC Die Topology Map</h4>
            <p className="text-[10px] text-slate-500">Live 7nm Lithography Real-time Telemetry</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Logic Integrity: Stable</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-[300px]">
        {regions.map((region) => (
          <motion.div
            key={region.id}
            layout
            className={`relative rounded-2xl border flex flex-col p-4 transition-all overflow-hidden ${
              region.status === 'active' ? 'bg-indigo-600/5 border-indigo-500/30 shadow-[inset_0_0_15px_rgba(79,70,229,0.1)]' :
              region.status === 'throttling' ? 'bg-amber-500/5 border-amber-500/30' :
              'bg-slate-900/50 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{region.type}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${
                region.status === 'active' ? 'bg-emerald-500' : 
                region.status === 'idle' ? 'bg-slate-700' : 'bg-amber-500'
              }`} />
            </div>
            
            <h5 className="text-xs font-black text-white truncate mb-auto">{region.name}</h5>
            
            <div className="mt-4 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Thermal</span>
                <span className={`text-sm font-black ${region.temp > 45 ? 'text-amber-400' : 'text-slate-300'}`}>
                  {region.temp.toFixed(1)}°C
                </span>
              </div>
              <div className="w-12 h-6 flex items-end gap-0.5">
                {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: `${h * (region.status === 'active' ? 100 : 20)}%` }}
                    className={`w-full rounded-t-sm ${region.status === 'active' ? 'bg-indigo-500' : 'bg-slate-800'}`}
                  />
                ))}
              </div>
            </div>

            {/* Background Data Matrix Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden font-mono text-[6px] p-2 leading-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i}>{Math.random().toString(16).repeat(5)}</div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-bold uppercase">Clock Speed</span>
            <span className="text-xs font-black text-white">3.22 GHz</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-bold uppercase">Bus Width</span>
            <span className="text-xs font-black text-white">128-bit</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-bold uppercase">Efficiency</span>
            <span className="text-xs font-black text-white">98.2%</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-[10px] font-black text-white hover:bg-indigo-500 transition-all uppercase tracking-widest">
          <Activity className="w-3.5 h-3.5" />
          Full Logic Dump
        </button>
      </div>
    </div>
  );
};
