import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Volume2,
  VolumeX,
  Target,
  Sparkles,
  Flame,
  Radio,
  Sliders,
  ChevronDown,
  ChevronUp,
  Heart,
  Zap,
  CloudRain,
  ShieldCheck,
  Disc,
} from 'lucide-react';
import { FocusMode, Task, FocusSession, AmbientSoundType } from '../types';
import { NeuCard, NeuButton, NeuKnob, NeuSlider } from './NeumorphicElements';
import { sound, SOUND_OPTIONS } from '../utils/audio';

interface PomodoroTimerProps {
  tasks: Task[];
  activeTaskId?: string;
  onSelectTask: (taskId: string) => void;
  onSessionComplete: (session: FocusSession) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  // Shared Focus Timer State
  mode: FocusMode;
  durationMinutes: number;
  secondsRemaining: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipTimer: () => void;
  onSelectMode: (mode: FocusMode) => void;
  onDurationChange: (minutes: number) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  tasks,
  activeTaskId,
  onSelectTask,
  onSessionComplete,
  soundEnabled,
  onToggleSound,
  mode,
  durationMinutes,
  secondsRemaining,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  onSelectMode,
  onDurationChange,
}) => {
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState<number>(3);

  // Soundscape Station State
  const [ambientSound, setAmbientSound] = useState<boolean>(false);
  const [selectedSound, setSelectedSound] = useState<AmbientSoundType>('cortisol_528');
  const [ambientVolume, setAmbientVolume] = useState<number>(55);
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | 'Cortisol Removal' | 'Binaural Beats' | 'Nature & Focus'
  >('Cortisol Removal');
  const [isSoundSelectorExpanded, setIsSoundSelectorExpanded] = useState<boolean>(true);

  // Set default durations per mode
  const selectMode = (newMode: FocusMode) => {
    sound.playClick('press');
    onSelectMode(newMode);
  };

  // When rotary dial adjusts custom minutes
  const handleDialChange = (newMins: number) => {
    if (!isRunning) {
      onDurationChange(newMins);
    }
  };

  const toggleTimer = () => {
    sound.playClick('press');
    const nextRunning = !isRunning;
    onToggleTimer();

    // If starting timer and ambient sound is enabled, ensure it plays
    if (nextRunning && ambientSound) {
      sound.startAmbient(selectedSound, ambientVolume / 100);
    }
  };

  const resetTimer = () => {
    sound.playClick('press');
    onResetTimer();
  };

  const skipTimer = () => {
    sound.playClick('press');
    onSkipTimer();
  };

  // Soundscape toggling and selection
  const toggleAmbientSound = () => {
    sound.playClick('press');
    const next = !ambientSound;
    setAmbientSound(next);
    if (next) {
      sound.startAmbient(selectedSound, ambientVolume / 100);
    } else {
      sound.stopAllAmbient();
    }
  };

  const handleSelectSound = (soundId: AmbientSoundType) => {
    sound.playClick('press');
    setSelectedSound(soundId);
    setAmbientSound(true);
    sound.startAmbient(soundId, ambientVolume / 100);
  };

  const handleVolumeChange = (newVol: number) => {
    setAmbientVolume(newVol);
    if (ambientSound) {
      sound.setAmbientVolume(selectedSound, newVol / 100);
    }
  };

  // Active track info
  const currentSoundInfo =
    SOUND_OPTIONS.find((s) => s.id === selectedSound) || SOUND_OPTIONS[0];

  const filteredSounds =
    selectedCategory === 'All'
      ? SOUND_OPTIONS
      : SOUND_OPTIONS.filter((s) => s.category === selectedCategory);

  // Calculate percentage for circular progress
  const totalSeconds = durationMinutes * 60;
  const progressPercent =
    totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;

  const minutesDisplay = Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, '0');
  const secondsDisplay = (secondsRemaining % 60).toString().padStart(2, '0');

  return (
    <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 neu-text-embossed">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Focus Station & Circadian Timer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1 neu-text-headline">
            Deep Work Timer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 neu-text-embossed">
            Calibrated focus cycles paired with acoustic soundscapes, binaural beats, and cortisol removal frequencies.
          </p>
        </div>

        {/* Top Audio Toggles */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Quick Soundscape Play Button */}
          <button
            type="button"
            onClick={toggleAmbientSound}
            className={`px-3.5 py-2 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
              ambientSound
                ? 'bg-[#ebf0f7] text-indigo-700 border-white/40 shadow-[inset_3px_3px_6px_#c2cdda,inset_-3px_-3px_6px_#ffffff]'
                : 'bg-[#ebf0f7] text-slate-700 border-white/80 shadow-[4px_4px_10px_#c5d0df,-4px_-4px_10px_#ffffff] hover:shadow-[5px_5px_12px_#c0cbd9,-5px_-5px_12px_#ffffff]'
            }`}
            title="Toggle active focus soundscape"
          >
            {ambientSound ? (
              <Pause className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            ) : (
              <Play className="w-3.5 h-3.5 text-slate-600" />
            )}
            <span className="max-w-[140px] truncate neu-text-embossed">
              {currentSoundInfo.name}
            </span>
          </button>

          {/* Sound Mute Toggle */}
          <NeuButton
            shape="circle"
            size="sm"
            onClick={onToggleSound}
            title={soundEnabled ? 'Sound alerts enabled' : 'Sound alerts muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-slate-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-500" />
            )}
          </NeuButton>
        </div>
      </div>

      {/* Mode Selector Tabs in Monochromatic White Neumorphism */}
      <div className="bg-[#ebf0f7] border border-white/70 shadow-[6px_6px_14px_#c5d0df,-6px_-6px_14px_#ffffff] rounded-2xl p-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 max-w-xl mx-auto">
        {(
          [
            { id: 'pomodoro', label: 'Pomodoro', time: '25m' },
            { id: 'deepWork', label: 'Deep Work', time: '50m' },
            { id: 'shortBreak', label: 'Short Break', time: '5m' },
            { id: 'longBreak', label: 'Long Break', time: '15m' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => selectMode(item.id)}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center select-none touch-manipulation flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 ${
              mode === item.id
                ? 'bg-[#ebf0f7] text-indigo-700 shadow-[inset_2px_2px_5px_#c2cdda,inset_-2px_-2px_5px_#ffffff] font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="neu-text-embossed">{item.label}</span>
            <span className="text-[10px] opacity-75 font-mono">({item.time})</span>
          </button>
        ))}
      </div>

      {/* Main Glass/Neumorphic Timer Card */}
      <div className="rounded-3xl p-6 sm:p-10 bg-[#ebf0f7] border border-white/70 shadow-[10px_10px_24px_#c5d0df,-10px_-10px_24px_#ffffff] flex flex-col items-center justify-center mb-7">
        {/* Linked Active Task Picker */}
        <div className="w-full max-w-md mb-6 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 neu-text-embossed">
            <Target className="w-3.5 h-3.5 text-indigo-500" />
            <span>Currently Focusing On</span>
          </div>

          <div className="w-full relative">
            <select
              value={activeTaskId || ''}
              onChange={(e) => onSelectTask(e.target.value)}
              className="w-full bg-[#ebf0f7] border border-white/40 shadow-[inset_3px_3px_6px_#c2cdda,inset_-3px_-3px_6px_#ffffff] rounded-2xl py-2.5 px-4 text-xs font-bold text-slate-700 outline-none appearance-none cursor-pointer text-center hover:text-slate-900 transition-all"
            >
              <option value="">-- General Focus (No specific task) --</option>
              {tasks
                .filter((t) => !t.completed)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.pomodorosCompleted}/{t.pomodorosEstimated} 🍅)
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Circular Display with Neumorphic Progress Ring */}
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center my-2 select-none">
          {/* Outer Sunken Track */}
          <div className="absolute inset-0 rounded-full bg-[#ebf0f7] border border-white/40 shadow-[inset_6px_6px_12px_#c2cdda,inset_-6px_-6px_12px_#ffffff] p-3.5 sm:p-4 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-300/40"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-indigo-500 transition-all duration-300"
                strokeWidth="4.5"
                strokeDasharray="276.4"
                strokeDashoffset={276.4 * (1 - progressPercent)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Central Extruded Dome */}
          <div className="w-40 h-40 sm:w-54 sm:h-54 rounded-full bg-[#ebf0f7] border border-white/80 shadow-[8px_8px_18px_#c2cdda,-8px_-8px_18px_#ffffff] flex flex-col items-center justify-center">
            {/* Mode Indicator */}
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 neu-text-embossed">
              {mode}
            </span>

            {/* Countdown Digits */}
            <div className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight font-mono neu-text-headline">
              {minutesDisplay}:{secondsDisplay}
            </div>

            {/* Status Pill */}
            <div className="mt-2 text-[10px] font-bold px-3 py-0.5 rounded-full bg-[#ebf0f7] border border-white/40 shadow-[inset_1px_1px_3px_#c2cdda,inset_-1px_-1px_3px_#ffffff] text-indigo-700 uppercase tracking-wider neu-text-embossed flex items-center gap-1">
              {ambientSound && <Sparkles className="w-3 h-3 text-indigo-500 animate-spin" />}
              <span>{isRunning ? 'Flow State Active' : 'Ready to Focus'}</span>
            </div>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-5 mt-6">
          <button
            type="button"
            onClick={resetTimer}
            className="w-12 h-12 rounded-full bg-[#ebf0f7] border border-white/80 text-slate-600 flex items-center justify-center shadow-[4px_4px_10px_#c5d0df,-4px_-4px_10px_#ffffff] hover:shadow-[5px_5px_12px_#c0cbd9,-5px_-5px_12px_#ffffff] active:shadow-[inset_2px_2px_5px_#c2cdda,inset_-2px_-2px_5px_#ffffff] transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleTimer}
            className={`px-7 py-3.5 rounded-full border text-sm font-extrabold flex items-center gap-2.5 transition-all ${
              isRunning
                ? 'bg-[#ebf0f7] text-indigo-700 border-white/40 shadow-[inset_3px_3px_7px_#c2cdda,inset_-3px_-3px_7px_#ffffff]'
                : 'bg-[#ebf0f7] text-indigo-700 border-white/80 shadow-[6px_6px_14px_#c5d0df,-6px_-6px_14px_#ffffff] hover:shadow-[8px_8px_18px_#c0cbd9,-8px_-8px_18px_#ffffff] active:shadow-[inset_3px_3px_7px_#c2cdda,inset_-3px_-3px_7px_#ffffff]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 text-indigo-600" />
                <span className="neu-text-embossed">Pause Timer</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 ml-0.5 text-indigo-600" />
                <span className="neu-text-embossed">Start Focus Session</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={skipTimer}
            className="w-12 h-12 rounded-full bg-[#ebf0f7] border border-white/80 text-slate-600 flex items-center justify-center shadow-[4px_4px_10px_#c5d0df,-4px_-4px_10px_#ffffff] hover:shadow-[5px_5px_12px_#c0cbd9,-5px_-5px_12px_#ffffff] active:shadow-[inset_2px_2px_5px_#c2cdda,inset_-2px_-2px_5px_#ffffff] transition-all"
            title="Complete / Skip"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACOUSTIC SOUNDSCAPE STATION: CORTISOL REMOVAL, BINAURAL BEATS & NATURE     */}
      {/* ========================================================================= */}
      <div className="rounded-3xl p-6 sm:p-7 bg-[#ebf0f7] border border-white/70 shadow-[10px_10px_22px_#c5d0df,-10px_-10px_22px_#ffffff] mb-7">
        {/* Header & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ebf0f7] border border-white/80 shadow-[4px_4px_8px_#c5d0df,-4px_-4px_8px_#ffffff] flex items-center justify-center text-indigo-600">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-800 neu-text-headline">
                  Acoustic Soundscapes & Frequencies
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#ebf0f7] border border-white/50 text-indigo-700 shadow-[inset_1px_1px_2px_#c2cdda,inset_-1px_-1px_2px_#ffffff]">
                  {ambientSound ? 'Playing Now' : 'Idle'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5 neu-text-embossed">
                Scientifically calibrated solfeggio cortisol cleanses, binaural beat entrainment, and focus noise.
              </p>
            </div>
          </div>

          {/* Expand / Collapse Button */}
          <button
            type="button"
            onClick={() => setIsSoundSelectorExpanded(!isSoundSelectorExpanded)}
            className="self-end sm:self-auto px-3 py-1.5 rounded-xl bg-[#ebf0f7] border border-white/70 shadow-[3px_3px_7px_#c5d0df,-3px_-3px_7px_#ffffff] text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:text-slate-900"
          >
            <span>{isSoundSelectorExpanded ? 'Collapse' : 'Browse All (12)'}</span>
            {isSoundSelectorExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Volume Slider Bar */}
        <div className="p-4 rounded-2xl bg-[#ebf0f7] border border-white/60 shadow-[inset_2px_2px_5px_#c2cdda,inset_-2px_-2px_5px_#ffffff] mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleAmbientSound}
                className="w-8 h-8 rounded-full bg-[#ebf0f7] border border-white/80 shadow-[3px_3px_6px_#c5d0df,-3px_-3px_6px_#ffffff] flex items-center justify-center text-indigo-600 active:shadow-[inset_2px_2px_4px_#c2cdda,inset_-2px_-2px_4px_#ffffff]"
                title={ambientSound ? 'Pause sound' : 'Play sound'}
              >
                {ambientSound ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>
              <div>
                <div className="text-xs font-bold text-slate-800 neu-text-headline">
                  {currentSoundInfo.name}
                </div>
                <div className="text-[10px] font-medium text-slate-500 neu-text-embossed">
                  {currentSoundInfo.subtitle} • {currentSoundInfo.tag}
                </div>
              </div>
            </div>

            <div className="w-full sm:w-60">
              <NeuSlider
                value={ambientVolume}
                min={0}
                max={100}
                onChange={handleVolumeChange}
                label="Soundscape Volume"
              />
            </div>
          </div>
        </div>

        {/* Expandable Soundscape Grid */}
        {isSoundSelectorExpanded && (
          <div>
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {(
                [
                  { id: 'Cortisol Removal', label: '🧬 Cortisol Removal (3)' },
                  { id: 'Binaural Beats', label: '🎧 Binaural Beats (3)' },
                  { id: 'Nature & Focus', label: '🌧️ Nature & Focus (6)' },
                  { id: 'All', label: '🌟 All Sounds (12)' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick('press');
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#ebf0f7] text-indigo-700 shadow-[inset_2px_2px_4px_#c2cdda,inset_-2px_-2px_4px_#ffffff] border border-white/40 font-black'
                      : 'bg-[#ebf0f7] text-slate-600 shadow-[3px_3px_7px_#c5d0df,-3px_-3px_7px_#ffffff] border border-white/70 hover:text-slate-900'
                  }`}
                >
                  <span className="neu-text-embossed">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Sound Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSounds.map((snd) => {
                const isThisActive = selectedSound === snd.id;
                const isThisPlaying = isThisActive && ambientSound;

                return (
                  <div
                    key={snd.id}
                    onClick={() => handleSelectSound(snd.id)}
                    className={`rounded-2xl p-4 transition-all cursor-pointer border select-none ${
                      isThisActive
                        ? 'bg-[#ebf0f7] border-white/40 shadow-[inset_3px_3px_7px_#c2cdda,inset_-3px_-3px_7px_#ffffff]'
                        : 'bg-[#ebf0f7] border-white/70 shadow-[5px_5px_12px_#c5d0df,-5px_-5px_12px_#ffffff] hover:shadow-[7px_7px_15px_#c0cbd9,-7px_-7px_15px_#ffffff] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {snd.category === 'Cortisol Removal' && (
                          <div className="w-7 h-7 rounded-xl bg-[#ebf0f7] border border-white/70 shadow-[2px_2px_5px_#c5d0df,-2px_-2px_5px_#ffffff] flex items-center justify-center text-rose-500">
                            <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                          </div>
                        )}
                        {snd.category === 'Binaural Beats' && (
                          <div className="w-7 h-7 rounded-xl bg-[#ebf0f7] border border-white/70 shadow-[2px_2px_5px_#c5d0df,-2px_-2px_5px_#ffffff] flex items-center justify-center text-indigo-600">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {snd.category === 'Nature & Focus' && (
                          <div className="w-7 h-7 rounded-xl bg-[#ebf0f7] border border-white/70 shadow-[2px_2px_5px_#c5d0df,-2px_-2px_5px_#ffffff] flex items-center justify-center text-emerald-600">
                            <CloudRain className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-black text-slate-800 neu-text-headline leading-tight">
                            {snd.name}
                          </div>
                          <div className="text-[10px] font-bold text-slate-500 neu-text-embossed">
                            {snd.subtitle}
                          </div>
                        </div>
                      </div>

                      {/* Play State Indicator / Badge */}
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isThisPlaying
                            ? 'bg-indigo-600 text-white shadow-xs animate-pulse'
                            : isThisActive
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-200/70 text-slate-600'
                        }`}
                      >
                        {isThisPlaying ? 'LIVE' : snd.tag}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium mt-2 leading-relaxed neu-text-embossed">
                      {snd.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Rotary Dial Custom Fine-Tuning */}
      <div className="rounded-3xl p-6 sm:p-7 bg-[#ebf0f7] border border-white/70 shadow-[10px_10px_22px_#c5d0df,-10px_-10px_22px_#ffffff] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="text-sm font-black text-slate-900 uppercase tracking-tight neu-text-headline">
            Custom Interval Rotary Knob
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed neu-text-embossed">
            Drag or click the tactile dial to manually calibrate any custom focus session between 5 and 90 minutes.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="neu-text-embossed">
              Today&apos;s Completed Sessions: {sessionsCompletedToday}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <NeuKnob
            value={durationMinutes}
            min={5}
            max={90}
            step={5}
            size={140}
            onChange={handleDialChange}
            label="Custom Time"
          />
        </div>
      </div>
    </div>
  );
};
