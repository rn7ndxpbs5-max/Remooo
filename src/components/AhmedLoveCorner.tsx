import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Send, 
  Volume2, 
  VolumeX, 
  Crown, 
  Flame, 
  Gift, 
  Smile, 
  Star, 
  MessageSquareHeart,
  Loader2,
  RefreshCw,
  Sun
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakArabic, stopSpeaking, sounds } from '../utils/audio';

const AHMED_NICKNAMES = [
  { title: 'روح قلب أحمد ❤️', desc: 'إنتي النفس اللي طالع ونازل في صدر أحمد، ومفيش حد يملى عينه غيرك!' },
  { title: 'حبيبة أحمد وكل دنيته 👑', desc: 'كل خطوة أحمد بيخطيها في حياته بتكون عشان يفرح قلبك ويشوف ابتسامتك.' },
  { title: 'قمر أحمد ونور عيونه 🌙', desc: 'القمر في السما وأنتي قمر أحمد اللي منورله أيامه وحياته كلها.' },
  { title: 'وتين أحمد وسر ضحكته 💖', desc: 'الوتين هو الشريان المتصل بالقلب، وأنتي شريان الحياة لأحمد.' },
  { title: 'دلوعة أحمد وأميرته 🌸', desc: 'تدللي براحتك واطلبي اللي تحبيه، أنتي أميرة قلبه وعرشه.' },
  { title: 'أشطر دكتورة وبطلة في عين أحمد ✨', desc: 'أحمد واثق في ذكائك ومجموعك في الشهادة الإعدادية أكتر من أي حد في الدنيا!' },
];

const REASONS_AHMED_LOVES_RIMWA = [
  'ضحكتك الصافية اللي بتنور يوم أحمد وتنسيه أي هم أو تعب في ثانية واحدة.',
  'عينيكي اللي لما أحمد بيبصلهم بيحس بأمان وراحة ملقاهاش في أي مكان تاني.',
  'إصرارك وشطارتك في المذاكرة وطيبتك اللي مفيش أرق منها في العالم.',
  'لأنك أحلى وأغلى رزق ربنا بعته لأحمد في حياته كلها.',
  'عشان أنتي مش بس حبيبة أحمد.. أنتي كل حاجة، أهله وصاحبته وعالمه الجميل.',
  'لأنك مصدر فخره، وكل ما حد يجيب سيرتك قلبه بيدق بفرحة وفخر بيكِ.'
];

