import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { NeuButton } from './NeumorphicElements';
import { sound } from '../utils/audio';

interface ZenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZenModal: React.FC<ZenModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(60);
      return;
    }

    sound.playChime();

    // Breathing 4-4-4 box breathing cycle (12 seconds per cycle)
    const phaseInterval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(phaseInterval);
          return 0;
        }

        const cyclePos = (60 - prev) % 12;
        if (cyclePos < 4) {
          setPhase('Inhale');
        } else if (cyclePos < 8) {
          setPhase('Hold');
        } else {
          setPhase('Exhale');
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(phaseInterval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white/85 backdrop-blur-2xl border border-white w-full max-w-md rounded-3xl p-8 text-center relative shadow-2xl flex flex-col items-center">
        <button
          onClick={() => {
            sound.playClick('press');
            onClose();
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full bg-white/80 border border-white shadow-xs hover:bg-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase mb-1">
          Less Noise • More Clarity
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
          1-Minute Mindful Breath
        </h2>

        {/* Pulsing Breathing Circle */}
        <div className="relative w-56 h-56 flex items-center justify-center my-4 select-none">
          {/* Animated concentric ripples in frosted glass */}
          <div
            className={`absolute inset-0 rounded-full bg-indigo-100/50 border border-indigo-200/50 backdrop-blur-xs transition-transform duration-[4000ms] ease-in-out ${
              phase === 'Inhale'
                ? 'scale-110 opacity-90'
                : phase === 'Hold'
                ? 'scale-110 opacity-80'
                : 'scale-90 opacity-40'
            }`}
          />

          <div
            className={`w-40 h-40 rounded-full bg-white/90 backdrop-blur-md flex flex-col items-center justify-center shadow-lg border border-white transition-transform duration-[4000ms] ease-in-out ${
              phase === 'Inhale'
                ? 'scale-105'
                : phase === 'Hold'
                ? 'scale-105'
                : 'scale-95'
            }`}
          >
            {/* Lotus icon */}
            <svg
              className="w-8 h-8 text-indigo-500 mb-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M12 3c-2 4-5 8-5 12a5 5 0 0 0 10 0c0-4-3-8-5-12z" />
              <path d="M7 15c-3-1-5-4-5-7 3 0 6 2 7 5" />
              <path d="M17 15c3-1 5-4 5-7-3 0-6 2-7 5" />
            </svg>

            <span className="text-lg font-black text-slate-900 tracking-wider uppercase">
              {phase}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400 mt-0.5">
              {secondsRemaining}s left
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium max-w-xs mt-4 leading-relaxed">
          Release tension in your jaw and shoulders. Inhale calmness, exhale mental clutter.
        </p>

        <NeuButton
          shape="pill"
          size="sm"
          variant="primary"
          onClick={onClose}
          className="mt-6 font-bold"
        >
          Finish Breathing Reset
        </NeuButton>
      </div>
    </div>
  );
};
