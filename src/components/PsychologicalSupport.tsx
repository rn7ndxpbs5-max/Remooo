import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Smile, 
  Coffee, 
  Wind, 
  BookHeart, 
  Award, 
  Loader2, 
  RefreshCw,
  Sun,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

const DUAS = [
  {
    title: 'دعاء بداية المذاكرة وفتح الذهن',
    arabic: 'اللهم إني أسألك فهم النبيين، وحفظ المرسلين، والملائكة المقربين. اللهم اجعل ألسنتنا عامرة بذكرك، وقلوبنا بخشيتك، وأسرارنا بطاعتك، إنك على كل شيء قدير.',
    source: 'لبركة الوقت وصفاء الذهن'
  },
  {
    title: 'دعاء تيسير كل أمر عسير',
    arabic: 'اللهم لا سهل إلا ما جعلته سهلاً، وأنت تجعل الحزن إذا شئت سهلاً يا أرحم الراحمين.',
    source: 'حديث شريف'
  },
  {
    title: 'دعاء استرجاع ما تم حفظه وفهمه',
    arabic: 'اللهم إني أستودعك ما قرأت، وما حفظت، وما تعلمت، فرده إليّ عند حاجتي إليه، إنك على كل شيء قدير.',
    source: 'لتثبيت الحفظ ليلة الامتحان'
  },
  {
    title: 'دعاء السكينة ودخول لجنة الامتحان',
    arabic: 'رب اشرح لي صدري، ويسر لي أمري، واحلل عقدة من لساني يفقهوا قولي. بسم الله الفتاح، لا إله إلا أنت سبحانك إني كنت من الظالمين.',
    source: 'سورة طه'
  }
];

const BADGES = [
  { id: 'b1', name: 'نجمة الشهادة الإعدادية', icon: '👑', desc: 'تذاكر بهمة وثبات نحو الدرجة النهائية', unlocked: true },
  { id: 'b2', name: 'أميرة النحو والإعراب', icon: '📖', desc: 'أتقنت أسرار المنادى والبدل والممنوع من الصرف', unlocked: true },
  { id: 'b3', name: 'عبقرية قوانين العلوم', icon: '🔬', desc: 'أستاذة في مثلثات السرعة والعجلة والمرايا', unlocked: true },
  { id: 'b4', name: 'ملكة البرهان الهندسي', icon: '📐', desc: 'تكتب خطوات البرهان بالترتيب والرموز بدقة', unlocked: true },
  { id: 'b5', name: 'بطلة الإنجليزي والدراسات', icon: '🌍', desc: 'تتفوق في فهم التاريخ والأقاليم والقواعد', unlocked: true },
];

