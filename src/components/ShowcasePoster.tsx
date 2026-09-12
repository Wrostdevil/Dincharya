import React, { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  Clock,
  Calendar as CalendarIcon,
  Sun,
  Cloud,
  CloudSun,
  Home,
  Heart,
  User,
  Music,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Palette,
  Layers,
  Grid,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Flame,
  RotateCcw,
  Target,
  ExternalLink,
  Timer,
  CheckCircle2,
} from 'lucide-react';
import {
  Task,
  FocusSession,
  ActivePage,
  ThemeName,
  WeatherInfo,
  DincharyaHabit,
  AmbientSoundType,
  FocusMode,
} from '../types';
import { getCurrentDincharyaPhase } from '../utils/dincharyaData';
import { NeuCard, NeuButton, NeuKnob, NeuSlider, NeuSwitch } from './NeumorphicElements';
import { VintageWaterburyClock } from './VintageWaterburyClock';
import { sound, SOUND_OPTIONS } from '../utils/audio';

interface ShowcasePosterProps {
  tasks: Task[];
  sessions: FocusSession[];
  habits: DincharyaHabit[];
  onNavigate: (page: ActivePage) => void;
  onOpenAddTask: () => void;
  onOpenZenModal: () => void;
  onOpenSearch: () => void;
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  weather: WeatherInfo;
  isTimerRunning: boolean;
  timerMinutes: number;
  timerSecondsRemaining: number;
  timerMode: FocusMode;
  activeTaskId?: string;
  onTimerMinutesChange: (mins: number) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onAddMinutes: (mins: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentUser?: FirebaseUser | null;
  onOpenAuth?: () => void;
}

export const ShowcasePoster: React.FC<ShowcasePosterProps> = ({
  tasks,
  sessions,
  habits,
  onNavigate,
  onOpenAddTask,
  onOpenZenModal,
  onOpenSearch,
  currentTheme,
  onThemeChange,
  weather,
  isTimerRunning,
  timerMinutes,
  timerSecondsRemaining,
  timerMode,
  activeTaskId,
  onTimerMinutesChange,
  onToggleTimer,
  onResetTimer,
  onAddMinutes,
  soundEnabled,
  onToggleSound,
  currentUser,
  onOpenAuth,
}) => {
  // Live temporal state: Day, Date, Time tracking
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sliderVal, setSliderVal] = useState(65);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [selectedSoundIndex, setSelectedSoundIndex] = useState(0); // 528 Hz Cortisol Cleanse is index 0
  const [soundEffectsOn, setSoundEffectsOn] = useState(soundEnabled);
  const [centerView, setCenterView] = useState<'clock' | 'knob'>('clock');

