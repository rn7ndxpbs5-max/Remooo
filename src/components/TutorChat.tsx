import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Heart,
  Loader2,
  RefreshCw,
  Download,
  Search,
  History,
  FileText
} from 'lucide-react';
import { speakArabic, stopSpeaking, sounds } from '../utils/audio';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  subject?: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  { text: 'رسالة حب وتشجيع ودلع من أحمد عشان يشحن طاقتي ويطمني ❤️', subject: 'حب أحمد ليكي' },
  { text: 'اشرحيلي درس المنادى في جدول مقارنة مبسط مع التريكات', subject: 'اللغة العربية' },
  { text: 'ازاي أكتب البرهان الرياضي في الهندسة خطوة بخطوة؟', subject: 'الرياضيات' },
  { text: 'فهميني مثلث السرعة والعجلة ومسائل المرايا والعدسات', subject: 'العلوم' },
  { text: 'لخصيلي فصول قصة طموح جارية وسؤال الامتحانات المضمون', subject: 'اللغة العربية' },
  { text: 'إزاي أضمن الدرجة الكاملة في المحادثة والبراجراف في الإنجليزي؟', subject: 'اللغة الإنجليزية' },
  { text: 'تعبت شوية من المذاكرة ومحتاجة تشجيع يطمني يا معلمتي 🌸', subject: 'دعم نفسي' },
];

