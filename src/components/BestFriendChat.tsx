import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Send, 
  Sparkles, 
  Smile, 
  Lock, 
  Unlock, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Download, 
  Copy, 
  Check, 
  Search, 
  ShieldCheck, 
  Coffee, 
  MessageCircleHeart,
  Eye,
  EyeOff
} from 'lucide-react';
import { speakArabic, stopSpeaking, sounds } from '../utils/audio';

interface FriendMessage {
  id: string;
  sender: 'user' | 'friend';
  text: string;
  mood?: string;
  timestamp: string;
}

const DEFAULT_FRIEND_MESSAGES: FriendMessage[] = [
  {
    id: 'f-1',
    sender: 'friend',
    text: `يا هلا يا روح قلبي يا مريومة! 🌸 وحشتيني أوي يا بت يا قمر!
أنا صاحبتك وبير أسرارك اللي مقفول بمليون قفل 🔒
أي حاجة مزعلاكي، أي سر في قلبك، أي مشكلة في البيت أو مع صحباتك، أو حتى لو مخنوقة من المذاكرة وعايزة تطقي وتفضفضي.. ارمي كل همومك في حضني هنا.
محدش هيعرف كلمة من اللي بنقوله، وسرك في بير عميق يا حبيبة أحمد.. قوليلي حاسة بإيه دلوقتي يا روحي؟ ❤️`,
    timestamp: 'الآن',
    mood: 'حب وأمان'
  }
];

const QUICK_VENT_TOPICS = [
  { label: 'مخنوقة من المذاكرة والضغط 🥺', prompt: 'يا صاحبتي أنا مخنوقة وتعبانة جداً من المذاكرة وحاسة إني مش ملاحقة وخايفة أوي، طمنيني أعمل إيه؟' },
  { label: 'مشكلة وزعل مع واحدة صاحبتي 💔', prompt: 'عندي مشكلة وموقف ضايقني جداً من واحدة صاحبتي، وحاسة إني اتظلمت ومش عارفة أتصرف معاها إزاي.. انصحيني بجدعنة.' },
  { label: 'عندي سر ومحتارة أقول لمين 🤫', prompt: 'في سر وموضوع شاغل بالي أوي ومش عارفة أصارح بيه حد خالص، هحكيهولك عشان أنتي بير أسراري وانتي اللي هتفهميني.' },
  { label: 'حاسة بخوف وتوتر من الامتحانات 😰', prompt: 'قلقانة من امتحانات الشهادة الإعدادية وخايفة أنسى أو مقدرش أجيب المجموع اللي بفرح بيه أحمد وأهلي.' },
  { label: 'عايزة أتدلع وأسمع كلام حلو 👑', prompt: 'احكيلي شوية يا بت، دلعيني وفكريني أنا قد إيه غالية وشاطرة وحبيبة أحمد وكل حاجة في حياته!' },
  { label: 'مشكلة سوء تفاهم في البيت 🏠', prompt: 'مضغوطة من أسلوب الكلام والزن في البيت ومش عارفين يفهموا إني بعمل اللي عليا.. إزاي أهدي الجو؟' }
];

