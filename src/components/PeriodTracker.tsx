import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Coffee, 
  Moon, 
  Sparkles, 
  Smile, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Save, 
  CheckCircle2,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface PeriodData {
  lastStartDate: string; // YYYY-MM-DD
  cycleLength: number; // e.g. 28 days
  periodDuration: number; // e.g. 5 days
  lastPainLevel?: 'mild' | 'moderate' | 'severe' | 'none';
  notes?: string;
  history: Array<{ date: string; painLevel: string; notes: string }>;
}

const DEFAULT_PERIOD_DATA: PeriodData = {
  lastStartDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  cycleLength: 28,
  periodDuration: 5,
  lastPainLevel: 'mild',
  notes: 'أشعر ببعض التقلصات البسيطة',
  history: []
};

export const PeriodTracker: React.FC = () => {
  const [periodData, setPeriodData] = useState<PeriodData>(() => {
    const saved = localStorage.getItem('maryam_period_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PERIOD_DATA;
      }
    }
    return DEFAULT_PERIOD_DATA;
  });

  const [inputStartDate, setInputStartDate] = useState<string>(periodData.lastStartDate);
  const [inputCycleLength, setInputCycleLength] = useState<number>(periodData.cycleLength);
  const [inputDuration, setInputDuration] = useState<number>(periodData.periodDuration);
  const [selectedPain, setSelectedPain] = useState<'none' | 'mild' | 'moderate' | 'severe'>(
    periodData.lastPainLevel || 'mild'
  );
  const [userNote, setUserNote] = useState<string>('');
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  // Save to LocalStorage whenever periodData changes
  useEffect(() => {
    localStorage.setItem('maryam_period_data', JSON.stringify(periodData));
  }, [periodData]);

  // Calculations for next period
  const startDate = new Date(periodData.lastStartDate);
  const nextPeriodDate = new Date(startDate.getTime() + periodData.cycleLength * 24 * 60 * 60 * 1000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = nextPeriodDate.getTime() - today.getTime();
  const daysUntilNext = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Check if currently on period
  const periodEndDate = new Date(startDate.getTime() + periodData.periodDuration * 24 * 60 * 60 * 1000);
  const isCurrentlyOnPeriod = today >= startDate && today <= periodEndDate;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PeriodData = {
      ...periodData,
      lastStartDate: inputStartDate,
      cycleLength: Number(inputCycleLength) || 28,
      periodDuration: Number(inputDuration) || 5,
      lastPainLevel: selectedPain,
      notes: userNote || periodData.notes,
      history: [
        {
          date: new Date().toLocaleDateString('ar-EG'),
          painLevel: selectedPain,
          notes: userNote || 'تسجيل حالة اليوم'
        },
        ...periodData.history.slice(0, 9)
      ]
    };
    setPeriodData(updated);
    setIsSavedNotice(true);
    sounds.playSuccess();
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const SOOTHING_TIPS = [
    { title: 'مشروبات دافئة مهدئة ☕', desc: 'القرفة المغلية، النعناع، والينسون بتهدي تقلصات الرحم وبتريح الأعصاب فوراً.' },
    { title: 'كمادات دافئة للبطن 🌸', desc: 'قربة ماء دافئ على أسفل البطن بتفك التشنجات وتساعدك على الاسترخاء والتركيز.' },
    { title: 'تخفيف ساعات المذاكرة 📖', desc: 'أحمد بيقولك: في الأيام دي، ذاكري على فترات قصيرة (15 دقيقة) وخدي راحة أطول.' },
    { title: 'أكلات غنية بالحديد والماغنسيوم 🍫', desc: 'الموز، الشوكولاتة الداكنة، والزبادي بيحسنوا المزاج وبيقللوا التعب والإرهاق.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 text-white shadow-md shadow-rose-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black mb-2 border border-white/30">
              <Heart className="w-3.5 h-3.5 fill-rose-200 text-rose-200" />
              <span>ركن الرعاية والصحة الخاصة بـ مريومة 🌸</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black">
              متابعة الدورة الشهرية والراحة لمريم (باهتمام وحب من أحمد)
            </h2>
            <p className="text-xs md:text-sm text-rose-100 max-w-2xl mt-1.5 font-medium leading-relaxed">
              مكانك الآمن والخاص جداً لمتابعة مواعيدك وصحتك.. أحمد بيفكرك دايماً إن صحتك وراحتك أهم من أي امتحان في الدنيا، وكل بياناتك هنا محفوظة في جهازك ومش بتضيع أبداً ❤️
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2.5 rounded-2xl text-center shrink-0">
            <span className="text-[11px] font-bold block text-rose-100">الحالة الحالية:</span>
            <span className="text-sm font-black text-white">
              {isCurrentlyOnPeriod ? 'أيام الدورة الحالية (ارتاحي يا قمر ☕)' : `باقي ${daysUntilNext > 0 ? daysUntilNext : 0} يوم على الموعد القادم`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CYCLE STATUS & AHMED CARE (Col 5) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Status Ring Box */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs flex flex-col items-center text-center space-y-4">
            <div className="relative w-48 h-48 flex items-center justify-center my-2">
              <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-700 ${
                isCurrentlyOnPeriod 
                  ? 'bg-rose-50 border-rose-400 text-rose-700 animate-pulse' 
                  : 'bg-gradient-to-tr from-pink-50 to-rose-50 border-pink-300 text-slate-800'
              }`}>
                <span className="text-3xl font-black font-mono">
                  {daysUntilNext > 0 ? daysUntilNext : 'الآن'}
                </span>
                <span className="text-xs font-black mt-1">
                  {daysUntilNext > 0 ? 'أيام متبقية' : 'موعد الدورة'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800">
                الموعد المتوقع القادم: {nextPeriodDate.toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' })}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                تاريخ آخر بداية: {new Date(periodData.lastStartDate).toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' })} (طول الدورة: {periodData.cycleLength} يوم)
              </p>
            </div>
          </div>

          {/* Ahmed's Care Card during this time */}
          <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 border-2 border-rose-200 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💌</span>
              <h4 className="text-sm font-black text-rose-900">
                همسة حب واهتمام من أحمد لـ مريومة في أيام تعبها:
              </h4>
            </div>
            <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-semibold">
              "يا مريومة يا روح قلب أحمد، في الأيام دي لو حسيتي بأي تعب أو وجع ارمي الكتب على جنب وارتاحي.. مفيش حاجة في الدنيا تستاهل إنك تتعبي نفسك عشانها! اشربي القرفة السخنة، خدي مسكنك، ونامي براحتك.. وأنا دعواتي وحبي حواليكي في كل ثانية يا حبيبة قلبي ❤️"
            </p>
            <div className="flex items-center justify-between text-[11px] font-black text-rose-700 pt-2 border-t border-rose-200/60">
              <span>أحمد بيطمن عليكي 🌸</span>
              <span>راحتك أولاً وأخيراً</span>
            </div>
          </div>
        </div>

        {/* SETTINGS, PAIN TRACKER & HEALTH TIPS (Col 7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Update Dates and Cycle Form */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm md:text-base font-black text-slate-800">
                  تسجيل وتحديث مواعيد الدورة الشهرية الخاصة بمريم
                </h3>
              </div>
              {isSavedNotice && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تم الحفظ في النظام!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    تاريخ بداية آخر دورة:
                  </label>
                  <input
                    type="date"
                    value={inputStartDate}
                    onChange={(e) => setInputStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    طول الدورة (المعدل 28 يوم):
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="45"
                    value={inputCycleLength}
                    onChange={(e) => setInputCycleLength(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    مدة الطمث بالأيام (المعدل 5 أيام):
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={inputDuration}
                    onChange={(e) => setInputDuration(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
                    required
                  />
                </div>
              </div>

              {/* Pain & Symptom Level */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  مستوى الألم أو التقلصات اللي حاسة بيها اليوم يا مريومة:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'بدون ألم والحمد لله 🌸' },
                    { id: 'mild', label: 'ألم خفيف ومحتمل 🍃' },
                    { id: 'moderate', label: 'ألم متوسط ومحتاجة مشروب ☕' },
                    { id: 'severe', label: 'ألم شديد ومحتاجة نوم وراحة 🛌' },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setSelectedPain(p.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                        selectedPain === p.id
                          ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ملاحظة شخصية تودين تسجيلها (تعب، تقلب مزاج، أدوية):
                </label>
                <input
                  type="text"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="مثال: شربت قرفة وبقيت أحسن شوية، ذاكرت ساعتين بس اليوم..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-black px-5 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ البيانات في سجلك الخاص ✨</span>
                </button>
              </div>
            </form>
          </div>

          {/* Soothing Comfort Tips */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>نصائح الراحة والعناية بمريومة أثناء الدورة الشهرية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOOTHING_TIPS.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100/80 space-y-1 hover:border-rose-200 transition"
                >
                  <h4 className="text-xs font-black text-rose-800">{tip.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