  const activeSound = SOUND_OPTIONS[selectedSoundIndex] || SOUND_OPTIONS[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatters for Day, Date, Time
  const dayName = currentTime.toLocaleDateString(undefined, { weekday: 'long' });
  const dateFormatted = currentTime.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeHours = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const currentHour = currentTime.getHours();
  const activePhase = getCurrentDincharyaPhase(currentHour);
  const phaseHabits = habits.filter((h) => h.phase === activePhase.id);

  // Day elapsed percentage (out of 24 hours)
  const dayElapsedMinutes = currentHour * 60 + currentTime.getMinutes();
  const dayPercent = Math.min(100, Math.round((dayElapsedMinutes / 1440) * 100));

  // Today's stats
  const todayStr = currentTime.toISOString().split('T')[0];
  const todaySessions = sessions.filter(
    (s) => s.timestamp.startsWith(todayStr) && s.completed
  );
  const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const habitsCompletedCount = habits.filter((h) => h.completed).length;

  const handleToggleAmbient = () => {
    const next = !isAmbientPlaying;
    setIsAmbientPlaying(next);
    if (next) {
      sound.startAmbient(activeSound.id, sliderVal / 100);
    } else {
      sound.stopAllAmbient();
    }
  };

  const handleSliderChange = (val: number) => {
    setSliderVal(val);
    if (isAmbientPlaying) {
      sound.setAmbientVolume(activeSound.id, val / 100);
    }
  };

  const handleToggleSoundEffects = (checked: boolean) => {
    setSoundEffectsOn(checked);
    onToggleSound();
  };

  const handleNextSound = () => {
    sound.playClick('press');
    const nextIdx = (selectedSoundIndex + 1) % SOUND_OPTIONS.length;
    setSelectedSoundIndex(nextIdx);
    if (isAmbientPlaying) {
      sound.startAmbient(SOUND_OPTIONS[nextIdx].id, sliderVal / 100);
    }
  };

  const handlePrevSound = () => {
    sound.playClick('press');
    const prevIdx = (selectedSoundIndex - 1 + SOUND_OPTIONS.length) % SOUND_OPTIONS.length;
    setSelectedSoundIndex(prevIdx);
    if (isAmbientPlaying) {
      sound.startAmbient(SOUND_OPTIONS[prevIdx].id, sliderVal / 100);
    }
  };

  const cycleTheme = () => {
    onThemeChange(currentTheme === 'dark' ? 'classic' : 'dark');
  };

  const isDark = currentTheme === 'dark';

  // Neumorphic Dynamic Styling for Light vs Dark/Black theme
  const cardBg = isDark ? 'bg-[#12141a]' : 'bg-[#ebf0f7]';
  const cardBorder = isDark ? 'border-white/[0.08]' : 'border-white/70';
  const raisedLg = isDark
    ? 'shadow-[10px_10px_22px_#07080b,-10px_-10px_22px_#1c202a]'
    : 'shadow-[10px_10px_22px_#c5d0df,-10px_-10px_22px_#ffffff]';
  const raisedSm = isDark
    ? 'shadow-[4px_4px_10px_#07080b,-4px_-4px_10px_#1c202a]'
    : 'shadow-[4px_4px_10px_#c5d0df,-4px_-4px_10px_#ffffff]';
  const raisedHover = isDark
    ? 'hover:shadow-[12px_12px_26px_#050608,-12px_-12px_26px_#222734]'
    : 'hover:shadow-[12px_12px_26px_#c0cbd9,-12px_-12px_26px_#ffffff]';
  const sunkenSm = isDark
    ? 'shadow-[inset_2px_2px_4px_#08090d,inset_-2px_-2px_4px_#1a1d25]'
    : 'shadow-[inset_2px_2px_4px_#c2cdda,inset_-2px_-2px_4px_#ffffff]';
  const sunkenMd = isDark
    ? 'shadow-[inset_3px_3px_6px_#08090d,inset_-3px_-3px_6px_#1a1d25]'
    : 'shadow-[inset_3px_3px_6px_#c2cdda,inset_-3px_-3px_6px_#ffffff]';
  const headlineText = isDark ? 'text-slate-100' : 'text-[#1e293b]';
  const subtextColor = isDark ? 'text-slate-400' : 'text-[#64748b]';
  const iconColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const borderDivider = isDark ? 'border-white/[0.08]' : 'border-slate-200/50';
  const numColor = isDark ? 'text-slate-500' : 'text-[#8a99ab]';

  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const totalTimerSeconds = timerMinutes * 60;
  const timerMinutesDisplay = Math.floor(timerSecondsRemaining / 60)
    .toString()
    .padStart(2, '0');
  const timerSecondsDisplay = (timerSecondsRemaining % 60).toString().padStart(2, '0');
  const timerProgressPercent =
    totalTimerSeconds > 0
      ? Math.min(1, Math.max(0, (totalTimerSeconds - timerSecondsRemaining) / totalTimerSeconds))
      : 0;
  const isTimerActive =
    isTimerRunning || (timerSecondsRemaining < totalTimerSeconds && timerSecondsRemaining > 0);

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 transition-all duration-300">
      {/* Top Tagline Eyebrow (Exact match to reference image) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h2 className={`text-xs sm:text-sm font-black uppercase tracking-[0.2em] ${currentUser ? (isDark ? 'text-indigo-400' : 'text-slate-800') : (isDark ? 'text-slate-400' : 'text-[#78889c]')} neu-text-embossed select-none`}>
            {currentUser ? (currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'User')) : ''}
          </h2>
        </div>

        {/* Live Temporal Day, Date & Clock Badges in Neumorphic Style + Cloud Sync Status */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
          {onOpenAuth && (
            <button
              type="button"
              onClick={() => {
                sound.playClick('press');
                onOpenAuth();
              }}
              className={`px-3 py-1.5 rounded-full ${cardBg} border ${cardBorder} ${raisedSm} flex items-center gap-1.5 text-xs font-bold ${
                currentUser ? 'text-emerald-500' : isDark ? 'text-slate-300' : 'text-slate-700'
              } hover:border-indigo-500/40 active:${sunkenSm} transition-all`}
              title={currentUser ? `Cloud Synced (${currentUser.displayName || currentUser.email})` : 'Sign in to save tasks and history to Firestore'}
            >
              <Cloud className={`w-3.5 h-3.5 ${currentUser ? 'text-emerald-500' : 'text-indigo-500'}`} />
              <span className="neu-text-embossed">
                {currentUser ? (currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Cloud Synced') : 'Sign In'}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${currentUser ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            </button>
          )}

          <div className={`px-3.5 py-1.5 rounded-full ${cardBg} border ${cardBorder} ${raisedSm} flex items-center gap-2 text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span className="neu-text-embossed">{dayName}, {dateFormatted}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick('press');
              setCenterView('clock');
              const el = document.getElementById('vintage-waterbury-watch');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className={`px-3.5 py-1.5 rounded-full ${cardBg} border ${cardBorder} ${raisedSm} flex items-center gap-2 text-xs font-mono font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'} hover:scale-105 transition-all cursor-pointer`}
            title="View Real-Time Antique Watch"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>{timeHours}</span>
            <span className="text-[10px] text-indigo-500 font-sans font-extrabold uppercase tracking-wider hidden sm:inline bg-indigo-500/10 px-1.5 py-0.5 rounded-full">
              Live Watch
            </span>
          </button>
        </div>
      </div>

      {/* Live Focus Timer Dashboard Card - Prominently displayed when timer is running/active */}
      {isTimerActive && (
        <div className={`w-full mb-7 p-5 sm:p-6 rounded-3xl ${cardBg} border ${cardBorder} ${raisedLg} transition-all duration-300 animate-fadeIn relative overflow-hidden`}>
          {/* Accent top edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-amber-400 to-indigo-500 opacity-90" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Left: Status & Active Task */}
            <div className="flex items-start sm:items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${cardBg} border ${cardBorder} ${sunkenSm} flex items-center justify-center flex-shrink-0`}>
                <Flame className={`w-6 h-6 ${isTimerRunning ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`} />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isTimerRunning
                      ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20'
                      : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                  } neu-text-embossed`}>
                    <span className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                    {isTimerRunning ? 'Focus Session Running' : 'Focus Session Paused'}
                  </span>

                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${cardBg} border ${cardBorder} ${sunkenSm} ${subtextColor}`}>
                    {timerMode} • {timerMinutes}M
                  </span>
                </div>

                <div className={`text-base sm:text-lg font-black ${headlineText} mt-1 neu-text-headline flex items-center gap-2`}>
                  <Target className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="truncate max-w-xs sm:max-w-md">
                    {activeTask ? activeTask.title : 'General Circadian Deep Work Session'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Digital Countdown & Quick Tactile Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-5">
              {/* Countdown Digits */}
              <div className="text-right">
                <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${isDark ? 'text-indigo-400' : 'text-indigo-600'} neu-text-headline`}>
                  {timerMinutesDisplay}:{timerSecondsDisplay}
                </div>
                <div className={`text-[10px] font-bold ${subtextColor} neu-text-embossed`}>
                  {Math.ceil(timerSecondsRemaining / 60)} min left • {Math.round(timerProgressPercent * 100)}% done
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={onToggleTimer}
                  className={`px-4 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                    isTimerRunning
                      ? isDark
                        ? 'bg-[#1b202c] text-amber-400 border-amber-500/30 shadow-[inset_2px_2px_5px_#07080b,inset_-2px_-2px_5px_#222734]'
                        : 'bg-[#ebf0f7] text-amber-700 border-white/40 shadow-[inset_3px_3px_6px_#c2cdda,inset_-3px_-3px_6px_#ffffff]'
                      : isDark
                        ? 'bg-indigo-600 text-white shadow-[4px_4px_10px_#07080b,-4px_-4px_10px_#1c202a] hover:bg-indigo-500'
                        : 'bg-indigo-600 text-white shadow-[4px_4px_10px_#c5d0df,-4px_-4px_10px_#ffffff] hover:bg-indigo-500'
                  }`}
                  title={isTimerRunning ? 'Pause Focus Timer' : 'Resume Focus Timer'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                </button>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={onResetTimer}
                  className={`w-10 h-10 rounded-2xl ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center ${iconColor} hover:text-slate-900 active:${sunkenSm} transition-all`}
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Jump to Pomodoro Station Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick('press');
                    onNavigate('pomodoro');
                  }}
                  className={`px-3 py-2.5 rounded-2xl ${cardBg} border ${cardBorder} ${raisedSm} text-xs font-bold ${subtextColor} hover:text-indigo-500 active:${sunkenSm} transition-all flex items-center gap-1.5`}
                  title="Open Full Focus Station & Soundscapes"
                >
                  <span className="hidden sm:inline">Station</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sunken Neumorphic Progress Bar */}
          <div className="mt-4 w-full">
            <div className={`h-2.5 w-full rounded-full ${cardBg} border ${cardBorder} ${sunkenSm} overflow-hidden p-0.5`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-amber-400 transition-all duration-500"
                style={{ width: `${Math.max(2, timerProgressPercent * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main 3-Column Neumorphic Poster Grid (Faithful to Reference Image & Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: HERO HEADLINE CARD + WEATHER WIDGET CARD     */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 md:col-span-1">
          {/* Card 1: DESIGN YOU CAN FEEL. (Top Left) */}
          <div className={`rounded-3xl p-7 ${cardBg} border ${cardBorder} ${raisedLg} flex flex-col justify-between min-h-[310px] relative overflow-hidden transition-all duration-300`}>
            <div>
              <h1 className={`text-4xl sm:text-5xl font-black uppercase ${headlineText} leading-[1.05] tracking-tight neu-text-headline`}>
                DESIGN <br />
                YOU CAN <br />
                FEEL.
              </h1>

              {/* Recessed horizontal groove divider */}
              <div className={`w-14 h-1 rounded-full ${cardBg} ${sunkenSm} my-5`} />

              <p className={`text-xs sm:text-sm ${subtextColor} leading-relaxed neu-text-embossed font-medium`}>
                Neumorphism creates soft, intuitive interfaces through light, shadow
                and depth.
              </p>
            </div>

            {/* Embedded Dincharya Live Circadian Indicator */}
            <div className={`mt-6 pt-4 border-t ${borderDivider} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-500" />
                <span className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-wider neu-text-embossed`}>
                  {activePhase.name}
                </span>
              </div>
              <span className={`text-[10px] font-bold font-mono ${isDark ? 'text-slate-300' : 'text-slate-500'} ${cardBg} px-2 py-0.5 rounded-full ${sunkenSm}`}>
                {activePhase.dosha}
              </span>
            </div>
          </div>

          {/* Card 2: 3D Weather Widget (Bottom Left - Exact match to reference image) */}
          <div className={`rounded-3xl p-6 ${cardBg} border ${cardBorder} ${raisedLg} transition-all duration-300`}>
            <div className="flex items-center justify-between mb-5">
              {/* Soft 3D extruded cloud icon */}
              <div className={`w-16 h-12 rounded-2xl ${cardBg} ${raisedSm} border ${cardBorder} flex items-center justify-center`}>
                <Cloud className={`w-8 h-8 ${isDark ? 'text-indigo-400 fill-indigo-400/20' : 'text-slate-400 fill-slate-300/40'}`} />
              </div>

              {/* Temperature & Location */}
              <div className="text-right">
                <div className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-slate-100' : 'text-slate-800'} tracking-tight neu-text-headline`}>
                  23°
                </div>
                <div className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-600'} neu-text-embossed`}>
                  CLOUDY
                </div>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'} font-medium`}>
                  New York, USA
                </div>
              </div>
            </div>

            {/* 4-Day Forecast Bar (MON, TUE, WED, THU) */}
            <div className={`grid grid-cols-4 gap-2 pt-4 border-t ${borderDivider} text-center`}>
              <div>
                <div className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase neu-text-embossed`}>
                  MON
                </div>
                <div className="my-1.5 flex justify-center">
                  <Cloud className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                </div>
                <div className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>21°</div>
              </div>

              <div>
                <div className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase neu-text-embossed`}>
                  TUE
                </div>
                <div className="my-1.5 flex justify-center">
                  <CloudSun className="w-4 h-4 text-amber-500/70" />
                </div>
                <div className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>24°</div>
              </div>

              <div>
                <div className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase neu-text-embossed`}>
                  WED
                </div>
                <div className="my-1.5 flex justify-center">
                  <Cloud className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                </div>
                <div className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>22°</div>
              </div>

              <div>
                <div className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase neu-text-embossed`}>
                  THU
                </div>
                <div className="my-1.5 flex justify-center">
                  <Sun className="w-4 h-4 text-amber-500" />
                </div>
                <div className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>26°</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MIDDLE COLUMN: REAL-TIME CLOCK / ROTARY KNOB + CONTROLS    */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 items-center md:col-span-1 w-full">
          {/* Top Switcher: Antique Clock (Default) vs Rotary Timer */}
          <div className={`px-2 py-1 rounded-full ${cardBg} border ${cardBorder} ${sunkenSm} flex items-center gap-1.5`}>
            <button
              type="button"
              onClick={() => {
                sound.playClick('press');
                setCenterView('clock');
              }}
              className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                centerView === 'clock'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : `${subtextColor} hover:${headlineText}`
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Waterbury Clock</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick('press');
                setCenterView('knob');
              }}
              className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                centerView === 'knob'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : `${subtextColor} hover:${headlineText}`
              }`}
            >
              <Timer className="w-3 h-3" />
              <span>Rotary Timer</span>
            </button>
          </div>

          {/* Centerpiece 1: The Real-Time Working Antique Skeleton Clock */}
          {centerView === 'clock' ? (
            <div className="flex flex-col items-center justify-center w-full">
              {/* Antique Clock in 3D Neumorphic Circular Recessed Housing */}
              <div
                id="vintage-waterbury-watch"
                className={`p-3 sm:p-4 rounded-full ${cardBg} border ${cardBorder} ${raisedLg} flex items-center justify-center relative transition-all duration-300 hover:scale-[1.01] w-full max-w-[275px] aspect-square mx-auto`}
              >
                <VintageWaterburyClock isDark={isDark} size={255} />
              </div>
            </div>
          ) : (
            /* Centerpiece 2: Large 3D Rotary Knob (Focus & Pomodoro Duration) */
            <div className="flex flex-col items-center justify-center p-4 w-full">
              <NeuKnob
                value={timerMinutes}
                min={5}
                max={90}
                step={5}
                size={170}
                onChange={(val) => onTimerMinutesChange(val)}
                label=""
                unit="MIN"
              />
            </div>
          )}

          {/* Live Focus Timer Controller under Clock / Knob */}
          <div className="flex flex-col items-center gap-2.5 w-full">
            {/* Digital Countdown Pill */}
            <div className={`px-4 py-2 rounded-2xl ${cardBg} border ${cardBorder} ${sunkenSm} flex items-center gap-3 select-none`}>
              <Timer className={`w-4 h-4 ${isTimerRunning ? 'text-indigo-500 animate-spin' : 'text-slate-400'}`} />
              <div className={`font-mono text-base font-black tracking-tight ${isDark ? 'text-indigo-400' : 'text-indigo-600'} neu-text-headline`}>
                {timerMinutesDisplay}:{timerSecondsDisplay}
              </div>
              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${isTimerRunning ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-300/30 text-slate-500'}`}>
                {isTimerRunning ? 'RUNNING' : 'IDLE'}
              </span>
            </div>

            {/* Start / Pause / Reset Tactile Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleTimer}
                className={`px-5 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all select-none ${
                  isTimerRunning
                    ? isDark
                      ? 'bg-[#1b202c] text-amber-400 border-amber-500/30 shadow-[inset_2px_2px_5px_#07080b,inset_-2px_-2px_5px_#222734]'
                      : 'bg-[#ebf0f7] text-amber-700 border-white/40 shadow-[inset_3px_3px_6px_#c2cdda,inset_-3px_-3px_6px_#ffffff]'
                    : isDark
                      ? 'bg-indigo-600 text-white shadow-[4px_4px_10px_#07080b,-4px_-4px_10px_#1c202a] hover:bg-indigo-500'
                      : 'bg-indigo-600 text-white shadow-[4px_4px_10px_#c5d0df,-4px_-4px_10px_#ffffff] hover:bg-indigo-500'
                }`}
                title={isTimerRunning ? 'Pause Timer' : 'Start Focus Timer'}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>PAUSE FOCUS</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                    <span>START FOCUS</span>
                  </>
                )}
              </button>

              {isTimerActive && (
                <button
                  type="button"
                  onClick={onResetTimer}
                  className={`w-9 h-9 rounded-2xl ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center ${iconColor} hover:text-slate-900 active:${sunkenSm} transition-all`}
                  title="Reset to start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => onAddMinutes(5)}
                className={`px-2.5 py-2 rounded-2xl ${cardBg} border ${cardBorder} ${raisedSm} text-[10px] font-extrabold ${iconColor} hover:text-indigo-500 active:${sunkenSm} transition-all`}
                title="Add 5 minutes to timer"
              >
                +5m
              </button>
            </div>

            {activeTask && (
              <div className={`text-[10px] font-bold ${subtextColor} truncate max-w-[220px] text-center neu-text-embossed`}>
                Target: {activeTask.title}
              </div>
            )}
          </div>

          {/* 2. Three 3D Square Raised Icon Buttons: [Home] [Heart] [Profile] */}
          <div className="flex items-center justify-center gap-4">
            {/* Home button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick('press');
                onNavigate('dashboard');
              }}
              className={`w-12 h-12 rounded-2xl ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center text-[#4a80e8] ${raisedHover} active:${sunkenMd} transition-all`}
              title="Home Dashboard"
            >
              <Home className="w-5 h-5 fill-[#4a80e8]/20" />
            </button>

            {/* Heart button (links to Dincharya / Mindful rituals) */}
            <button
              type="button"
              onClick={() => {
                sound.playClick('press');
                onNavigate('dincharya');
              }}
              className={`w-12 h-12 rounded-2xl ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center ${iconColor} hover:text-rose-500 ${raisedHover} active:${sunkenMd} transition-all`}
              title="Dincharya Circadian Routines"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Profile / User button (links to Account / Cloud Sync) */}
            <button
              type="button"
              onClick={() => {
                sound.playClick('press');
                if (onOpenAuth) {
                  onOpenAuth();
                } else {
                  onNavigate('calendar');
                }
              }}
              className={`w-12 h-12 rounded-2xl ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center ${iconColor} hover:text-indigo-400 ${raisedHover} active:${sunkenMd} transition-all relative overflow-hidden`}
              title={currentUser ? `Account: ${currentUser.displayName || 'Synced'}` : 'Login / Cloud Sync'}
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-full h-full rounded-2xl object-cover p-1"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              {currentUser && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              )}
            </button>
          </div>

          {/* 3. Dual 3D Pill Toggle Buttons */}
          {/* 1st button: Focus Ambient Audio, 2nd button: Theme Switcher (Light vs Black Theme) */}
          <div className="flex items-center justify-center gap-8">
            {/* 1st Button: Soundscape toggle */}
            <div className="flex flex-col items-center">
              <NeuSwitch
                size="md"
                checked={isAmbientPlaying}
                onChange={handleToggleAmbient}
                label=""
              />
              <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'} neu-text-embossed`}>
                {isAmbientPlaying ? 'Sound On' : 'Sound Off'}
              </span>
            </div>

            {/* 2nd Button: Theme Changer (Light vs Black Theme) */}
            <div className="flex flex-col items-center">
              <NeuSwitch
                size="md"
                checked={isDark}
                onChange={(checkedDark) => {
                  sound.playClick('press');
                  onThemeChange(checkedDark ? 'dark' : 'classic');
                }}
                label=""
              />
              <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${isDark ? 'text-indigo-400' : 'text-slate-500'} neu-text-embossed`}>
                {isDark ? 'Black Theme' : 'Light Theme'}
              </span>
            </div>
          </div>

          {/* 4. Recessed Horizontal Slider with Round Bead Thumb */}
          <div className="w-full px-2">
            <NeuSlider
              value={sliderVal}
              min={0}
              max={100}
              onChange={handleSliderChange}
              label="AMBIENT INTENSITY"
            />
          </div>

          {/* 5. Focus Space Ambient Soundscape Player Card */}
          <div className={`w-full rounded-3xl p-6 ${cardBg} border ${cardBorder} ${raisedLg} flex flex-col items-center transition-all duration-300`}>
            {/* 3D Radio/Music Plate */}
            <div className={`w-16 h-16 rounded-2xl ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center mb-3`}>
              <Music className={`w-7 h-7 ${isAmbientPlaying ? 'text-indigo-500 animate-pulse' : iconColor}`} />
            </div>

            <h3 className={`text-sm font-black ${headlineText} neu-text-headline text-center`}>
              {activeSound.name}
            </h3>
            <div className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider neu-text-embossed mb-1 text-center`}>
              {activeSound.category} • {activeSound.tag}
            </div>
            <div className={`text-[10px] ${subtextColor} font-medium text-center mb-4`}>
              {activeSound.subtitle}
            </div>

