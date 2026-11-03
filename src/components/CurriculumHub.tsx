import React, { useState } from 'react';
import { PREP3_SUBJECTS, SubjectLesson } from '../data/curriculum';
import { 
  BookOpen, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Compass, 
  Calculator, 
  Sparkles, 
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Send,
  Loader2
} from 'lucide-react';
import { sounds } from '../utils/audio';

export const CurriculumHub: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('arabic');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('ar-nidaa');
  const [answersState, setAnswersState] = useState<Record<string, number | null>>({});

  // Active Tool sub-tab: 'lessons' | 'science-triangles' | 'proof-studio'
  const [subTab, setSubTab] = useState<'lessons' | 'science-triangles' | 'proof-studio'>('lessons');

  // Interactive Science Law Triangle State
  const [triangleMode, setTriangleMode] = useState<'speed' | 'acceleration' | 'focal'>('speed');
  const [calcInput1, setCalcInput1] = useState<string>('120'); // e.g. Distance or v2
  const [calcInput2, setCalcInput2] = useState<string>('2');   // e.g. Time or v1
  const [calcInput3, setCalcInput3] = useState<string>('10');  // e.g. time for accel

  // Geometric Proof Solver State
  const [proofInput, setProofInput] = useState('');
  const [proofBranch, setProofBranch] = useState<'هندسة الدائرة' | 'النسب المثلثية' | 'الهندسة التحليلية'>('هندسة الدائرة');
  const [proofResult, setProofResult] = useState<{
    given?: string;
    required?: string;
    construction?: string;
    proofSteps?: string[];
    teacherNote?: string;
  } | null>(null);
  const [isSolvingProof, setIsSolvingProof] = useState(false);

  const activeSubject = PREP3_SUBJECTS.find(s => s.id === selectedSubjectId) || PREP3_SUBJECTS[0];
  const activeLesson = activeSubject.lessons.find(l => l.id === selectedLessonId) || activeSubject.lessons[0];

  const handleSelectAnswer = (lessonId: string, optionIdx: number, correctIdx: number) => {
    setAnswersState(prev => ({ ...prev, [lessonId]: optionIdx }));
    if (optionIdx === correctIdx) {
      sounds.playSuccess();
    }
  };

  const handleSolveProof = async () => {
    if (!proofInput.trim() || isSolvingProof) return;
    setIsSolvingProof(true);
    try {
      const res = await fetch('/api/tutor/solve-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemText: proofInput, branch: proofBranch })
      });
      const data = await res.json();
      setProofResult(data);
      sounds.playSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSolvingProof(false);
    }
  };

  // Speed Calculations
  const dist = parseFloat(calcInput1) || 0;
  const time = parseFloat(calcInput2) || 1;
  const speed = (dist / time).toFixed(2);

  // Acceleration Calculations
  const v2 = parseFloat(calcInput1) || 0;
  const v1 = parseFloat(calcInput2) || 0;
  const dt = parseFloat(calcInput3) || 1;
  const accel = ((v2 - v1) / dt).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation */}
      <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl font-black text-slate-800">
                مكتبة المناهج والشرح المبسط لريموا
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              جميع مواد الصف الثالث الإعدادي مقسمة لجداول وقوانين وتريكات أسئلة امتحانات المحافظات 🇪🇬
            </p>
          </div>

          {/* Sub-tools switch */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setSubTab('lessons')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subTab === 'lessons'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📖 الدروس والشرح
            </button>
            <button
              onClick={() => setSubTab('science-triangles')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subTab === 'science-triangles'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔬 مثلثات القوانين
            </button>
            <button
              onClick={() => setSubTab('proof-studio')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                subTab === 'proof-studio'
                  ? 'bg-white text-amber-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📐 استوديو البرهان الهندسي
            </button>
          </div>
        </div>

        {/* Subject Select Bar */}
        {subTab === 'lessons' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-5 pt-4 border-t border-slate-100">
            {PREP3_SUBJECTS.map((sub) => {
              const isSelected = selectedSubjectId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    setSelectedLessonId(sub.lessons[0].id);
                  }}
                  className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-rose-400 bg-rose-50/50 shadow-xs ring-2 ring-rose-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{sub.icon}</span>
                    <span className="text-[10px] bg-white border px-1.5 py-0.5 rounded-md font-bold text-slate-500">
                      {sub.lessons.length} دروس
                    </span>
                  </div>
                  <h3 className={`text-sm font-extrabold ${isSelected ? 'text-rose-700' : 'text-slate-800'}`}>
                    {sub.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{sub.badge}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SUBTAB 1: LESSONS & EXPLANATIONS */}
      {subTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lessons List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs">
              <h3 className="text-xs font-black text-slate-400 mb-3 px-1">
                دروس مادة {activeSubject.name} المقررة:
              </h3>
              <div className="space-y-2">
                {activeSubject.lessons.map((lesson) => {
                  const isCurrent = lesson.id === activeLesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`w-full text-right p-3 rounded-2xl border transition cursor-pointer block ${
                        isCurrent
                          ? 'border-rose-400 bg-rose-500 text-white shadow-md shadow-rose-200'
                          : 'border-slate-100 bg-slate-50/70 hover:bg-rose-50/60 text-slate-700 hover:border-rose-200'
                      }`}
                    >
                      <span className={`text-[10px] font-bold block mb-1 ${isCurrent ? 'text-rose-100' : 'text-slate-400'}`}>
                        {lesson.unit}
                      </span>
                      <h4 className="text-xs md:text-sm font-black line-clamp-1">
                        {lesson.title}
                      </h4>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Encouragement Box for Rimwa */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💖</span>
                <h4 className="text-xs font-black text-amber-900">همسة تشجيع لـ ريموا القمر:</h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                يا حبيبة، كل معلومة بتقرأيها وبتركزي فيها بتفرق معاكي نص درجة ودرجة كاملة في المجموع. إنتي شاطرة وذكية ومستقبلك مشرق بإذن الله! ✨
              </p>
            </div>
          </div>

          {/* Lesson Main Content Card */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-5">
              {/* Lesson Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 mb-1">
                  <span>{activeSubject.name}</span>
                  <span>•</span>
                  <span>{activeLesson.unit}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800">
                  {activeLesson.title}
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {activeLesson.summary}
                </p>
              </div>

              {/* Key Rules & Breakdown */}
              <div>
                <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                  <span>النقاط الأساسية والقواعد الذهبية:</span>
                </h3>
                <div className="space-y-2.5">
                  {activeLesson.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-rose-50/30 rounded-2xl border border-rose-100/70"
                    >
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ahmed's Loving Mnemonic & Simplification for Maryam */}
              {activeLesson.ahmedLoveNote && (
                <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 border-2 border-rose-200 rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">💌</span>
                    <h4 className="text-xs md:text-sm font-black text-rose-800">
                      همسة حب وتبسيط من أحمد لحبيبته مريم (سهليها على نفسك يا قمر):
                    </h4>
                  </div>
                  <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-bold">
                    {activeLesson.ahmedLoveNote}
                  </p>
                </div>
              )}

              {/* Exam Secrets Box */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-500/10 border-2 border-dashed border-amber-300 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h4 className="text-sm font-extrabold text-amber-900">
                    تريكة امتحان الشهادة الإعدادية (احذري الوقوع في الفخ!):
                  </h4>
                </div>
                <p className="text-xs md:text-sm text-amber-900 leading-relaxed font-bold">
                  {activeLesson.examTips}
                </p>
              </div>

              {/* Interactive Quick Quiz */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <h4 className="text-sm font-black text-slate-800">
                      سؤال تدريبي سريع لـ ريموا القمر:
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                    اختبري فهمك فوراً
                  </span>
                </div>

                <p className="text-sm font-extrabold text-slate-800">
                  {activeLesson.quickQuestion.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeLesson.quickQuestion.options.map((opt, optIdx) => {
                    const chosen = answersState[activeLesson.id];
                    const isSelected = chosen === optIdx;
                    const isCorrect = optIdx === activeLesson.quickQuestion.correctIndex;
                    let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50/50';

                    if (chosen !== undefined && chosen !== null) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500 text-white border-emerald-500 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500 text-white border-rose-500 font-bold';
                      } else {
                        btnStyle = 'bg-white text-slate-400 border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(activeLesson.id, optIdx, activeLesson.quickQuestion.correctIndex)}
                        disabled={chosen !== undefined && chosen !== null}
                        className={`p-3 rounded-xl border text-right text-xs md:text-sm transition cursor-pointer font-medium flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {chosen !== undefined && chosen !== null && (
                          <span>
                            {isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : isSelected ? (
                              <XCircle className="w-4 h-4 text-white" />
                            ) : null}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {answersState[activeLesson.id] !== undefined && answersState[activeLesson.id] !== null && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs md:text-sm text-emerald-900 leading-relaxed font-medium animate-fadeIn">
                    <p className="font-bold mb-1">
                      {answersState[activeLesson.id] === activeLesson.quickQuestion.correctIndex
                        ? '🎉 إجابة صحيحة يا بطلة!'
                        : '💡 تفسير الإجابة الصحيحة يا ريموا:'}
                    </p>
                    {activeLesson.quickQuestion.explanation}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SCIENCE LAW TRIANGLES */}
      {subTab === 'science-triangles' && (
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span className="text-2xl">🔬</span>
                <span>مثلثات قوانين مادة العلوم التفاعلية</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                أي مسألة سرعة أو عجلة في امتحان الشهادة الإعدادية تتحل بضغطة زر وبدون تردد!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTriangleMode('speed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  triangleMode === 'speed' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                مثلث السرعة (ف / ع × ز)
              </button>
              <button
                onClick={() => setTriangleMode('acceleration')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  triangleMode === 'acceleration' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                مثلث العجلة (جـ / Δع × ز)
              </button>
              <button
                onClick={() => setTriangleMode('focal')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  triangleMode === 'focal' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                قانون نق والبعد البؤري (نق = 2 × ع)
              </button>
            </div>
          </div>

          {/* Interactive Triangle Display */}
          {triangleMode === 'speed' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-center justify-center p-6 bg-blue-50/50 rounded-3xl border border-blue-200">
                <div className="text-xs font-bold text-blue-700 mb-4 bg-white px-3 py-1 rounded-full border border-blue-200">
                  مثلث السرعة السحري لريموا 🔺
                </div>
                {/* SVG Visual Triangle */}
                <div className="relative w-64 h-56 flex flex-col items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-blue-100 text-center">
                  <div className="border-b-2 border-blue-500 w-full pb-3">
                    <span className="text-xs text-slate-400 block font-bold">في القمة:</span>
                    <span className="text-2xl font-black text-blue-600">المسافة (ف)</span>
                    <span className="text-[10px] text-slate-500 block">بالمتر (م) أو الكيلومتر (كم)</span>
                  </div>
                  <div className="grid grid-cols-2 w-full pt-3 gap-2">
                    <div className="border-l border-blue-200 pl-2">
                      <span className="text-xs text-slate-400 block font-bold">السرعة (ع)</span>
                      <span className="text-lg font-black text-emerald-600">ع = ف ÷ ز</span>
                    </div>
                    <div className="pr-2">
                      <span className="text-xs text-slate-400 block font-bold">الزمن (ز)</span>
                      <span className="text-lg font-black text-amber-600">ز = ف ÷ ع</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculator Inputs */}
              <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <h4 className="font-extrabold text-slate-800 text-sm">
                  جربي بنفسك يا ريموا (أدخلي أرقام المسألة):
                </h4>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    المسافة المقطوعة (ف) بالكيلومتر أو المتر:
                  </label>
                  <input
                    type="number"
                    value={calcInput1}
                    onChange={(e) => setCalcInput1(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    الزمن المستغرق (ز) بالساعة أو الثانية:
                  </label>
                  <input
                    type="number"
                    value={calcInput2}
                    onChange={(e) => setCalcInput2(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                  />
                </div>

                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-sm">
                  <span className="text-xs opacity-90 block">السرعة المحسوبة (ع = ف ÷ ز):</span>
                  <div className="text-2xl font-black mt-1">
                    {speed} وحدة سرعة
                  </div>
                  <p className="text-xs opacity-90 mt-1">
                    تريكة: للتحويل من كم/س إلى م/ث نضرب في (5 ÷ 18)!
                  </p>
                </div>
              </div>
            </div>
          )}

          {triangleMode === 'acceleration' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-200 space-y-3">
                <div className="text-xs font-bold text-indigo-700 bg-white px-3 py-1 rounded-full border border-indigo-200 inline-block">
                  قانون العجلة: جـ = (ع2 - ع1) ÷ ز ⚡
                </div>
                <div className="p-4 bg-white rounded-2xl border border-indigo-100 space-y-2">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    • <strong>ع1:</strong> السرعة الابتدائية (تساوي صفر لو قال بدأ من السكون).<br />
                    • <strong>ع2:</strong> السرعة النهائية (تساوي صفر لو ضغط على الفرامل وتوقف).<br />
                    • <strong>ز:</strong> الزمن الذي حدث فيه التغير في السرعة.
                  </p>
                  <div className="text-xs font-bold text-indigo-900 bg-indigo-50 p-2 rounded-xl">
                    وحدة قياس العجلة: متر / ثانية² (م/ث²)
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">السرعة النهائية (ع2):</label>
                    <input
                      type="number"
                      value={calcInput1}
                      onChange={(e) => setCalcInput1(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">السرعة الابتدائية (ع1):</label>
                    <input
                      type="number"
                      value={calcInput2}
                      onChange={(e) => setCalcInput2(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">الزمن بالثواني (ز):</label>
                  <input
                    type="number"
                    value={calcInput3}
                    onChange={(e) => setCalcInput3(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold"
                  />
                </div>

                <div className={`p-4 rounded-2xl text-white ${parseFloat(accel) > 0 ? 'bg-emerald-600' : parseFloat(accel) < 0 ? 'bg-rose-600' : 'bg-slate-700'}`}>
                  <span className="text-xs opacity-90 block">قيمة العجلة المحسوبة:</span>
                  <div className="text-2xl font-black mt-1">
                    {accel} م/ث²
                  </div>
                  <span className="text-xs font-bold block mt-1">
                    {parseFloat(accel) > 0
                      ? 'عجلة منتظمة موجبة (تزايدية لأن ع2 > ع1)'
                      : parseFloat(accel) < 0
                      ? 'عجلة منتظمة سالبة (تناقصية لأن ع2 < ع1)'
                      : 'عجلة = صفر (سرعة منتظمة ثابتة)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {triangleMode === 'focal' && (
            <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-200 space-y-4">
              <h4 className="font-extrabold text-amber-900 text-base">
                العلاقة بين نصف قطر التكور (نق) والبعد البؤري (ع) للمرآة والعدسة
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white p-4 rounded-2xl border border-amber-200">
                  <span className="text-xs text-slate-400 block font-bold">القانون الأساسي</span>
                  <span className="text-xl font-black text-amber-600 block mt-1">نق = 2 × ع</span>
                  <span className="text-xs text-slate-500">نصف القطر ضعف البعد البؤري</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-amber-200">
                  <span className="text-xs text-slate-400 block font-bold">لحساب البعد البؤري</span>
                  <span className="text-xl font-black text-blue-600 block mt-1">ع = نق ÷ 2</span>
                  <span className="text-xs text-slate-500">البعد البؤري نصف القطر</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-amber-200">
                  <span className="text-xs text-slate-400 block font-bold">القطر الكامل للكرة</span>
                  <span className="text-xl font-black text-rose-600 block mt-1">القطر = 4 × ع</span>
                  <span className="text-xs text-slate-500">انتبهي إذا ذكر القطر وليس نصفه!</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: GEOMETRIC PROOF STUDIO */}
      {subTab === 'proof-studio' && (
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📐</span>
              <h3 className="text-xl font-black text-slate-800">
                استوديو كتابة البرهان الرياضي النموذجي (مع المعلمة الذكية)
              </h3>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              اكتبي أي مسألة هندسية أو تمرين دائرة، والمعلمة هتكتبهالك بالصيغة المعتمدة لتقفيل الدرجة النهائية (المعطيات، المطلوب، العمل، والبرهان بخطوات ∵ و ∴)!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">فرع الهندسة:</span>
                {(['هندسة الدائرة', 'النسب المثلثية', 'الهندسة التحليلية'] as const).map(b => (
                  <button
                    key={b}
                    onClick={() => setProofBranch(b)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition ${
                      proofBranch === b ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  اكتبي معطيات ومطلوب المسألة هنا يا ريموا:
                </label>
                <textarea
                  rows={4}
                  value={proofInput}
                  onChange={(e) => setProofInput(e.target.value)}
                  placeholder="مثال: أ ب وتر في الدائرة م، جـ منتصف أ ب، قياس زاوية أ م جـ = 50°، أوجدي قياس زاوية أ... أو أثبتي أن الشكل أ ب جـ د رباعي دائري."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-2xl p-3.5 text-sm focus:outline-none"
                />
              </div>

              {/* Sample Proof Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">مسائل امتحانات شهيرة:</span>
                <button
                  onClick={() => setProofInput('أ ب وتر في الدائرة م، م د ⊥ أ ب ويقطع الدائرة في هـ، أثبت أن د منتصف أ ب')}
                  className="text-xs bg-slate-100 hover:bg-amber-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer"
                >
                  عمودي على وتر ينصفه
                </button>
                <button
                  onClick={() => setProofInput('أ ب جـ د شكل رباعي فيه قياس زاوية أ = 70°، وقياس زاوية جـ = 110°، أثبت أن الشكل رباعي دائري')}
                  className="text-xs bg-slate-100 hover:bg-amber-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer"
                >
                  إثبات رباعي دائري
                </button>
              </div>

              <button
                onClick={handleSolveProof}
                disabled={!proofInput.trim() || isSolvingProof}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3 px-4 rounded-2xl shadow-md shadow-amber-200 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isSolvingProof ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>المعلمة بتصيغ البرهان النموذجي لريموا...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>صياغة البرهان الرياضي النموذجي ✨</span>
                  </>
                )}
              </button>
            </div>

            {/* Formatted Proof Result */}
            <div className="lg:col-span-6">
              {proofResult ? (
                <div className="bg-amber-50/40 border border-amber-200 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                    <span className="text-xs font-black text-amber-900">
                      صيغة الإجابة النموذجية في ورقة الامتحان 📝
                    </span>
                    <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      مقفل للدرجة
                    </span>
                  </div>

                  {proofResult.given && (
                    <div>
                      <span className="text-xs font-black text-slate-700 block mb-0.5">١. المعطيات:</span>
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 font-medium">
                        {proofResult.given}
                      </p>
                    </div>
                  )}

                  {proofResult.required && (
                    <div>
                      <span className="text-xs font-black text-slate-700 block mb-0.5">٢. المطلوب:</span>
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 font-medium">
                        {proofResult.required}
                      </p>
                    </div>
                  )}

                  {proofResult.construction && proofResult.construction !== 'لا يوجد عمل' && (
                    <div>
                      <span className="text-xs font-black text-slate-700 block mb-0.5">٣. العمل:</span>
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 font-medium">
                        {proofResult.construction}
                      </p>
                    </div>
                  )}

                  {proofResult.proofSteps && proofResult.proofSteps.length > 0 && (
                    <div>
                      <span className="text-xs font-black text-amber-900 block mb-1">٤. البرهان خطوة بخطوة:</span>
                      <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-amber-200 text-xs md:text-sm text-slate-800 leading-relaxed font-semibold">
                        {proofResult.proofSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 py-0.5">
                            <span className="text-amber-600 font-bold">◀</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {proofResult.teacherNote && (
                    <div className="bg-white p-3 rounded-xl border border-rose-200 text-xs text-rose-800 font-bold flex items-center gap-2">
                      <span>👑</span>
                      <span>{proofResult.teacherNote}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full min-h-[250px] border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center text-slate-400">
                  <Compass className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-xs font-bold">
                    اكتبي مسألتك على اليمين واضغطي "صياغة البرهان" لتشاهدي خطوات الحل النموذجية.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
