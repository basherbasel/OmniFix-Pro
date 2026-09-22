import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Microscope, 
  Radio, 
  Thermometer, 
  ShieldAlert, 
  Activity, 
  Zap, 
  Search,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Terminal,
  RefreshCw,
  Box,
  ChevronRight,
  Usb,
  Link,
  Link2Off
} from 'lucide-react';
import { OmniFixAgent, OmniFixAgentId, HardwareTelemetry } from '../types';
import { hardwareBridge, RawUsbDevice } from '../lib/hardwareBridge';
import { useConsent } from '../ConsentContext';
import { SiliconDieViewer } from './SiliconDieViewer';
import { BoardViewStudio } from './BoardViewStudio';

// Helper for futuristic charts
const MiniChart: React.FC<{ data: number[], color: string }> = ({ data, color }) => (
  <div className="flex items-end gap-0.5 h-6 w-20">
    {data.map((v, i) => (
      <div 
        key={i} 
        style={{ height: `${v}%` }} 
        className={`w-full rounded-t-sm ${color} opacity-60`}
      />
    ))}
  </div>
);

const AGENTS_INITIAL: OmniFixAgent[] = [
  { 
    id: 'silicon', 
    name: 'Silicon Agent', 
    arabicName: 'وكيل السيليكون', 
    status: 'idle', 
    specialization: 'SoC, Bootrom, Loaders' 
  },
  { 
    id: 'rf_baseband', 
    name: 'RF Agent', 
    arabicName: 'وكيل الترددات', 
    status: 'idle', 
    specialization: 'Baseband, NVRAM, IMEI' 
  },
  { 
    id: 'electronics', 
    name: 'Electronics Agent', 
    arabicName: 'وكيل الإلكترونيات', 
    status: 'idle', 
    specialization: 'VCC, BoardView, Thermal' 
  },
  { 
    id: 'security_integrity', 
    name: 'Security Agent', 
    arabicName: 'وكيل الحماية', 
    status: 'idle', 
    specialization: 'FRP, Anti-Brick, Firmware' 
  }
];

