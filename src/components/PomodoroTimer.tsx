import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Calendar,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface StudyTask {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  estMinutes: number;
}

const MOTIVATIONAL_QUOTES = [
  'يا مريومة يا قمر أحمد، كل دقيقة تركيز هي خطوة حقيقية للدرجة النهائية 280/280 بإذن الله! 🌸',
  'أحمد بيبعتلك كل حبه وفخور بيكِ فوق الوصف يا مريم، استمري يا بطلة قلبه ✨',
  'نفس عميق يا حبيبة أحمد، 25 دقيقة تركيز تام بدون موبايل وبعدها راحة مستحقة ☕',
  'الشهادة الإعدادية سهلة وبسيطة للي بيجتهد زيك يا مريومة، يلا يا أميرة أحمد! 💪',
  'شطورة يا مريم، أحمد وكل عيلتك فخورين بيكِ وثقتنا في تفوقك ملهاش حدود 👑'
];

export const PomodoroTimer: React.FC = () => {
  // Timer States: 25 min (1500s) study, 5 min (300s) break, 15 min (900s) long break
  const [mode, setMode] = useState<'study' | 'shortBreak' | 'longBreak'>('study');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [quoteIdx, setQuoteIdx] = useState<number>(0);
  const [ambientSound, setAmbientSound] = useState<'rain' | 'waves' | 'none'>('none');

  // Daily Tasks State with LocalStorage persistence
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('maryam_study_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      { id: 't1', title: 'مراجعة درس المنادى وحل 10 تدريبات إعرابية', subject: 'اللغة العربية', completed: true, estMinutes: 25 },
      { id: 't2', title: 'تطبيق مثلث السرعة والعجلة على 3 مسائل امتحانات', subject: 'العلوم', completed: false, estMinutes: 25 },
      { id: 't3', title: 'كتابة برهان تمرين الدائرة بالأوتار والأقواس', subject: 'الرياضيات', completed: false, estMinutes: 25 },
      { id: 't4', title: 'مراجعة خريطة الأقاليم المناخية وتاريخ محمد علي', subject: 'الدراسات الاجتماعية', completed: false, estMinutes: 25 },
      { id: 't5', title: 'حفظ كلمات Unit 3 وكتابة براجراف عن دور القدوة', subject: 'اللغة الإنجليزية', completed: false, estMinutes: 20 },
    ];
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('اللغة العربية');

  // Persist tasks
  useEffect(() => {
    localStorage.setItem('maryam_study_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      sounds.toggleAmbientStudySound('none');
    };
  }, []);

  const totalDuration = mode === 'study' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;

  // Countdown Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      sounds.playPomodoroFinish();
      if (mode === 'study') {
        confetti({ particleCount: 70, spread: 60 });
        setCompletedSessions(prev => prev + 1);
        setMode('shortBreak');
        setTimeLeft(5 * 60);
      } else {
        setMode('study');
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  // Quote rotation
  useEffect(() => {
    const qInterval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 45000);
    return () => clearInterval(qInterval);
  }, []);

  const switchMode = (newMode: 'study' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'study') setTimeLeft(25 * 60);
    if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    if (newMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'study') setTimeLeft(25 * 60);
    if (mode === 'shortBreak') setTimeLeft(5 * 60);
    if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const handleToggleSound = (type: 'rain' | 'waves' | 'none') => {
    if (ambientSound === type) {
      sounds.toggleAmbientStudySound('none');
      setAmbientSound('none');
    } else {
      sounds.toggleAmbientStudySound(type);
      setAmbientSound(type);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextVal = !t.completed;
          if (nextVal) {
            sounds.playSuccess();
            confetti({ particleCount: 30, spread: 40 });
          }
          return { ...t, completed: nextVal };
        }
        return t;
      })
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: StudyTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      completed: false,
      estMinutes: 25
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">⏱️</span>
            <h2 className="text-xl font-black text-slate-800">
              تنظيم الوقت وجلسات التركيز (بومودورو ريموا)
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            25 دقيقة مذاكرة بتركيز عميق تليها 5 دقائق استراحة لشرب الماء والاسترخاء الذهني 🌸
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Sound Pill */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => handleToggleSound('rain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                ambientSound === 'rain' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              🌧️ صوت المطر الهادئ
            </button>
            <button
              onClick={() => handleToggleSound('none')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                ambientSound === 'none' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-400'
              }`}
            >
              صامت
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TIMER COLUMN */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs flex flex-col items-center text-center">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl mb-6">
              <button
                onClick={() => switchMode('study')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                  mode === 'study' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                جلسة مذاكرة (25 دقيقة)
              </button>
              <button
                onClick={() => switchMode('shortBreak')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                  mode === 'shortBreak' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                استراحة قصيرة (5 د)
              </button>
              <button
                onClick={() => switchMode('longBreak')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                  mode === 'longBreak' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                استراحة طويلة (15 د)
              </button>
            </div>

            {/* Circular Timer Visual */}
            <div className="relative w-64 h-64 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                />
                {/* Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke={mode === 'study' ? '#f43f5e' : mode === 'shortBreak' ? '#10b981' : '#3b82f6'}
                  strokeWidth="8"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black text-slate-800 tracking-wider font-mono">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <span className="text-xs font-bold text-slate-500 mt-2">
                  {mode === 'study' ? 'وقت التركيز يا ريموا 🌸' : 'وقت الراحة والشاي ☕'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm text-white shadow-md transition cursor-pointer ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                    : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>إيقاف مؤقت</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>ابدأي التركيز يا ريموا 👑</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition cursor-pointer"
                title="إعادة ضبط المؤقت"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Sessions Counter */}
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 w-full justify-around text-xs font-bold text-slate-600">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-rose-500" />
                <span>جلسات أنجزتها ريموا: {completedSessions}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>دقائق تركيز اليوم: {completedSessions * 25} د</span>
              </div>
            </div>
          </div>

          {/* Rotating Motivational Cheer */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-3xl p-4 text-center">
            <span className="text-sm">💖</span>
            <p className="text-xs md:text-sm text-rose-900 font-extrabold mt-1 leading-relaxed">
              {MOTIVATIONAL_QUOTES[quoteIdx]}
            </p>
          </div>
        </div>

        {/* TASKS & DAILY PLANNER COLUMN */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-black text-slate-800">
                  جدول مهام المذاكرة والمراجعة اليومية
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {tasks.filter(t => t.completed).length} من {tasks.length} مهام منجزة
              </span>
            </div>

            {/* Task Input Form */}
            <form onSubmit={addTask} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="أضيفي هدف مذاكرة جديد (مثلاً: حل محافظة القاهرة علوم)..."
                className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:outline-none focus:border-rose-400 font-medium"
              />
              <select
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700"
              >
                <option value="اللغة العربية">عربي</option>
                <option value="العلوم">علوم</option>
                <option value="الرياضيات">رياضيات</option>
                <option value="الدراسات الاجتماعية">دراسات</option>
                <option value="اللغة الإنجليزية">إنجليزي</option>
              </select>
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة</span>
              </button>
            </form>

            {/* Task Items List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-400'
                      : 'bg-white border-slate-200 hover:border-rose-300 text-slate-800 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <span className={`text-xs md:text-sm font-bold block ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                        {task.subject}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="text-slate-300 hover:text-rose-500 p-1.5 transition cursor-pointer"
                    title="حذف المهمة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