export const AhmedLoveCorner: React.FC = () => {
  const [selectedLetterOccasion, setSelectedLetterOccasion] = useState<string>('تشجيع ودلع في المذاكرة');
  const [ahmedLetter, setAhmedLetter] = useState<string>(
    `يا مريومة يا روح قلب أحمد ونور عيونه ودلوعته.. ❤️
عارفة يا مريم، إنتي مش مجرد حبيبة، إنتي كل حاجة حلوة في حياتي، وضحكتك دي هي اللي بتنورلي الدنيا كلها!
شايف تعبك وسهرك ومذاكرتك للشهادة الإعدادية، وفخور بيكِ فوق ما تتخيلي يا مريومة. إنتي أذكى وأشطر وأجمل بنت في الكون، ومفيش أي امتحان في الدنيا يقدر يقف قدام شطارتك وطاقتك.
أنا واقف في ضهرك دايماً وبدعيلك في كل صلاة، ومستني اليوم اللي هشوف فيه اسمك من أوائل المحافظة ونسقفلك كلنا ونفرح بيكِ.
بحبك قد الدنيا كلها يا مريم يا حبيبة أحمد وقمره، ويلا ركزي وابتسمي عشان ابتسامتك دي عندي بالدنيا وما فيها! 🌸👑`
  );
  const [currentNickname, setCurrentNickname] = useState<string>('مريم روح قلب وعيون أحمد');
  const [isLoadingLetter, setIsLoadingLetter] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [customOccasionInput, setCustomOccasionInput] = useState<string>('');

  const fetchAhmedLetter = async (occasion: string) => {
    setSelectedLetterOccasion(occasion);
    setIsLoadingLetter(true);
    try {
      const res = await fetch('/api/tutor/ahmed-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion })
      });
      const data = await res.json();
      if (data.letter) {
        setAhmedLetter(data.letter);
        if (data.nickname) setCurrentNickname(data.nickname);
        sounds.playSuccess();
        triggerLoveConfetti();
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingLetter(false);
    }
  };

  const triggerLoveConfetti = () => {
    sounds.playSuccess();
    confetti({
      particleCount: 100,
      spread: 80,
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#f59e0b'],
      origin: { y: 0.6 }
    });
  };

  const toggleSpeakLetter = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakArabic(ahmedLetter, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Romantic Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 p-6 md:p-8 text-white shadow-lg shadow-rose-200">
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black mb-3 border border-white/30">
              <Heart className="w-3.5 h-3.5 fill-rose-200 text-rose-200" />
              <span>حب أحمد ليكي • كل حاجة في حياة أحمد</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
              حبيبة أحمد وقمره وروح قلبه ❤️
            </h2>
            <p className="text-xs md:text-sm text-rose-100 max-w-2xl mt-2 font-medium leading-relaxed">
              هنا مكانك الخاص جداً يا ريموا، المكان اللي بيفكرك إن في قلب عايش عشانك، وفخور بيكِ، وبيحبك حب ملوش نهاية.. أحمد واقف جنبك وواثق في تفوقك في الشهادة الإعدادية! 🌸
            </p>
          </div>

          <button
            onClick={triggerLoveConfetti}
            className="bg-white hover:bg-rose-50 text-rose-600 font-black px-5 py-3 rounded-2xl text-xs md:text-sm transition cursor-pointer flex items-center gap-2 shadow-md shrink-0 border border-white"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>أحمد بيبعتلك قلوب وحب 💖</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AHMED'S LOVE LETTERS & INSTANT PAMPERING (Col 7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Love Letter Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-rose-200 shadow-sm space-y-4 relative">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  💌
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">
                    رسالة خاصة من أحمد لـ ريموا القمر
                  </h3>
                  <span className="text-[11px] font-bold text-rose-600">
                    لقب أحمد ليكي: {currentNickname}
                  </span>
                </div>
              </div>

              {/* TTS Listen Button */}
              <button
                onClick={toggleSpeakLetter}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  isSpeaking
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>إيقاف القراءة</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>اسمعي كلام أحمد بصوت دافئ</span>
                  </>
                )}
              </button>
            </div>

            {/* Letter Content Styled as an Elegant Note */}
            <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-rose-50/70 via-pink-50/40 to-amber-50/30 border border-rose-200/80 text-slate-800 space-y-3 relative">
              <div className="text-xs font-black text-rose-700 flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>من: أحمد | إلى: ريموا القمر حبيبة أحمد وكل حياته</span>
              </div>

              {isLoadingLetter ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-rose-500">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-bold">أحمد بيكتبلك رسالة من قلبه دلوقتي يا ريموا... 💖</span>
                </div>
              ) : (
                <p className="text-xs md:text-sm leading-relaxed font-semibold whitespace-pre-line text-slate-800">
                  {ahmedLetter}
                </p>
              )}

              <div className="pt-3 border-t border-rose-200/50 flex items-center justify-between text-[11px] font-extrabold text-rose-600">
                <span>أحمد بيحبك أكتر من أي حاجة في الدنيا ❤️</span>
                <span>وعد وعهد للأبد 💍</span>
              </div>
            </div>

            {/* Quick Letter Situations Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-slate-500 block">
                عايزة تسمعي كلام أحمد في أي وقت؟ اختاري المناسبة:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: 'لما تزهقي من المذاكرة ☕', occasion: 'ريموا تعبت من المذاكرة ومحتاجة كلام يدلعها ويشجعها ترتاح شوية وترجع بقوة' },
                  { label: 'لما توحشيه وتشتاقي له 🥺', occasion: 'ريموا اشتاقت لأحمد ومحتاجة تحس بوجوده وحبه الشديد واهتمامه بيها' },
                  { label: 'لما تتوتر من الامتحانات 🌸', occasion: 'ريموا خايفة من امتحانات الإعدادية وأحمد بيهديها وبيطمنها أنه في ضهرها' },
                  { label: 'دلع وغزل أحمد ليكي 💖', occasion: 'أحمد بيدلع ريموا بأحلى كلام حب وغزل مصري دافئ من قلبه' },
                  { label: 'احتفال بإنجاز ومجموع ✨', occasion: 'أحمد فخور بحل ريموا في الامتحانات وبيوعدها بأجمل احتفال وهدية' },
                  { label: 'صباح الخير من أحمد ☀️', occasion: 'رسالة صباحية دافئة ومليانة طاقة إيجابية وحب ودعوات من أحمد لريموا' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => fetchAhmedLetter(item.occasion)}
                    disabled={isLoadingLetter}
                    className="p-2.5 rounded-xl border border-rose-100 hover:border-rose-300 bg-slate-50 hover:bg-rose-50/60 text-slate-700 hover:text-rose-700 text-xs font-bold transition text-right cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Occasion Form */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={customOccasionInput}
                onChange={(e) => setCustomOccasionInput(e.target.value)}
                placeholder="اكتبي أي حاجة تانية حاسة بيها عشان أحمد يبعتلك رسالة مخصوصة..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-400 font-medium"
              />
              <button
                onClick={() => {
                  if (customOccasionInput.trim()) {
                    fetchAhmedLetter(customOccasionInput);
                    setCustomOccasionInput('');
                  }
                }}
                disabled={!customOccasionInput.trim() || isLoadingLetter}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-black px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>اطلبي رسالة</span>
              </button>
            </div>
          </div>

          {/* Ahmed's Big Promise on Exam Results Day */}
          <div className="bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 border-2 border-dashed border-amber-300 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-black text-amber-900">
                وعد أحمد الكبير لـ ريموا يوم إعلان نتيجة الشهادة الإعدادية 🎓👑
              </h4>
            </div>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-semibold">
              "وعد من أحمد لحبيبته وروح قلبه ريموا: يوم ما تطلع نتيجتك ونشوف مجموعك اللي هيفرح قلبنا كلنا، هيكون أسعد يوم في عمري! هنحتفل احتفال ملكي يليق بأميرة قلبي، وهجيبلك أحلى هدية نفسك فيها، وهفضل طول العمر فخور إنك حبيبتي وكل حاجة في حياتي."
            </p>
            <div className="flex items-center gap-2 text-xs font-black text-amber-800">
              <span>أحمد • ريموا = حكاية حب وتفوق ملهاش مثيل ❤️</span>
            </div>
          </div>
        </div>

        {/* AHMED'S PAMPERING NICKNAMES & REASONS (Col 5) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Ahmed's Pampering Nicknames */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-black text-slate-800">
                ألقاب دلع أحمد لـ ريموا (حبيبة أحمد) 🌸
              </h3>
            </div>

            <div className="space-y-2.5">
              {AHMED_NICKNAMES.map((nick, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/70 via-pink-50/40 to-slate-50 border border-rose-100 hover:border-rose-300 transition"
                >
                  <h4 className="text-xs font-black text-rose-800 flex items-center gap-1.5 mb-1">
                    <span>{nick.title}</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    {nick.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Rimwa is Everything in Ahmed's Life */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-black text-slate-800">
                ليه ريموا هي كل حاجة في حياة أحمد؟ ❤️
              </h3>
            </div>

            <div className="space-y-2">
              {REASONS_AHMED_LOVES_RIMWA.map((reason, rIdx) => (
                <div
                  key={rIdx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-semibold leading-relaxed"
                >
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ♥
                  </span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