            {/* Recessed Progress Bar with 3D Bead Knob */}
            <div className={`w-full h-2.5 rounded-full ${cardBg} ${sunkenSm} border ${cardBorder} relative flex items-center mb-5`}>
              <div
                className="h-full rounded-full bg-indigo-500/50 transition-all duration-300"
                style={{ width: `${((selectedSoundIndex + 1) / SOUND_OPTIONS.length) * 100}%` }}
              />
              <div
                className={`absolute w-4 h-4 rounded-full ${cardBg} ${raisedSm} border ${cardBorder} transition-all duration-300`}
                style={{ left: `calc(${((selectedSoundIndex + 1) / SOUND_OPTIONS.length) * 100}% - 8px)` }}
              />
            </div>

            {/* Media Player Controls: Previous | Play 3D Circle | Next */}
            <div className="flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={handlePrevSound}
                className={`w-8 h-8 rounded-full ${cardBg} ${iconColor} flex items-center justify-center ${raisedSm} active:${sunkenSm} transition-all`}
                title="Previous Soundscape"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* 3D Extruded Play Button */}
              <button
                type="button"
                onClick={handleToggleAmbient}
                className={`w-12 h-12 rounded-full ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center ${isDark ? 'text-slate-100' : 'text-slate-700'} hover:text-indigo-500 active:${sunkenMd} transition-all`}
                title={isAmbientPlaying ? 'Pause Soundscape' : 'Play Soundscape'}
              >
                {isAmbientPlaying ? (
                  <Pause className="w-5 h-5 text-indigo-500" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleNextSound}
                className={`w-8 h-8 rounded-full ${cardBg} ${iconColor} flex items-center justify-center ${raisedSm} active:${sunkenSm} transition-all`}
                title="Next Soundscape"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Link to Pomodoro Focus Station */}
            <button
              type="button"
              onClick={() => {
                sound.playClick('press');
                onNavigate('pomodoro');
              }}
              className={`mt-4 text-[10px] font-bold ${isDark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'} uppercase tracking-wider flex items-center gap-1.5 neu-text-embossed`}
            >
              <span>Explore All 12 Soundscapes & Timer</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 01, 02, 03, 04 STACKED TACTILE CARDS + MANDALA */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Card 01: SOFT SHADOWS */}
            <div
              onClick={() => {
                sound.playClick('press');
                onOpenZenModal();
              }}
              className={`rounded-3xl p-5 ${cardBg} border ${cardBorder} ${raisedLg} ${raisedHover} hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-2xl font-black ${numColor} neu-text-embossed`}>
                  01
                </span>
                <div className={`w-10 h-10 rounded-full ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center ${iconColor}`}>
                  <Sun className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2">
                <h3 className={`text-xs font-black uppercase tracking-wider ${headlineText} neu-text-headline`}>
                  SOFT SHADOWS
                </h3>
                <p className={`text-[11px] ${subtextColor} leading-relaxed neu-text-embossed mt-1 font-medium`}>
                  Subtle shadows create the illusion of depth.
                </p>
              </div>
            </div>

            {/* Card 02: MONOCHROMATIC COLOR - Click to toggle Black Theme */}
            <div
              onClick={() => {
                sound.playClick('press');
                cycleTheme();
              }}
              className={`rounded-3xl p-5 ${cardBg} border ${cardBorder} ${raisedLg} ${raisedHover} hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-2xl font-black ${numColor} neu-text-embossed`}>
                  02
                </span>
                <div className={`w-10 h-10 rounded-full ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center ${isDark ? 'text-indigo-400' : iconColor}`}>
                  <Palette className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2">
                <h3 className={`text-xs font-black uppercase tracking-wider ${headlineText} neu-text-headline`}>
                  {isDark ? 'MONOCHROMATIC BLACK' : 'MONOCHROMATIC WHITE'}
                </h3>
                <p className={`text-[11px] ${subtextColor} leading-relaxed neu-text-embossed mt-1 font-medium`}>
                  {isDark ? 'Obsidian matte tactile surface. Click to switch to Light Theme.' : 'Pure monochromatic white tactile surface. Click to switch to Black Theme.'}
                </p>
              </div>
            </div>

            {/* Card 03: RAISED & PRESSED */}
            <div
              onClick={() => {
                sound.playClick('press');
                onNavigate('tasks');
              }}
              className={`rounded-3xl p-5 ${cardBg} border ${cardBorder} ${raisedLg} ${raisedHover} hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-2xl font-black ${numColor} neu-text-embossed`}>
                  03
                </span>
                <div className={`w-10 h-10 rounded-full ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center ${iconColor}`}>
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2">
                <h3 className={`text-xs font-black uppercase tracking-wider ${headlineText} neu-text-headline`}>
                  RAISED & PRESSED
                </h3>
                <p className={`text-[11px] ${subtextColor} leading-relaxed neu-text-embossed mt-1 font-medium`}>
                  Elements appear to raise up or press down.
                </p>
              </div>
            </div>

            {/* Card 04: MINIMAL UI */}
            <div
              onClick={() => {
                sound.playClick('press');
                onNavigate('analytics');
              }}
              className={`rounded-3xl p-5 ${cardBg} border ${cardBorder} ${raisedLg} ${raisedHover} hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-2xl font-black ${numColor} neu-text-embossed`}>
                  04
                </span>
                <div className={`w-10 h-10 rounded-full ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center ${iconColor}`}>
                  <Grid className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2">
                <h3 className={`text-xs font-black uppercase tracking-wider ${headlineText} neu-text-headline`}>
                  MINIMAL UI
                </h3>
                <p className={`text-[11px] ${subtextColor} leading-relaxed neu-text-embossed mt-1 font-medium`}>
                  Clean, simple and focused on what matters.
                </p>
              </div>
            </div>
          </div>

          {/* Sacred Dotted Ring & Lotus Mandala (Bottom Right of reference image) */}
          <div className="flex items-center justify-center pt-2">
            <div
              onClick={() => {
                sound.playChime();
                onOpenZenModal();
              }}
              className="relative w-28 h-28 flex items-center justify-center cursor-pointer group"
              title="Touch to trigger Zen Chime"
            >
              {/* Concentric Dotted Rings */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className={`stroke-slate-400/${isDark ? '20' : '40'}`}
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="1.5 5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  className={`stroke-slate-400/${isDark ? '15' : '30'}`}
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="1 4"
                />
              </svg>

              {/* 3D Lotus Center Disk */}
              <div className={`w-14 h-14 rounded-full ${cardBg} border ${cardBorder} ${raisedSm} group-hover:${raisedHover} active:${sunkenMd} flex items-center justify-center ${iconColor} group-hover:text-amber-500 transition-all`}>
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attribution at the very bottom */}
      <div className="mt-8 pt-4 border-t border-slate-300/20 dark:border-white/[0.05] flex justify-center items-center">
        <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'} tracking-wide neu-text-embossed`}>
          made by <span className="font-semibold text-indigo-500">shakti prosad Dey</span>
        </p>
      </div>
    </div>
  );
};