export const BestFriendChat: React.FC = () => {
  const [messages, setMessages] = useState<FriendMessage[]>(() => {
    const saved = localStorage.getItem('maryam_best_friend_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_FRIEND_MESSAGES;
      }
    }
    return DEFAULT_FRIEND_MESSAGES;
  });

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>('فضفضة من القلب');
  const [isPrivacyHidden, setIsPrivacyHidden] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Persist messages
  useEffect(() => {
    localStorage.setItem('maryam_best_friend_messages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: FriendMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      mood: selectedMood,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/friend/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          mood: selectedMood,
          history: messages.slice(-5).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await res.json();
      const reply = data.reply || `يا بت يا مريومة يا قمر أحمد! أنا سمعاكي وحاسة بكل كلمة قولتيها.. متشيليش هم أبداً يا روحي، كل مشكلة وليها مية حل، وأنا وأحمد في ضهرك ومعاكي خطوة بخطوة ❤️`;

      const friendMsg: FriendMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'friend',
        text: reply,
        mood: selectedMood,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, friendMsg]);
      sounds.playSuccess();
    } catch {
      const fallbackMsg: FriendMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'friend',
        text: `يا روحي يا مريومة، أنا جنبك وسامعاكِ.. فضفضي على مهلك، كل زعلك ده يهون ومفيش حاجة تستاهل دموعك ولا ضيقتك، أنتي أميرة أحمد وسرك معايا في أمان تام 🌸`,
        mood: selectedMood,
        timestamp: 'الآن'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeech = (msg: FriendMessage) => {
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
    if (confirm('هل ترغبين في مسح أسرار هذه المحادثة والبدء من جديد يا مريومة؟')) {
      stopSpeaking();
      setMessages(DEFAULT_FRIEND_MESSAGES);
      sounds.playSuccess();
    }
  };

  const exportSecrets = () => {
    const text = messages.map(m => `[${m.timestamp}] ${m.sender === 'user' ? 'مريم' : 'صاحبة مريومة'}:\n${m.text}\n-------------------------`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `أسرار_وفضفضة_مريومة.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    sounds.playSuccess();
  };

  const filteredMessages = messages.filter(m => 
    !searchQuery.trim() || m.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-3xl border border-pink-200 shadow-sm overflow-hidden">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shadow-inner">
              👭
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base md:text-lg">صاحبة مريومة • بير أسرارك الخاص 🔒</h2>
              <span className="bg-white/20 backdrop-blur-xs text-[10px] font-black px-2 py-0.5 rounded-full border border-white/30">
                سرّي ومحفوظ 100%
              </span>
            </div>
            <p className="text-xs text-pink-100 font-medium">
              فضفضي، احكي أسرارك ومشاكلك، وهنحل كل حاجة سوا بالحب والجدعنة المصرية 🌸
            </p>
          </div>
        </div>

        {/* Action Controls: Privacy Hide, Search, Export, Clear */}
        <div className="flex items-center gap-2">
          {/* Quick Privacy Blur/Hide Button */}
          <button
            onClick={() => setIsPrivacyHidden(!isPrivacyHidden)}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              isPrivacyHidden ? 'bg-amber-400 text-slate-900 shadow-sm' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="إخفاء أو تمويه الشات في حالة وجود أحد بجانبك"
          >
            {isPrivacyHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPrivacyHidden ? 'إظهار الشات' : 'قفل الخصوصية'}</span>
          </button>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              showSearch ? 'bg-white text-rose-600' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="البحث في الأسرار السابقة"
          >
            <Search className="w-3.5 h-3.5" />
            <span>بحث</span>
          </button>

          <button
            onClick={exportSecrets}
            className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl font-bold transition cursor-pointer"
            title="حفظ أسرارك في ملف على جهازك"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تصدير</span>
          </button>

          <button
            onClick={clearChat}
            className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-pink-100 hover:text-white px-2.5 py-1.5 rounded-xl transition cursor-pointer"
            title="مسح كل الأسرار وبدء صفحة جديدة"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Drawer */}
      {showSearch && (
        <div className="bg-pink-50 p-3 border-b border-pink-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-pink-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحثي في أي سر أو كلام حكيتيه لصاحبتك..."
            className="flex-1 bg-white border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-pink-500 font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-pink-600 font-bold px-2">
              مسح
            </button>
          )}
        </div>
      )}

      {/* Mood Selector Tag Bar */}
      <div className="bg-pink-50/60 px-4 py-2 border-b border-pink-100 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-pink-800 font-black shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          حالتك دلوقتي:
        </span>
        {[
          'فضفضة من القلب',
          'مخنوقة ومحتاجة حل',
          'سر خطير أوي 🤫',
          'زعلانة من صحباتي',
          'متوترة من الامتحانات',
          'فرحانة ومبسوطة 💃',
          'حب أحمد ودلعه ❤️'
        ].map(m => (
          <button
            key={m}
            onClick={() => setSelectedMood(m)}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer text-xs ${
              selectedMood === m
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-pink-100 border border-pink-200/60'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div 
        className={`flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-pink-50/20 via-white to-rose-50/20 transition-all ${
          isPrivacyHidden ? 'filter blur-md select-none pointer-events-none' : ''
        }`}
      >
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            لم يتم العثور على أسرار تطابق بحثك.
          </div>
        ) : (
          filteredMessages.map((m) => {
            const isUser = m.sender === 'user';
            const isSpeakingThis = speakingMsgId === m.id;

            return (
              <div
                key={m.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white'
                      : 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white'
                  }`}
                >
                  {isUser ? '👑' : '👭'}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 shadow-xs relative text-xs md:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white rounded-tr-none'
                      : 'bg-white border border-pink-100 text-slate-800 rounded-tl-none shadow-pink-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-black/5 text-[10px] opacity-80 font-bold">
                    <span>{isUser ? 'مريم (ريموا القمر)' : 'صاحبة مريومة الوفية'}</span>
                    <span>{m.timestamp}</span>
                  </div>

                  {/* Body Text */}
                  <div className="whitespace-pre-line font-medium leading-relaxed">
                    {m.text}
                  </div>

                  {/* Action icons for friend responses */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-pink-100/70 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleSpeech(m)}
                          className={`p-1 rounded-lg hover:bg-pink-50 transition cursor-pointer text-pink-600 ${
                            isSpeakingThis ? 'text-rose-600 animate-pulse bg-rose-50' : ''
                          }`}
                          title="اسمعي صوت صاحبتك"
                        >
                          {isSpeakingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopy(m.id, m.text)}
                          className="p-1 rounded-lg hover:bg-pink-50 transition cursor-pointer text-slate-500 hover:text-pink-600"
                          title="نسخ الرد"
                        >
                          {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                        <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                        <span>أختك وصاحبتك دايماً</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 items-center text-slate-500 text-xs">
            <div className="w-9 h-9 rounded-2xl bg-pink-500 text-white flex items-center justify-center text-sm shadow-xs">
              👭
            </div>
            <div className="bg-white border border-pink-100 rounded-2xl px-4 py-2.5 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
              <span className="font-bold text-pink-600">صاحبتك بتسمعك وبتكتبلك حل يريح قلبك... 💖</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2.5 bg-pink-50/50 border-t border-pink-100">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-black text-pink-800 shrink-0">فضفضي بضغطة:</span>
          {QUICK_VENT_TOPICS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              disabled={isLoading}
              className="bg-white hover:bg-pink-100 border border-pink-200 text-slate-700 hover:text-pink-800 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-pink-100 flex items-center gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="احكيلي يا مريومة أي سر أو مشكلة مأثرة فيكي.. بير أسرارك مفتوح ليكي دايماً 🌸"
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-pink-400 focus:bg-white rounded-2xl px-4 py-2.5 text-xs md:text-sm text-slate-800 focus:outline-none resize-none font-medium transition"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isLoading}
          className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 text-white font-black px-4 py-2.5 rounded-2xl text-xs md:text-sm transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-pink-200 shrink-0"
        >
          <Send className="w-4 h-4 rtl:rotate-180" />
          <span>فضفضي</span>
        </button>
      </div>
    </div>
  );
};