export const OmniFixCore: React.FC = () => {
  const { requestConsent } = useConsent();
  const [agents, setAgents] = useState<OmniFixAgent[]>(AGENTS_INITIAL);
  const [activeAgentId, setActiveAgentId] = useState<OmniFixAgentId | null>(null);
  const [connectedDevice, setConnectedDevice] = useState<RawUsbDevice | null>(null);
  const [telemetry, setTelemetry] = useState<HardwareTelemetry>({
    voltage: 3.82,
    current: 0.045,
    temperature: 32,
    bootMode: 'normal',
    usbStatus: 'disconnected'
  });
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'warn' | 'success' | 'agent', agent?: string}[]>([]);
  const [dataStream, setDataStream] = useState<{timestamp: string, baud: string, proto: string, port: string, data: string}[]>([]);

  const [telemetryHistory, setTelemetryHistory] = useState<{cpu: number[], temp: number[]}>(
    { cpu: [40, 45, 42, 48, 50, 47, 44], temp: [32, 33, 32, 34, 35, 34, 33] }
  );

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' | 'agent' = 'info', agent?: string) => {
    setLogs(prev => [{ msg, type, agent }, ...prev].slice(0, 50));
  };

  const addStreamData = (baud: string, proto: string, port: string, data: string) => {
    setDataStream(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      baud,
      proto,
      port,
      data
    }, ...prev].slice(0, 20));
  };

  useEffect(() => {
    hardwareBridge.onConnect((dev: RawUsbDevice) => {
      setConnectedDevice(dev);
      setTelemetry(prev => ({ 
        ...prev, 
        usbStatus: 'connected', 
        bootMode: dev.mode as any || 'normal' 
      }));
      addLog(`تم اكتشاف جهاز جديد: ${dev.vendorName} ${dev.productName} (${dev.mode})`, 'success');
      
      // Simulate data stream on connect
      const streamInterval = setInterval(() => {
        const protocols = ['ADB', 'Fastboot', 'EDL', 'DFU', 'MTP'];
        const mockData = [
          'GET_DESCRIPTOR', 'SET_CONFIGURATION', 'CLAIM_INTERFACE', 
          'BULK_TRANSFER_OUT', 'BULK_TRANSFER_IN', 'CONTROL_TRANSFER'
        ];
        addStreamData(
          '115200', 
          protocols[Math.floor(Math.random() * protocols.length)], 
          `USB_PORT_${Math.floor(Math.random() * 8)}`,
          mockData[Math.floor(Math.random() * mockData.length)] + ` [${Math.random().toString(16).slice(2, 6).toUpperCase()}]`
        );

        // Update telemetry history
        setTelemetryHistory(prev => ({
          cpu: [...prev.cpu.slice(1), 30 + Math.random() * 40],
          temp: [...prev.temp.slice(1), 30 + Math.random() * 10]
        }));
      }, 1000);

      // Trigger Silicon Agent Analysis
      updateAgentStatus('silicon', 'analyzing', 'فحص معمارية المعالج...');
      setTimeout(() => {
        updateAgentStatus('silicon', 'active', 'تم التعرف على المعالج: ' + (dev.chipsetGuess || 'Unknown'));
        addLog(`وكيل السيليكون: معمارية المعالج المكتشفة هي ${dev.chipsetGuess}`, 'agent', 'silicon');
      }, 2000);
    });

    hardwareBridge.onDisconnect(() => {
      setConnectedDevice(null);
      setTelemetry(prev => ({ ...prev, usbStatus: 'disconnected' }));
      addLog('تم قطع اتصال الجهاز الفيزيائي', 'warn');
      setAgents(AGENTS_INITIAL);
    });
  }, []);

  const updateAgentStatus = (id: OmniFixAgentId, status: OmniFixAgent['status'], task?: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status, activeTask: task } : a));
  };

  const handleConnectRequest = async () => {
    addLog('بانتظار اختيار الجهاز من المستخدم...', 'info');
    const res = await hardwareBridge.requestWebUsbDevice();
    if (res.success) {
      addLog('تم الاتصال بنجاح وتفعيل القنوات الآمنة.', 'success');
    } else {
      addLog('فشل الاتصال: ' + res.error, 'warn');
    }
  };

  const handleSovereignAction = async () => {
    if (activeAgentId === 'security_integrity') {
      const confirmed = await requestConsent({
        id: 'frp_unlock',
        actionTitle: 'تخطي حماية FRP (Factory Reset Protection)',
        description: 'سيقوم الوكيل بحقن ثغرة برمجية في منطقة الحماية لتجاوز قفل جوجل. هذه العملية حساسة وتتطلب تحكماً كاملاً بالذاكرة.',
        riskLevel: 'moderate',
        successProbability: 94,
        dataSafety: 'no_loss',
        steps: [
          'تحديد ثغرة الـ Bootrom المناسبة',
          'تعطيل حماية التوقيع الرقمي مؤقتاً',
          'تعديل قيمة الـ Config flag في البارتيشن الآمن',
          'إعادة التشغيل وتصفير عداد الحماية'
        ],
        requiredPermissions: ['usb', 'mem_write'],
        autoBackupDone: true
      });

      if (confirmed) {
        addLog('تم منح الإذن السيادي. بدء عملية التخطي...', 'info', 'security_integrity');
        updateAgentStatus('security_integrity', 'active', 'جاري حقن الثغرة...');
        setTimeout(() => {
          updateAgentStatus('security_integrity', 'active', 'تم تخطي الحماية بنجاح!');
          addLog('وكيل الأمان: تم تخطي حماية FRP بنجاح.', 'success', 'security_integrity');
        }, 3000);
      } else {
        addLog('تم إلغاء العملية من قبل المستخدم.', 'warn', 'security_integrity');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 font-['Cairo'] pb-12" dir="rtl">
      {/* Top Header & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
          
          {/* Connection Status Light Indicator */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full shadow-[0_0_8px] transition-all duration-300 ${
              telemetry.usbStatus === 'connected' ? 'bg-emerald-500 shadow-emerald-500 animate-pulse' : 
              telemetry.usbStatus === 'handshaking' ? 'bg-indigo-500 shadow-indigo-500 animate-bounce' : 
              'bg-slate-700 shadow-transparent'
            }`} />
            <span className={`text-[10px] font-black uppercase tracking-tighter ${
              telemetry.usbStatus === 'connected' ? 'text-emerald-400' : 
              telemetry.usbStatus === 'handshaking' ? 'text-indigo-400' : 
              'text-slate-500'
            }`}>
              {telemetry.usbStatus === 'connected' ? 'Physical Link: ACTIVE' : 
               telemetry.usbStatus === 'handshaking' ? 'Physical Link: SYNCING' : 
               'Physical Link: STANDBY'}
            </span>
          </div>

          <div className="flex items-center justify-between mb-6 mt-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl relative ${
                telemetry.usbStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400' : 
                telemetry.usbStatus === 'handshaking' ? 'bg-indigo-500/20 text-indigo-400 animate-pulse' :
                'bg-slate-800 text-slate-500'
              } transition-colors`}>
                {telemetry.usbStatus === 'connected' ? <Link className="w-6 h-6" /> : 
                 telemetry.usbStatus === 'handshaking' ? <Usb className="w-6 h-6" /> : 
                 <Link2Off className="w-6 h-6" />}
                
                {telemetry.usbStatus === 'connected' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  حالة الاتصال المباشر
                  {telemetry.usbStatus === 'connected' && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">نشط الآن</span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500">Universal Virtual Box Engine v4.0</p>
                  {connectedDevice && (
                    <>
                      <span className="text-slate-700">•</span>
                      <p className="text-xs text-indigo-400 font-bold">{connectedDevice.vendorName} {connectedDevice.productName}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={handleConnectRequest}
              className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                telemetry.usbStatus === 'connected' 
                ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/20'
              }`}
            >
              <Zap className="w-4 h-4" /> 
              {telemetry.usbStatus === 'connected' ? 'توصيل جهاز آخر' : 'توصيل جهاز حقيقي'}
            </button>
          </div>

          <AnimatePresence>
            {connectedDevice && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-6 p-4 rounded-2xl bg-indigo-600/5 border border-indigo-600/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-slate-500 font-black uppercase">Vendor ID</span>
                    <span className="text-xs font-mono text-indigo-300">0x{connectedDevice.vendorId.toString(16).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-slate-500 font-black uppercase">Product ID</span>
                    <span className="text-xs font-mono text-indigo-300">0x{connectedDevice.productId.toString(16).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-slate-500 font-black uppercase">Serial Number</span>
                    <span className="text-xs font-mono text-indigo-300 truncate max-w-[120px]">{connectedDevice.serialNumber || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-slate-500 font-black uppercase">Chipset / SoC</span>
                    <span className="text-xs font-bold text-emerald-400">{connectedDevice.chipsetGuess}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'الجهد (VCC)', value: `${telemetry.voltage}V`, icon: Activity, history: [80, 82, 81, 83, 82, 84, 82], color: 'bg-emerald-500' },
              { label: 'التيار (Amp)', value: `${telemetry.current}A`, icon: Zap, history: telemetryHistory.cpu, color: 'bg-indigo-500' },
              { label: 'الحرارة', value: `${telemetry.temperature}°C`, icon: Thermometer, history: telemetryHistory.temp, color: 'bg-amber-500' },
              { label: 'وضع الإقلاع', value: telemetry.bootMode.toUpperCase(), icon: Cpu, history: [100, 100, 100, 100, 100, 100, 100], color: 'bg-slate-700' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 flex flex-col gap-1 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <item.icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">{item.label}</span>
                  </div>
                  <MiniChart data={item.history} color={item.color} />
                </div>
                <div className="text-lg font-black text-white">{item.value}</div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Terminal className="w-4 h-4" /> سجل العمليات
          </h3>
          <div className="flex-1 overflow-y-auto max-h-[120px] space-y-2 scrollbar-none font-mono text-[10px]">
            {logs.length === 0 && <p className="text-slate-700 italic">بانتظار بدء العمليات...</p>}
            {logs.map((log, i) => (
              <div key={i} className={`p-2 rounded-lg border-r-2 ${
                log.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400' :
                log.type === 'warn' ? 'bg-amber-500/5 border-amber-500/30 text-amber-400' :
                log.type === 'agent' ? 'bg-indigo-500/5 border-indigo-500/30 text-indigo-400' :
                'bg-slate-800/30 border-slate-700 text-slate-400'
              }`}>
                {log.agent && <span className="font-bold ml-1">[{log.agent.toUpperCase()}]:</span>}
                {log.msg}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> مراقبة تدفق البيانات
            </h3>
            <div className="flex-1 overflow-y-auto max-h-[140px] space-y-1.5 scrollbar-none font-mono text-[9px]">
              {dataStream.length === 0 && <p className="text-slate-700 italic">لا يوجد تدفق بيانات حالي...</p>}
              {dataStream.map((stream, i) => (
                <div key={i} className="flex flex-col gap-1 p-2 rounded-lg bg-slate-900/40 border border-slate-800/50">
                  <div className="flex items-center justify-between text-[8px] opacity-60">
                    <span className="text-indigo-300">BAUD: {stream.baud}</span>
                    <span className="text-emerald-300">PROTO: {stream.proto}</span>
                    <span className="text-amber-300">PORT: {stream.port}</span>
                  </div>
                  <div className="text-slate-400 truncate">
                    <span className="text-slate-600 mr-1">[{stream.timestamp}]</span>
                    {stream.data}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hive Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map(agent => (
          <motion.div 
            key={agent.id}
            whileHover={{ y: -4 }}
            className={`p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden group ${
              activeAgentId === agent.id 
                ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-900/20' 
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => setActiveAgentId(agent.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${
                agent.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                agent.status === 'analyzing' ? 'bg-indigo-500/20 text-indigo-400 animate-pulse' :
                'bg-slate-800 text-slate-500'
              }`}>
                {agent.id === 'silicon' && <Microscope className="w-6 h-6" />}
                {agent.id === 'rf_baseband' && <Radio className="w-6 h-6" />}
                {agent.id === 'electronics' && <Thermometer className="w-6 h-6" />}
                {agent.id === 'security_integrity' && <ShieldAlert className="w-6 h-6" />}
              </div>
              <div className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                agent.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                agent.status === 'analyzing' ? 'bg-indigo-500/20 text-indigo-400' :
                'bg-slate-800 text-slate-500'
              }`}>
                {agent.status}
              </div>
            </div>
            
            <h3 className="text-lg font-black text-white mb-1">{agent.arabicName}</h3>
            <p className="text-[10px] text-slate-500 mb-4">{agent.specialization}</p>

            {agent.activeTask ? (
              <div className="mt-4 p-3 rounded-xl bg-indigo-600/10 border border-indigo-600/20">
                <p className="text-[10px] text-indigo-400 font-bold mb-1">المهمة الحالية:</p>
                <p className="text-[11px] text-indigo-200">{agent.activeTask}</p>
              </div>
            ) : (
              <div className="mt-4 opacity-40">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-700 w-0"></div>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-4 h-4 text-indigo-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Agent Content Workspace */}
      <div className="min-h-[400px] bg-slate-950 border border-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!activeAgentId ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center mb-6 border border-indigo-600/20">
                <Search className="w-10 h-10 text-indigo-400" />
              </div>
              <h4 className="text-2xl font-black text-white mb-2">بانتظار استدعاء وكيل</h4>
              <p className="text-slate-500 max-w-sm">قم باختيار أحد أسراب الوكلاء أعلاه للبدء في معالجة الجهاز أو تحليل البيانات الفيزيائية.</p>
            </motion.div>
          ) : (
            <motion.div 
              key={activeAgentId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-indigo-600/20 rounded-2xl text-indigo-400">
                    {activeAgentId === 'silicon' && <Microscope className="w-8 h-8" />}
                    {activeAgentId === 'rf_baseband' && <Radio className="w-8 h-8" />}
                    {activeAgentId === 'electronics' && <Thermometer className="w-8 h-8" />}
                    {activeAgentId === 'security_integrity' && <ShieldAlert className="w-8 h-8" />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">
                      {agents.find(a => a.id === activeAgentId)?.arabicName}
                    </h2>
                    <p className="text-slate-500 uppercase font-black text-xs tracking-widest">Autonomous Workspace</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 transition-all">
                    توليد تقرير التشخيص
                  </button>
                  <button 
                    onClick={handleSovereignAction}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20"
                  >
                    بدء المعالجة الذاتية
                  </button>
                </div>
              </div>

              {/* Agent Specific Workspace Content */}
              {activeAgentId === 'electronics' ? (
                <BoardViewStudio />
              ) : activeAgentId === 'silicon' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <SiliconDieViewer />
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
                      <h5 className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">تحليل المعالجة المركزية</h5>
                      <div className="space-y-4">
                        {[
                          { label: 'Instruction Set', value: 'ARMv9-A' },
                          { label: 'Secure Boot', value: 'Hardware RSA-4096' },
                          { label: 'Anti-Rollback', value: 'v4 (Active)' },
                          { label: 'Fusing Status', value: 'Production' }
                        ].map((stat, i) => (
                          <div key={i} className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                            <span className="text-xs text-slate-500">{stat.label}</span>
                            <span className="text-xs font-bold text-white font-mono">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800">
                      <h5 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" /> مصفوفة القدرات التنفيذية
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeAgentId === 'security_integrity' && (
                          <div className="md:col-span-3 p-6 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <ShieldAlert className="w-20 h-20" />
                            </div>
                            <h5 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-400" /> Neural Exploit Path Analysis
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              {[
                                { path: 'Bootrom Overlay', prob: 98.2, status: 'Vulnerable' },
                                { path: 'TEE TrustZone', prob: 12.4, status: 'Patched' },
                                { path: 'RPMB Replay', prob: 64.1, status: 'Exploitable' },
                                { path: 'Fuse Bypass', prob: 89.9, status: 'Vulnerable' }
                              ].map((p, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase">{p.path}</span>
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-black text-white">{p.prob}%</span>
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                                      p.status === 'Vulnerable' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                      p.status === 'Patched' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>{p.status}</span>
                                  </div>
                                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${p.prob}%` }}
                                      className={`h-full ${p.status === 'Vulnerable' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {activeAgentId === 'silicon' && [
                          'فك تشفير Bootrom', 'توليد Firehose Loader', 'تحليل Anti-Rollback', 'قراءة سجلات CPU'
                        ].map(t => (
                          <div key={t} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 transition-all group">
                            <CheckCircle2 className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-xs text-slate-300 font-bold">{t}</span>
                          </div>
                        ))}
                        {activeAgentId === 'security_integrity' && [
                          'تخطي FRP Lock', 'إصلاح Bootloop', 'فحص سلامة التقسيمات', 'توليد مفتاح أمان'
                        ].map(t => (
                          <div key={t} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-amber-500/30 transition-all group">
                            <Unlock className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                            <span className="text-xs text-slate-300 font-bold">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-600/10">
                      <h5 className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">تنبيهات المخاطر (Guard)</h5>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            يتطلب البدء في هذه العملية صلاحيات <span className="text-white font-bold">بوابة الموافقة السيادية</span> نظراً لحساسية البيانات.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
