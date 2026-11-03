import React, { useState, useEffect } from 'react';
import { INITIAL_EXAM_TRAPS, ExamTrap } from '../data/examTraps';
import { 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Star, 
  Search, 
  Bookmark, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/audio';

export const ErrorTracker: React.FC = () => {
  const [traps, setTraps] = useState<ExamTrap[]>(() => {
    const saved = localStorage.getItem('rimwa_exam_traps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_EXAM_TRAPS;
      }
    }
    return INITIAL_EXAM_TRAPS;
  });

  const [selectedSubject, setSelectedSubject] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyStarred, setShowOnlyStarred] = useState<boolean>(false);

  // New Note Modal / Form State
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<'arabic' | 'science' | 'math' | 'social' | 'english'>('arabic');
  const [newTopic, setNewTopic] = useState<string>('');
  const [newMistake, setNewMistake] = useState<string>('');
  const [newCorrectRule, setNewCorrectRule] = useState<string>('');
  const [newExample, setNewExample] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('rimwa_exam_traps', JSON.stringify(traps));
  }, [traps]);

  const toggleStar = (id: string) => {
    setTraps(prev =>
      prev.map(t => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
    );
  };

  const deleteTrap = (id: string) => {
    if (confirm('هل ترغبين في حذف هذه الملاحظة يا ريموا؟')) {
      setTraps(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCorrectRule.trim()) return;

    const subjectNames: Record<string, string> = {
      arabic: 'اللغة العربية',
      science: 'العلوم',
      math: 'الرياضيات',
      social: 'الدراسات الاجتماعية',
      english: 'اللغة الإنجليزية'
    };

    const newTrap: ExamTrap = {
      id: `custom-${Date.now()}`,
      subject: subjectNames[newSubject],
      subjectId: newSubject,
      topic: newTopic.trim() || 'ملاحظة عامة',
      trapTitle: newTitle.trim(),
      mistake: newMistake.trim() || 'غلطة شائعة تم تداركها',
      correctRule: newCorrectRule.trim(),
      explanation: 'سجّلتها ريموا في دفترها لتفادي تكرارها في امتحان الشهادة الإعدادية.',
      example: newExample.trim() || '',
      isFavorite: true
    };

    setTraps(prev => [newTrap, ...prev]);
    setIsAddingNote(false);
    setNewTitle('');
    setNewTopic('');
    setNewMistake('');
    setNewCorrectRule('');
    setNewExample('');
    sounds.playSuccess();
  };

  const filteredTraps = traps.filter(t => {
    const matchSubject = selectedSubject === 'الكل' || t.subject === selectedSubject;
    const matchStarred = !showOnlyStarred || t.isFavorite;
    const matchSearch =
      t.trapTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mistake.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.correctRule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchStarred && matchSearch;
  });

  const subjects = ['الكل', 'اللغة العربية', 'العلوم', 'الرياضيات', 'الدراسات الاجتماعية', 'اللغة الإنجليزية'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📒</span>
            <h2 className="text-xl font-black text-slate-800">
              دفتر الأخطاء الذكي وتريكات الامتحانات لـ مريم (مريومة القمر)
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            سجلي النقاط الصعبة والتريكات اللي أحمد عايزك متقعيش فيها أبداً عشان تقفلي 280/280 بإذن الله 👑
          </p>
        </div>

        <button
          onClick={() => setIsAddingNote(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-200"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تريكة أو خطأ جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-rose-100 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي عن تريكة (مثلاً: الممنوع من الصرف)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-rose-400 font-medium"
            />
          </div>

          {/* Starred Filter Button */}
          <button
            onClick={() => setShowOnlyStarred(!showOnlyStarred)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              showOnlyStarred
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showOnlyStarred ? 'fill-white' : ''}`} />
            <span>مراجعة ليلة الامتحان ({traps.filter(t => t.isFavorite).length})</span>
          </button>
        </div>

        {/* Subject Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 shrink-0">المادة:</span>
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedSubject === s
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Add Note Modal */}
      {isAddingNote && (
        <div className="bg-white rounded-3xl p-6 border-2 border-rose-300 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <span className="text-lg">✏️</span>
              <span>تسجيل فخ أو خطأ جديد في دفتر ريموا</span>
            </h3>
            <button
              onClick={() => setIsAddingNote(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              إلغاء
            </button>
          </div>

          <form onSubmit={handleAddNote} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المادة:</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="arabic">اللغة العربية</option>
                  <option value="science">العلوم</option>
                  <option value="math">الرياضيات</option>
                  <option value="social">الدراسات الاجتماعية</option>
                  <option value="english">اللغة الإنجليزية</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم الدرس أو الموضوع:</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="مثال: البدل، أو المرايا المقعرة..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">عنوان التريكة أو الفخ:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: الفرق بين بدل الاشتمال والتمييز"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-rose-700 block mb-1">الخطأ اللي ممكن أقع فيه (الفخ):</label>
                <textarea
                  rows={2}
                  value={newMistake}
                  onChange={(e) => setNewMistake(e.target.value)}
                  placeholder="اكتبي الغلطة الشائعة لتتذكري تجنبها..."
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-700 block mb-1">القاعدة الصحيحة اللي همشي عليها:</label>
                <textarea
                  rows={2}
                  value={newCorrectRule}
                  onChange={(e) => setNewCorrectRule(e.target.value)}
                  placeholder="اكتبي القاعدة الذهبية المعتمدة للحل..."
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl p-2.5 text-xs font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">مثال توضيحي سريع:</label>
              <input
                type="text"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="مثال: قرأت الكتاب نصفه (بدل) | أعجبني الطالب ذكاءً (تمييز)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNote(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition shadow-sm"
              >
                حفظ في دفتري ✨
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Traps Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTraps.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl p-8 border border-rose-100 text-center text-slate-400">
            <p className="text-sm font-bold">لا توجد ملاحظات تطابق البحث يا ريموا.</p>
          </div>
        ) : (
          filteredTraps.map((trap) => (
            <div
              key={trap.id}
              className={`bg-white rounded-3xl p-5 border shadow-xs space-y-3.5 transition flex flex-col justify-between ${
                trap.isFavorite ? 'border-amber-300 ring-1 ring-amber-200' : 'border-rose-100'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg">
                      {trap.subject}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold">
                      {trap.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStar(trap.id)}
                      className="p-1 text-slate-300 hover:text-amber-500 transition cursor-pointer"
                      title={trap.isFavorite ? 'إزالة من ليلة الامتحان' : 'تمييز لمراجعة ليلة الامتحان'}
                    >
                      <Star className={`w-4 h-4 ${trap.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => deleteTrap(trap.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 transition cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm md:text-base font-black text-slate-800 leading-snug">
                  {trap.trapTitle}
                </h3>

                {/* Common Mistake Box */}
                <div className="mt-3 bg-rose-50/70 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5">
                  <span className="text-rose-600 text-xs font-bold shrink-0 mt-0.5">❌ الفخ:</span>
                  <p className="text-xs text-rose-900 font-medium leading-relaxed">
                    {trap.mistake}
                  </p>
                </div>

                {/* Golden Rule Box */}
                <div className="mt-2 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5">
                  <span className="text-emerald-700 text-xs font-bold shrink-0 mt-0.5">✅ الصح:</span>
                  <p className="text-xs text-emerald-950 font-bold leading-relaxed">
                    {trap.correctRule}
                  </p>
                </div>

                {/* Example if exists */}
                {trap.example && (
                  <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 font-medium">
                    <span className="font-bold text-slate-500">مثال امتحاني: </span>
                    {trap.example}
                  </div>
                )}
              </div>

              {/* Encouragement Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>تريكة مضمونة في الشهادة الإعدادية</span>
                <span className="text-rose-500">شطورة يا مريومة حبيبة أحمد 🌸</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
