import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  BookOpen, 
  MessageCircle, 
  CheckSquare, 
  AlertTriangle, 
  HeartHandshake, 
  Award,
  Flame,
  Heart
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakDays: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, streakDays }) => {
  // Prep 3 Exam Countdown (Mid-May / June exams)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number }>({
    days: 45,
    hours: 12,
    minutes: 30
  });

  useEffect(() => {
    // Target exam date: approximate target in May
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 48); // Dynamic remaining days

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft({ days, hours, minutes });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'tutor', label: 'المعلم الخاص بـ مريم', icon: MessageCircle, badge: 'ذكاء اصطناعي' },
    { id: 'best-friend', label: 'صاحبة مريومة 👭', icon: HeartHandshake, badge: 'بير أسرارك' },
    { id: 'ahmed-love', label: 'حب أحمد ليكي ❤️', icon: Heart, badge: 'حبيبة أحمد' },
    { id: 'period', label: 'رعاية مريومة 🌸', icon: Calendar, badge: 'مواعيد وصحة' },
    { id: 'curriculum', label: 'المناهج والشرح المبسط', icon: BookOpen, badge: '5 مواد' },
    { id: 'pomodoro', label: 'تنظيم الوقت وبومودورو', icon: Clock, badge: '25 دقيقة' },
    { id: 'exams', label: 'امتحانات المحافظات', icon: CheckSquare, badge: 'بنك أسئلة' },
    { id: 'traps', label: 'دفتر الأخطاء والتريكات', icon: AlertTriangle, badge: 'فخاخ الامتحانات' },
    { id: 'zen', label: 'واحة الدعم النفسي', icon: Sparkles, badge: 'طاقة إيجابية' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Warm Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-xs md:text-sm py-1.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold">
              👑 مريم (ريموا القمر)
            </span>
            <span className="font-medium">
              مريم حبيبة أحمد وكل حاجة في حياته ❤️ | رفيقة التفوق والدرجة النهائية (280/280) في الشهادة الإعدادية 🇪🇬
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Streak */}
            <div className="flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full">
              <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
              <span>إنجاز متواصل: {streakDays} أيام</span>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-rose-200" />
              <span>
                امتحانات الشهادة الإعدادية بعد: <strong className="text-amber-200">{timeLeft.days}</strong> يوم
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
                  نظام مريم الدراسي الشامل (حب أحمد ليكي)
                </h1>
                <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-rose-200">
                  3 إعدادي
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                المعلم الخصوصي بحب وحنان من أحمد لحبيبته مريم في كل خطوة نحو القمة ✨
              </p>
            </div>
          </div>

          {/* Target Grade Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Award className="w-4 h-4 text-amber-600" />
            <span>الهدف: 280/280 بإذن الله</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-[1.02]'
                    : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="hidden lg:inline-block bg-white/25 text-[10px] px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
