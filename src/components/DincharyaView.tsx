import React, { useState, useEffect } from 'react';
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Droplets,
  Wind,
  Flame,
  Coffee,
  Zap,
  Utensils,
  Footprints,
  Briefcase,
  Apple,
  Smartphone,
  HeartHandshake,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Info,
  Plus,
  Compass,
  Trophy,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DincharyaHabit, DincharyaPhase, DoshaEnergy } from '../types';
import {
  DEFAULT_DINCHARYA_HABITS,
  DINCHARYA_PHASES,
  getCurrentDincharyaPhase,
  PhaseDetails,
} from '../utils/dincharyaData';
import { sound } from '../utils/audio';
import { NeuCard, NeuButton, NeuCheckbox } from './NeumorphicElements';

interface DincharyaViewProps {
  habits: DincharyaHabit[];
  onToggleHabit: (id: string) => void;
  onAddCustomHabit?: (habit: DincharyaHabit) => void;
  onStartFocusOnHabit?: (habit: DincharyaHabit) => void;
}

export const DincharyaView: React.FC<DincharyaViewProps> = ({
  habits,
  onToggleHabit,
  onAddCustomHabit,
  onStartFocusOnHabit,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<DincharyaPhase | 'all'>('all');
  const [showDoshaGuide, setShowDoshaGuide] = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [activePhase, setActivePhase] = useState<PhaseDetails>(getCurrentDincharyaPhase(new Date().getHours()));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Custom Habit State
  const [newTitle, setNewTitle] = useState('');
  const [newSanskrit, setNewSanskrit] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPhase, setNewPhase] = useState<DincharyaPhase>('pratah');
  const [newTimeRange, setNewTimeRange] = useState('06:00 AM - 06:30 AM');
  const [newDosha, setNewDosha] = useState<DoshaEnergy>('Vata');
  const [newBenefit, setNewBenefit] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hr = now.getHours();
      setCurrentHour(hr);
      setActivePhase(getCurrentDincharyaPhase(hr));
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredHabits = selectedFilter === 'all'
    ? habits
    : habits.filter((h) => h.phase === selectedFilter);

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    const willBeCompleted = habit ? !habit.completed : false;

    if (willBeCompleted) {
      sound.playChime();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#4f46e5', '#f59e0b', '#10b981', '#ffffff'],
      });
    }

    onToggleHabit(id);
  };

  const getDoshaBadge = (dosha: DoshaEnergy) => {
    switch (dosha) {
      case 'Vata':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            <Wind className="w-3 h-3 text-sky-500" />
            <span>Vata</span>
          </span>
        );
      case 'Pitta':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Flame className="w-3 h-3 text-amber-500" />
            <span>Pitta</span>
          </span>
        );
      case 'Kapha':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Droplets className="w-3 h-3 text-emerald-500" />
            <span>Kapha</span>
          </span>
        );
    }
  };

  const getHabitIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4' };
    switch (iconName) {
      case 'Sunrise': return <Sunrise {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Wind': return <Wind {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Coffee': return <Coffee {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'Footprints': return <Footprints {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Moon': return <Moon {...props} />;
      case 'Sunset': return <Sunset {...props} />;
      case 'Apple': return <Apple {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      case 'HeartHandshake': return <HeartHandshake {...props} />;
      default: return <ShieldAlert {...props} />;
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newHabit: DincharyaHabit = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      sanskritName: newSanskrit || newTitle,
      description: newDesc || 'Personalized circadian routine.',
      phase: newPhase,
      timeRange: newTimeRange,
      startHour: 6,
      endHour: 7,
      dosha: newDosha,
      completed: false,
      benefit: newBenefit || 'Supports balanced living and mindful consistency.',
      icon: 'Sun',
    };
    if (onAddCustomHabit) onAddCustomHabit(newHabit);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSanskrit('');
    setNewDesc('');
    setNewBenefit('');
  };

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6">
      {/* Top Banner & Vedic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600">
            <Compass className="w-4 h-4" />
            <span>Ayurvedic Circadian Science • दिनचर्या</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
            Dincharya Daily Routine
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mt-1">
            Align your biological rhythms with the diurnal cycles of nature. Cultivate sustained vitality, deep focus, and restorative sleep.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <NeuButton
            shape="pill"
            size="sm"
            onClick={() => setShowDoshaGuide(!showDoshaGuide)}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>{showDoshaGuide ? 'Hide Dosha Guide' : 'Dosha Wisdom'}</span>
          </NeuButton>

          <NeuButton
            shape="pill"
            size="sm"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Ritual</span>
          </NeuButton>
        </div>
      </div>

      {/* Live Circadian Phase Card - Frosted White Glass */}
      <div className="rounded-3xl p-5 sm:p-6 mb-8 bg-white/80 backdrop-blur-2xl border border-white/95 shadow-[0_8px_32px_0_rgba(148,163,184,0.08)] transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 shadow-xs border border-amber-200/80 flex items-center justify-center flex-shrink-0 text-amber-600">
              <Sun className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Current Biological Phase
                </span>
                <span className="text-xs font-mono font-bold bg-white/90 px-2 py-0.5 rounded-full border border-slate-200/80 text-slate-700 shadow-xs">
                  {currentTimeStr || 'Live Clock'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {activePhase.name}{' '}
                <span className="text-sm font-semibold opacity-75 font-serif text-amber-700">
                  ({activePhase.sanskrit})
                </span>
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {activePhase.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 flex-shrink-0 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Phase Window</span>
            <span className="text-xs font-bold font-mono text-slate-800">
              {activePhase.timeSpan}
            </span>
            <div className="mt-0.5">{getDoshaBadge(activePhase.dosha)}</div>
          </div>
        </div>
      </div>

      {/* Daily Progress & Dosha Balance Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <NeuCard className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Daily Dincharya Progress
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {completedCount} of {totalCount}{' '}
              <span className="text-sm font-bold text-slate-400 font-mono">({completionPercentage}%)</span>
            </div>
            <div className="w-36 h-2 bg-slate-100/80 rounded-full mt-2 overflow-hidden border border-slate-200/60">
              <div
                style={{ width: `${completionPercentage}%` }}
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </NeuCard>

        <NeuCard className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Dosha Flow
            </div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {activePhase.dosha} Dominant
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Element: {activePhase.element}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 shadow-xs">
            <Flame className="w-5 h-5" />
          </div>
        </NeuCard>

        <NeuCard className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Circadian Streak
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              8 Days Active
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
              Continuous Vedic Alignment
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/80 shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
        </NeuCard>
      </div>

      {/* Expandable Dosha Educational Guide */}
      {showDoshaGuide && (
        <NeuCard className="p-6 mb-8 border border-white/95 bg-white/85 backdrop-blur-2xl shadow-sm">
          <div className="flex items-center gap-2 text-indigo-700 font-black text-base uppercase tracking-tight mb-2">
            <Compass className="w-5 h-5" />
            <span>The Science of Diurnal Doshas (काल विभाग)</span>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            In Ayurveda, nature cycles through three fundamental biological energies (Doshas) twice every 24 hours. Living in sync with these cycles removes friction from your nervous system, optimizes digestion, and prevents chronic burnout:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/90 p-4 rounded-2xl border border-sky-200/80 shadow-xs">
              <span className="text-xs font-black text-sky-600 uppercase">Vata Time (वात)</span>
              <div className="text-xs font-bold text-slate-700 mt-1">
                2:00 AM – 6:00 AM & 2:00 PM – 6:00 PM
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Qualities: Light, fast, subtle, mobile. Early morning is ideal for spiritual meditation and rising; afternoon is ideal for communication, creative brainstorming, and strategy.
              </p>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-xs">
              <span className="text-xs font-black text-amber-600 uppercase">Kapha Time (कफ)</span>
              <div className="text-xs font-bold text-slate-700 mt-1">
                6:00 AM – 10:00 AM & 6:00 PM – 10:00 PM
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Qualities: Heavy, stable, cool, grounding. Morning is meant for vigorous movement (exercise, yoga) to break inertia; evening is meant for relaxation and sleeping before 10 PM.
              </p>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
              <span className="text-xs font-black text-emerald-600 uppercase">Pitta Time (पित्त)</span>
              <div className="text-xs font-bold text-slate-700 mt-1">
                10:00 AM – 2:00 PM & 10:00 PM – 2:00 AM
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Qualities: Hot, sharp, transformative. Midday corresponds to peak digestive Agni (eat your largest meal) and cognitive power; midnight Pitta governs internal organ repair.
              </p>
            </div>
          </div>
        </NeuCard>
      )}

      {/* Phase Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          onClick={() => {
            sound.playClick('press');
            setSelectedFilter('all');
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
            selectedFilter === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white/70 backdrop-blur-md text-slate-600 border-white/90 hover:bg-white'
          }`}
        >
          All Rituals ({totalCount})
        </button>

        {DINCHARYA_PHASES.map((phase) => {
          const isSelected = selectedFilter === phase.id;
          const count = habits.filter((h) => h.phase === phase.id).length;

          return (
            <button
              key={phase.id}
              onClick={() => {
                sound.playClick('press');
                setSelectedFilter(phase.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white/70 backdrop-blur-md text-slate-600 border-white/90 hover:bg-white'
              }`}
            >
              <span>{phase.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Rituals Checklist Cards - White Glass */}
      <div className="flex flex-col gap-3">
        {filteredHabits.map((habit) => {
          const isPhaseCurrent = activePhase.id === habit.phase;

          return (
            <div
              key={habit.id}
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-150 ${
                habit.completed
                  ? 'bg-white/40 backdrop-blur-xs border-slate-200/60 opacity-80'
                  : isPhaseCurrent
                  ? 'bg-white/85 backdrop-blur-xl border-indigo-300 shadow-sm ring-1 ring-indigo-500/20'
                  : 'bg-white/75 backdrop-blur-xl border-white/90 hover:bg-white/95 hover:border-white shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Checkbox */}
                <div className="pt-0.5 flex-shrink-0">
                  <NeuCheckbox
                    checked={habit.completed}
                    onChange={() => handleToggle(habit.id)}
                    size="md"
                  />
                </div>

                {/* Habit Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200/60 flex items-center justify-center text-slate-700 flex-shrink-0">
                      {getHabitIcon(habit.icon)}
                    </span>
                    <h3
                      className={`text-base font-bold tracking-tight text-slate-900 transition-all ${
                        habit.completed ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {habit.title}
                    </h3>
                    <span className="text-xs font-serif text-slate-400">
                      {habit.sanskritName}
                    </span>
                    {getDoshaBadge(habit.dosha)}
                    {isPhaseCurrent && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">
                        Active Time Window
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-2">
                    {habit.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1 font-mono font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{habit.timeRange}</span>
                    </div>

                    <span className="hidden sm:inline text-slate-300">•</span>

                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <Sparkles className="w-3 h-3 flex-shrink-0" />
                      <span>{habit.benefit}</span>
                    </div>
                  </div>
                </div>

                {/* Quick focus trigger */}
                {onStartFocusOnHabit && (
                  <NeuButton
                    shape="pill"
                    size="sm"
                    onClick={() => onStartFocusOnHabit(habit)}
                    className="hidden sm:flex text-xs font-bold text-indigo-600 flex-shrink-0"
                    title="Focus on this ritual with Pomodoro timer"
                  >
                    Focus
                  </NeuButton>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Ritual Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-1">
              Add Custom Dincharya Ritual
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Incorporate your personal wellness practices, meditation, or Ayurvedic rituals.
            </p>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Ritual Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Copper Water / 20-min Pranayama"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/90 p-2.5 text-sm bg-white/80 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Sanskrit / Traditional Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ध्यानम्"
                    value={newSanskrit}
                    onChange={(e) => setNewSanskrit(e.target.value)}
                    className="w-full rounded-xl border border-white/90 p-2.5 text-sm bg-white/80 outline-none shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 06:30 AM - 07:00 AM"
                    value={newTimeRange}
                    onChange={(e) => setNewTimeRange(e.target.value)}
                    className="w-full rounded-xl border border-white/90 p-2.5 text-sm bg-white/80 outline-none shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Phase of Day
                  </label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as DincharyaPhase)}
                    className="w-full rounded-xl border border-white/90 p-2.5 text-xs font-bold bg-white/80 outline-none shadow-inner"
                  >
                    <option value="pratah">Morning Awakening (4:30 - 6 AM)</option>
                    <option value="vyayama">Movement & Self-Care (6 - 8:30 AM)</option>
                    <option value="madhyanha">Midday Intellect & Food (8:30 AM - 1:30 PM)</option>
                    <option value="aparanha">Afternoon Flow (1:30 - 5:30 PM)</option>
                    <option value="sandhya">Sunset Pause (5:30 - 7:30 PM)</option>
                    <option value="ratri">Night Calm & Sleep (8:30 PM+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Governing Dosha
                  </label>
                  <select
                    value={newDosha}
                    onChange={(e) => setNewDosha(e.target.value as DoshaEnergy)}
                    className="w-full rounded-xl border border-white/90 p-2.5 text-xs font-bold bg-white/80 outline-none shadow-inner"
                  >
                    <option value="Vata">Vata (Air & Space)</option>
                    <option value="Pitta">Pitta (Fire & Agni)</option>
                    <option value="Kapha">Kapha (Earth & Water)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Description & How to practice
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain the step-by-step habit..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-white/90 p-2.5 text-xs bg-white/80 outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Ayurvedic Benefit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clears mental fog and activates lymphatic flow"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  className="w-full rounded-xl border border-white/90 p-2.5 text-xs bg-white/80 outline-none shadow-inner"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <NeuButton
                  type="button"
                  shape="pill"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </NeuButton>
                <NeuButton
                  type="submit"
                  shape="pill"
                  size="sm"
                  variant="primary"
                  className="font-bold"
                >
                  Save Ritual
                </NeuButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
