import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  Zap, 
  RotateCcw, 
  Smartphone,
  Copy,
  Check
} from 'lucide-react';
import { DeviceInfo, ChatMessage } from '../types';
import { fetchWithAuth } from '../lib/api';

interface AiExpertChatProps {
  device: DeviceInfo;
}

export const AiExpertChat: React.FC<AiExpertChatProps> = ({ device }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `أهلاً بك! أنا (Mobile Repair AI Master Box) خبير الذكاء الاصطناعي المتخصص في صيانة وتشخيص أعطال الهواتف الذكية (سوفت وير وهارد وير) بخبرة تمتد لـ 25 عاماً 🤖✨

أنا متصل حالياً بسياق جهازك: **${device.brand} ${device.model}** (أندرويد ${device.androidVersion} - المعالج: ${device.chipset || 'غير محدد'}).

كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن:
- تشخيص أعطال الباور وتحديد المكون التالف (IC Power, CPU, eMMC).
- قراءة وتتبع مسارات المخططات (Schematics) ونقاط القياس (Test Points).
- حلول مشاكل الشبكة (Baseband, IMEI, 5G/VoLTE) وإصلاح المودم.
- تخطي حمايات FRP، Knox، و حسابات Mi/Huawei.
- إصلاح مشاكل الـ Bootloop واختيار ملفات الـ Firmware الصحيحة.`,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    `الجهاز ${device.brand} ${device.model} لا يقلع ويسحب 0.1 أمبير على الباور سبلاي، ما هو التشخيص؟`,
    'كيف أصلح مشكلة Bootloop بعد تفليش خاطئ وملف الـ Pit؟',
    'ما هي نقاط القياس ومسارات الفولت لـ IC الشحن (PMIC) لهذا الموديل؟',
    'كيف أقوم بتخطي حساب FRP باستخدام نقاط EDL (Test Point)؟',
    'الجهاز فقد السيريال (Null/Unknown Baseband)، ما هي خطوات استرجاع شبكة الـ 5G؟',
    'كيف أقرأ مسارات المخطط Schematic لمعرفة سبب تعطل الكاميرا؟',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetchWithAuth('/api/ai/expert-chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [...messages, userMsg],
          deviceContext: device,
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const botMsg: ChatMessage = {
          id: 'bot-' + Date.now(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: 'bot-err-' + Date.now(),
          role: 'assistant',
          content: data.error || 'عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي.',
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        role: 'assistant',
        content: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك والمحاولة مجدداً.',
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Phone Expert - المساعد الذكي المتخصص
          </div>
          <h2 className="text-xl font-bold text-white">
            مساعد <span className="text-cyan-400">AI Phone Expert</span> لتشخيص وصيانة الهواتف
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            مساعدك الذكي المتخصص في التعرف على الموديلات تلقائياً، تحليل سجلات الأخطاء، واقتراح خطط الإصلاح خطوة بخطوة مع توضيح مخاطر فقدان البيانات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>السياق: {device.brand} {device.model}</span>
          </span>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>أسئلة شائعة وسريعة لهذا الجهاز:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition text-right"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden">
        
        {/* Messages Container */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-sm'
                      : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-2 leading-relaxed shadow-sm ${
                    isBot
                      ? 'bg-slate-950/80 border border-slate-800 text-slate-200'
                      : 'bg-emerald-600/15 border border-emerald-500/30 text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="p-1 hover:text-slate-300 text-slate-500 rounded transition"
                        title="نسخ الرسالة"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-purple-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-300"></span>
                <span className="text-slate-400 mr-1">المهندس الذكي يقوم بصياغة الحل...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="اكتب سؤالك أو استفسارك حول تشخيص وصيانة جهازك هنا..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center justify-center shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
