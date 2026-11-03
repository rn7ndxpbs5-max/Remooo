import React, { useState, useEffect } from 'react';
import { GOVERNORATE_EXAMS, GovernorateExamQuestion } from '../data/exams';
import { 
  CheckCircle, 
  XCircle, 
  Award, 
  RotateCcw, 
  Sparkles, 
  Filter, 
  BookOpen, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export const GovernorateExams: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('الكل');
  const [selectedGov, setSelectedGov] = useState<string>('الكل');
  const [userAnswers, setUserAnswers] = useState<Record<string, number | null>>(() => {
    const saved = localStorage.getItem('maryam_exam_answers');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });
  const [customQuestions, setCustomQuestions] = useState<GovernorateExamQuestion[]>(() => {
    const saved = localStorage.getItem('maryam_custom_questions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [aiTopicInput, setAiTopicInput] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('maryam_exam_answers', JSON.stringify(userAnswers));
  }, [userAnswers]);

  useEffect(() => {
    localStorage.setItem('maryam_custom_questions', JSON.stringify(customQuestions));
  }, [customQuestions]);

  const allQuestions = [...customQuestions, ...GOVERNORATE_EXAMS];

  const filteredQuestions = allQuestions.filter(q => {
    const matchSubject = selectedSubject === 'الكل' || q.subject === selectedSubject;
    const matchGov = selectedGov === 'الكل' || q.governorate === selectedGov;
    return matchSubject && matchGov;
  });

  const handleSelectAnswer = (qId: string, optionIdx: number, correctIdx: number) => {
    if (userAnswers[qId] !== undefined && userAnswers[qId] !== null) return;

    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));

    if (optionIdx === correctIdx) {
      sounds.playSuccess();
      confetti({ particleCount: 35, spread: 50 });
    }
  };

  const handleGenerateAiQuiz = async () => {
    if (isGeneratingQuiz) return;
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/tutor/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject !== 'الكل' ? selectedSubject : 'العلوم',
          topic: aiTopicInput || 'أهم أسئلة امتحانات الشهادة الإعدادية',
          count: 3
        })
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        const mapped: GovernorateExamQuestion[] = data.questions.map((q: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          governorate: 'القاهرة',
          year: '2024 متوقع',
          subject: selectedSubject !== 'الكل' ? selectedSubject : 'العلوم',
          subjectId: 'science',
          term: 'الترم الأول',
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation || 'تفسير دقيق مع تمنيات التفوق لـ مريومة حبيبة أحمد!',
          rimwaEncouragement: q.tip || 'يا قمر البنات يا مريم، أحمد وكلنا واثقين في تفوقك بجدارة! 👑'
        }));
        setCustomQuestions(prev => [...mapped, ...prev]);
        setAiTopicInput('');
        sounds.playSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(([id, ans]) => {
    const q = allQuestions.find(item => item.id === id);
    return q && q.correctIndex === ans;
  }).length;

  const resetAllAnswers = () => {
    setUserAnswers({});
  };

  const subjects = ['الكل', 'اللغة العربية', 'العلوم', 'الرياضيات', 'الدراسات الاجتماعية', 'اللغة الإنجليزية'];
  const governorates = ['الكل', 'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'القليوبية'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📝</span>
            <h2 className="text-xl font-black text-slate-800">
              بنك أسئلة وتدريبات امتحانات المحافظات
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            تدربي على نماذج امتحانات الشهادة الإعدادية الحقيقية من محافظات مصر مع تصحيح وتفسير فوري 🇪🇬
          </p>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 px-4 py-2 rounded-2xl">
          <Award className="w-5 h-5 text-rose-600" />
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">نتيجة مريومة الحالية:</span>
            <span className="text-sm font-black text-rose-700">
              {correctCount} من أصل {totalAnswered} أسئلة صحيحة
            </span>
          </div>
          {totalAnswered > 0 && (
            <button
              onClick={resetAllAnswers}
              className="text-xs text-slate-400 hover:text-rose-600 p-1 transition"
              title="إعادة تعيين الإجابات"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
        {/* Subjects */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs font-black text-slate-400 ml-1 shrink-0">المادة:</span>
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedSubject === s
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Governorates */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-slate-100">
          <span className="text-xs font-black text-slate-400 ml-1 shrink-0">المحافظة:</span>
          {governorates.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGov(g)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedGov === g
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* AI Question Generator Box */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={aiTopicInput}
              onChange={(e) => setAiTopicInput(e.target.value)}
              placeholder="اطلبي من المعلمة أسئلة امتحانات جديدة في أي درس (مثال: مسائل السرعة النسبية، أو نحو المنادى)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-400 font-medium"
            />
          </div>
          <button
            onClick={handleGenerateAiQuiz}
            disabled={isGeneratingQuiz}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
          >
            {isGeneratingQuiz ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>المعلمة بتولد أسئلة جديدة...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>توليد أسئلة امتحانات ذكية لـ ريموا ✨</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-rose-100 text-center text-slate-400">
            <p className="text-sm font-bold">لا توجد أسئلة تطابق الفلتر المختار حالياً.</p>
          </div>
        ) : (
          filteredQuestions.map((q, qIndex) => {
            const userAnswer = userAnswers[q.id];
            const hasAnswered = userAnswer !== undefined && userAnswer !== null;
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4 transition hover:border-rose-200"
              >
                {/* Question Meta Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-center">
                      {qIndex + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      {q.subject}
                    </span>
                    <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                      محافظة {q.governorate} ({q.year})
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {q.term}
                  </span>
                </div>

                {/* Question Text */}
                <h3 className="text-sm md:text-base font-black text-slate-800 leading-relaxed">
                  {q.question}
                </h3>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isOptionCorrect = optIdx === q.correctIndex;

                    let btnClass = 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-rose-50/50 hover:border-rose-300';

                    if (hasAnswered) {
                      if (isOptionCorrect) {
                        btnClass = 'bg-emerald-500 border-emerald-500 text-white font-black';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-500 border-rose-500 text-white font-black';
                      } else {
                        btnClass = 'bg-white border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(q.id, optIdx, q.correctIndex)}
                        disabled={hasAnswered}
                        className={`p-3.5 rounded-2xl border text-right text-xs md:text-sm font-semibold transition cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && (
                          <span>
                            {isOptionCorrect ? (
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

                {/* Detailed Feedback & Sisterly Advice */}
                {hasAnswered && (
                  <div className={`p-4 rounded-2xl border text-xs md:text-sm leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/70 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 font-bold">
                      <span>{isCorrect ? '🌟 إجابة صحيحة يا ريموا القمر!' : '💡 توضيح المعلمة لـ ريموا:'}</span>
                    </div>
                    <p className="font-medium mb-2">{q.explanation}</p>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-black/5 font-extrabold flex items-center gap-2">
                      <span>👑</span>
                      <span>{q.rimwaEncouragement}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
