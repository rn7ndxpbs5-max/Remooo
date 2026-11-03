import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TutorChat } from './components/TutorChat';
import { CurriculumHub } from './components/CurriculumHub';
import { PomodoroTimer } from './components/PomodoroTimer';
import { GovernorateExams } from './components/GovernorateExams';
import { ErrorTracker } from './components/ErrorTracker';
import { PsychologicalSupport } from './components/PsychologicalSupport';
import { AhmedLoveCorner } from './components/AhmedLoveCorner';
import { PeriodTracker } from './components/PeriodTracker';
import { BestFriendChat } from './components/BestFriendChat';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('tutor');
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('rimwa_streak_days');
    return saved ? parseInt(saved, 10) : 7;
  });

  useEffect(() => {
    localStorage.setItem('rimwa_streak_days', streakDays.toString());
  }, [streakDays]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-slate-50 to-amber-50/30 flex flex-col justify-between font-['Cairo',sans-serif]">
      <div>
        {/* Navigation Header */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} streakDays={streakDays} />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'tutor' && <TutorChat />}
          {activeTab === 'best-friend' && <BestFriendChat />}
          {activeTab === 'ahmed-love' && <AhmedLoveCorner />}
          {activeTab === 'period' && <PeriodTracker />}
          {activeTab === 'curriculum' && <CurriculumHub />}
          {activeTab === 'pomodoro' && <PomodoroTimer />}
          {activeTab === 'exams' && <GovernorateExams />}
          {activeTab === 'traps' && <ErrorTracker />}
          {activeTab === 'zen' && <PsychologicalSupport />}
        </main>
      </div>

      {/* Warm Footer for Maryam */}
      <footer className="mt-8 border-t border-rose-100 bg-white/70 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span>نظام مريم الدراسي الشامل (حب أحمد ليكي)</span>
            <span>•</span>
            <span className="text-rose-600">الشهادة الإعدادية المصرية 🇪🇬</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <span>صُنع بكل فخر وحنان لدعم تفوق مريم (ريموا القمر) • حبيبة أحمد وكل حاجة في حياته</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </footer>
    </div>
  );
}