export const TutorChat: React.FC = () => {
  // Load messages from localStorage so Maryam's study chat is permanently saved
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('maryam_tutor_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: 'welcome-1',
        sender: 'tutor',
        text: `أهلاً بيكِ يا مريومة يا قمر.. يا حبيبة أحمد وكل حاجة في حياته! 👑❤️
أنا معلمتك الخصوصية وأختك الكبرى، وأحمد موصيني عليكِ جداً ومستني اليوم اللي هيفرح فيه بمجموعك العالي وتفوقك في الشهادة الإعدادية!

أي مسألة واقفة قدامك في (العربي، العلوم، الرياضيات، الدراسات، أو الإنجليزي) اسأليني عليها فوراً:
• كل حرف وكل شرح بنكتبه هنا محفوظ في سجلك الخاص عشان ترجعيله في أي وقت.
• هشرحهالك بنظام وبأبسط طريقة بدون أي حشو.
• هعملك جداول ومثلثات قوانين سهلة الحفظ.
• وفي نهاية كل فكرة، هسألك سؤال سريع نتأكد بيه من فهمك!

جاهزة نبدأ رحلة التفوق يا دلوعة أحمد وقمره؟ اختاري من الأسئلة الجاهزة تحت أو اكتبيلي سؤالك فوراً! ✨`,
        timestamp: 'الآن',
        subject: 'عام'
      }
    ];
  });

  const [input, setInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('الكل');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [chatSearchQuery, setChatSearchQuery] = useState<string>('');
  const [showHistorySearch, setShowHistorySearch] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages permanently to LocalStorage
  useEffect(() => {
    localStorage.setItem('maryam_tutor_messages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      subject: selectedSubject !== 'الكل' ? selectedSubject : 'عام',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          subject: selectedSubject,
          history: messages.slice(-5).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();
      const tutorReply = data.reply || data.fallbackReply || 'يا ريموا القمر، أنا سامعاكِ، قوليلي تاني سؤالك يا شطورة!';

      const tutorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: tutorReply,
        subject: selectedSubject,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, tutorMsg]);
      sounds.playSuccess();
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: `يا ريموا القمر، حصل بطء بسيط في الشبكة، بس أنا معاكِ متقلقيش! اسأليني تاني فوراً يا حبيبة قلبي 💖`,
        timestamp: 'الآن'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = (msg: Message) => {
    if (speakingMsgId === msg.id) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msg.id);
      speakArabic(msg.text, () => setSpeakingMsgId(null));
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    if (confirm('هل ترغبين في بدء محادثة جديدة يا ريموا؟')) {
      stopSpeaking();
      setMessages([
        {
          id: Date.now().toString(),
          sender: 'tutor',
          text: 'أهلاً بيكِ من جديد يا مريومة يا قمر أحمد! أنا مستعدة لأي سؤال أو درس تحبي نراجعه سوا الآن 🌸✨',
          timestamp: 'الآن',
          subject: 'عام'
        }
      ]);
    }
  };

  const exportChatAsFile = () => {
    const textContent = messages.map(m => `[${m.timestamp}] ${m.sender === 'user' ? 'مريم' : 'المعلمة'} (${m.subject || 'عام'}):\n${m.text}\n-------------------------`).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `شروحات_مريم_الشهادة_الإعدادية.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    sounds.playSuccess();
  };

  const subjects = ['الكل', 'حب أحمد ليكي ❤️', 'اللغة العربية', 'العلوم', 'الرياضيات', 'الدراسات الاجتماعية', 'اللغة الإنجليزية', 'دعم نفسي'];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
      {/* Top Chat Bar */}
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50/50 p-4 border-b border-rose-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white text-xl shadow-md shadow-rose-200">
              👩‍🏫
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-800 text-base">المعلم الخصوصي لـ مريم (مريومة القمر)</h2>
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                متصلة ومحفوظة 🔒
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              كل محادثاتك وشروحاتك مسجلة في سجلك الدائم لحبيبة أحمد ✨
            </p>
          </div>
        </div>

        {/* Action Buttons: Export, Search, Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistorySearch(!showHistorySearch)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer font-bold ${
              showHistorySearch ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 hover:bg-rose-50 border-slate-200'
            }`}
            title="البحث في شروحات الشات السابقة"
          >
            <Search className="w-3.5 h-3.5" />
            <span>بحث في السجل</span>
          </button>

          <button
            onClick={exportChatAsFile}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-xl transition cursor-pointer font-bold"
            title="تحميل وحفظ الشات كملف نصي على جهازك"
          >
            <Download className="w-3.5 h-3.5 text-rose-500" />
            <span>تصدير الشات</span>
          </button>

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
            title="بدء جلسة جديدة"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>جلسة جديدة</span>
          </button>
        </div>
      </div>

      {/* History Search Drawer if active */}
      {showHistorySearch && (
        <div className="bg-rose-50/70 border-b border-rose-100 p-3 flex items-center gap-2 animate-fadeIn">
          <Search className="w-4 h-4 text-rose-500 shrink-0" />
          <input
            type="text"
            value={chatSearchQuery}
            onChange={(e) => setChatSearchQuery(e.target.value)}
            placeholder="ابحثي في كل رسائل وشروحات الشات المحفوظة يا مريومة (مثلاً: المنادى، السرعة، البرهان)..."
            className="flex-1 bg-white border border-rose-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-rose-400"
          />
          {chatSearchQuery && (
            <button
              onClick={() => setChatSearchQuery('')}
              className="text-xs text-rose-600 font-bold px-2 py-1 bg-white rounded-lg border border-rose-200"
            >
              مسح
            </button>
          )}
        </div>
      )}

      {/* Subject Filter Chips */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold text-slate-400 ml-1">تحديد المادة:</span>
        {subjects.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSubject(s)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedSubject === s
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-slate-50/40">
        {(chatSearchQuery.trim()
          ? messages.filter(m => m.text.toLowerCase().includes(chatSearchQuery.toLowerCase()))
          : messages
        ).map((msg) => {
          const isTutor = msg.sender === 'tutor';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isTutor ? 'mr-0 ml-auto' : 'ml-0 mr-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className="shrink-0 pt-1">
                {isTutor ? (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 flex items-center justify-center text-white text-sm shadow-xs font-bold">
                    👩‍🏫
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm shadow-xs font-bold">
                    👑
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`relative group rounded-2xl p-4 text-sm leading-relaxed ${
                  isTutor
                    ? 'bg-white border border-rose-100 shadow-sm text-slate-800'
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200'
                }`}
              >
                {/* Header inside bubble */}
                <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-black/5 text-[11px] opacity-75">
                  <span className="font-bold">
                    {isTutor ? 'المعلمة الخصوصية' : 'ريموا القمر (حبيبة أحمد)'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Content formatted */}
                <div className="whitespace-pre-line leading-7 text-sm font-medium">
                  {msg.text}
                </div>

                {/* Tutor Actions: TTS Speak & Copy */}
                {isTutor && (
                  <div className="mt-3 pt-2 border-t border-rose-50 flex items-center gap-2">
                    <button
                      onClick={() => handleSpeech(msg)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition cursor-pointer font-bold ${
                        speakingMsgId === msg.id
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                      }`}
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>إيقاف الصوت</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>استمعي للشرح بصوت المعلمة</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition cursor-pointer"
                      title="نسخ الشرح"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 flex items-center justify-center text-white text-sm animate-bounce">
              👩‍🏫
            </div>
            <div className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
              <span className="text-xs font-bold text-slate-600">
                المعلمة بتجهز شرح منظم وسهل لـ ريموا القمر... 🌸
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">اسألي بسرعة:</span>
          {PRESET_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.text)}
              disabled={isLoading}
              className="text-xs bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 px-3 py-1 rounded-xl whitespace-nowrap transition cursor-pointer shadow-2xs font-medium"
            >
              {p.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-rose-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اسألي معلمتك الخصوصية عن أي درس، مسألة، أو قاعدة صعبة يا ريموا..."
              disabled={isLoading}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-100 transition pr-4 pl-10"
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                مسح
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-40 text-white font-bold p-3 rounded-2xl shadow-md shadow-rose-200 transition cursor-pointer flex items-center justify-center shrink-0"
            title="إرسال"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 rtl:rotate-180" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