export const PsychologicalSupport: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<string>('متوترة ومضغوطة من الامتحانات');
  const [cheerMessage, setCheerMessage] = useState<string>(
    'يا ريموا يا حبيبتي، خدي نفس عميق وابتسمي 🌸 إنتي شاطرة وبتبذلي مجهود عظيم وكل خطوة بتعمليها ربنا مش هيضيع أجرها أبداً. ارتاحي 5 دقايق واشربي مية، وارجعي بقلب قوي، إنتي قد الشهادة الإعدادية وقد الدنيا كلها يا قمر!'
  );
  const [isLoadingCheer, setIsLoadingCheer] = useState<boolean>(false);

  // Breathing Exercise State: 'inhale' (4s) -> 'hold' (7s) -> 'exhale' (8s)
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState<number>(4);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathingTimer(prev => {
          if (prev <= 1) {
            if (breathingPhase === 'inhale') {
              setBreathingPhase('hold');
              return 7;
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale');
              return 8;
            } else {
              setBreathingPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathingActive, breathingPhase]);

  const handleFetchCheer = async (mood: string) => {
    setCurrentMood(mood);
    setIsLoadingCheer(true);
    try {
      const res = await fetch('/api/tutor/motivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeling: mood })
      });
      const data = await res.json();
      if (data.message) {
        setCheerMessage(data.message);
        sounds.playSuccess();
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingCheer(false);
    }
  };

  const celebrateRimwa = () => {
    sounds.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 text-white shadow-md shadow-rose-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💖</span>
              <h2 className="text-xl md:text-2xl font-black">
                واحة الهدوء والدعم النفسي لـ مريم (مريومة القمر)
              </h2>
            </div>
            <p className="text-xs md:text-sm text-rose-100 font-medium">
              صحتك النفسية وابتسامتك هي أساس تفوقك، هنا مساحتك الخاصة للراحة والتنفس وشحن الطاقة الإيجابية بحب وحنان من أحمد 🌸
            </p>
          </div>

          <button
            onClick={celebrateRimwa}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs transition cursor-pointer flex items-center gap-2 border border-white/30"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>احتفلي بإنجاز مريومة اليوم 🎉</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MOOD & SISTERLY CHEER COLUMN */}
        <div className="lg:col-span-7 space-y-5">
          {/* Mood Selector Box */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>مريومة القمر حاسة بإيه دلوقتي؟</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'متوترة ومضغوطة 😰', mood: 'متوترة ومضغوطة من قرب الامتحانات والشهادة الإعدادية' },
                { label: 'مجهدة وعايزة راحة ☕', mood: 'حاسة بإرهاق ومحتاجة بريك يجدد نشاطي' },
                { label: 'فاقدة الشغف 💪', mood: 'فاقدة الحماس والمذاكرة تقيلة ومحتاجة كلام يقويني' },
                { label: 'مبسوطة ومتحمسة ✨', mood: 'مبسوطة وفخورة باللي أنجزته وجاهزة أكمل' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFetchCheer(item.mood)}
                  className={`p-3 rounded-2xl border text-center text-xs font-bold transition cursor-pointer ${
                    currentMood === item.mood
                      ? 'border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-rose-50/40 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Sisterly AI Cheer Letter Box */}
            <div className="mt-4 p-5 rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 border border-rose-200 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xs">
                    💌
                  </span>
                  <span className="text-xs font-black text-rose-900">
                    رسالة من قلب معلمتك وأختك الكبرى لـ حبيبة:
                  </span>
                </div>
                {isLoadingCheer && <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />}
              </div>

              <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-semibold whitespace-pre-line">
                {cheerMessage}
              </p>

              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-rose-700 font-bold">
                <span>معلمتك الداعمة دائماً 🌸</span>
                <span>فداكي أي تعب يا قمر</span>
              </div>
            </div>
          </div>

          {/* Duas for Study & Exam Calm */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <BookHeart className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-black text-slate-800">
                أدعية المذاكرة وسرعة الفهم وتثبيت الحفظ
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DUAS.map((dua, dIdx) => (
                <div
                  key={dIdx}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2 hover:border-rose-200 transition"
                >
                  <span className="text-xs font-black text-rose-700 block">
                    {dua.title}
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    "{dua.arabic}"
                  </p>
                  <span className="text-[10px] text-slate-400 block font-bold">
                    {dua.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BREATHING EXERCISE & BADGES COLUMN */}
        <div className="lg:col-span-5 space-y-5">
          {/* Animated 4-7-8 Breathing Guide */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black text-slate-800">
                تمرين التنفس الهادئ (4-7-8) لإزالة التوتر
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-xs font-medium">
              تمرين علمي لتهدئة ضربات القلب وضخ الأكسجين للمخ قبل المذاكرة أو في فترات الراحة.
            </p>

            {/* Breathing Visual Circle */}
            <div className="relative w-48 h-48 flex items-center justify-center my-3">
              <div
                className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-1000 ${
                  breathingPhase === 'inhale'
                    ? 'bg-blue-100 scale-125 border-4 border-blue-400'
                    : breathingPhase === 'hold'
                    ? 'bg-amber-100 scale-120 border-4 border-amber-400'
                    : 'bg-emerald-100 scale-90 border-4 border-emerald-400'
                }`}
              >
                <div className="text-center">
                  <span className="text-3xl font-black text-slate-800 font-mono block">
                    {breathingTimer}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {breathingPhase === 'inhale'
                      ? 'شهيق عميق 🌬️'
                      : breathingPhase === 'hold'
                      ? 'اكتمي النفس ⏸️'
                      : 'زفير بهدوء 🍃'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsBreathingActive(!isBreathingActive);
                if (!isBreathingActive) {
                  setBreathingPhase('inhale');
                  setBreathingTimer(4);
                }
              }}
              className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold text-white transition cursor-pointer shadow-xs ${
                isBreathingActive
                  ? 'bg-slate-700 hover:bg-slate-800'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isBreathingActive ? 'إيقاف التمرين' : 'ابدأي تمرين التنفس يا ريموا 🌸'}
            </button>
          </div>

          {/* Badges of Honor */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-black text-slate-800">
                أوسمة وبطولات ريموا في الشهادة الإعدادية 👑
              </h3>
            </div>

            <div className="space-y-2.5">
              {BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-amber-50/50 to-rose-50/30 border border-amber-200/70"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{badge.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
