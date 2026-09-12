import React, { useRef, useState, useEffect } from 'react';
import { sound } from '../utils/audio';

// Pristine White Glass Card Container
interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'raised' | 'flat' | 'sunken' | 'convex' | 'concave';
  elevation?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const NeuCard: React.FC<NeuCardProps> = ({
  variant = 'flat',
  elevation = 'md',
  interactive = false,
  active = false,
  className = '',
  children,
  onClick,
  ...rest
}) => {
  const getCardStyle = () => {
    if (active) {
      return 'bg-[var(--bg-base)] border border-[var(--border-sunken)] shadow-[var(--neu-shadow-sunken)]';
    }
    if (variant === 'sunken') {
      return 'bg-[var(--bg-base)] border border-[var(--border-sunken)] shadow-[var(--neu-shadow-sunken)]';
    }
    if (variant === 'convex') {
      return 'bg-gradient-to-br from-[var(--knob-bg-from)] to-[var(--knob-bg-to)] border border-[var(--border-color)] shadow-[var(--neu-shadow-raised)]';
    }
    if (elevation === 'lg') {
      return 'bg-[var(--bg-base)] border border-[var(--border-color)] shadow-[var(--neu-shadow-raised-lg)]';
    }
    if (elevation === 'sm') {
      return 'bg-[var(--bg-base)] border border-[var(--border-color)] shadow-[var(--neu-shadow-raised-sm)]';
    }
    return 'bg-[var(--bg-base)] border border-[var(--border-color)] shadow-[var(--neu-shadow-raised)]';
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 md:p-6 transition-all duration-200 ${getCardStyle()} ${
        interactive
          ? 'cursor-pointer hover:shadow-[var(--neu-shadow-raised-lg)] hover:-translate-y-0.5'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export const ModernCard = NeuCard;

// Pristine White Neumorphic Button
interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  shape?: 'circle' | 'pill' | 'square' | 'rounded';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  soundType?: 'press' | 'knob';
  glow?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const NeuButton: React.FC<NeuButtonProps> = ({
  active = false,
  shape = 'rounded',
  size = 'md',
  soundType = 'press',
  glow = false,
  variant = 'default',
  className = '',
  children,
  onClick,
  onMouseDown,
  onMouseUp,
  ...rest
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getShapeClass = () => {
    switch (shape) {
      case 'circle':
        return 'rounded-full aspect-square flex items-center justify-center p-0';
      case 'pill':
        return 'rounded-full px-4 py-2';
      case 'square':
        return 'rounded-2xl aspect-square flex items-center justify-center p-0';
      default:
        return 'rounded-2xl px-4 py-2.5';
    }
  };

  const getSizeClass = () => {
    if (shape === 'circle' || shape === 'square') {
      switch (size) {
        case 'sm':
          return 'w-8 h-8 text-xs';
        case 'lg':
          return 'w-12 h-12 text-lg';
        case 'xl':
          return 'w-14 h-14 text-xl';
        default:
          return 'w-10 h-10 text-sm';
      }
    }
    switch (size) {
      case 'sm':
        return 'text-xs px-2.5 py-1.5';
      case 'lg':
        return 'text-base px-5 py-3';
      case 'xl':
        return 'text-lg px-7 py-3.5 font-bold';
      default:
        return 'text-sm font-medium';
    }
  };

  const getVariantClass = () => {
    if (active || isPressed) {
      return 'bg-[var(--bg-base)] text-indigo-500 border border-[var(--border-sunken)] shadow-[var(--neu-shadow-sunken)] font-semibold';
    }
    if (variant === 'primary') {
      return 'bg-[var(--bg-base)] text-indigo-500 border border-[var(--border-color)] shadow-[var(--neu-shadow-raised-sm)] hover:shadow-[var(--neu-shadow-raised)]';
    }
    if (variant === 'ghost') {
      return 'bg-transparent hover:bg-white/10 text-[var(--text-primary)] border-transparent';
    }
    if (variant === 'outline') {
      return 'bg-[var(--bg-base)] border border-[var(--border-color)] shadow-[var(--neu-shadow-raised-sm)] text-[var(--text-primary)]';
    }
    // default neumorphic
    return 'bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-[var(--neu-shadow-raised-sm)] hover:shadow-[var(--neu-shadow-raised)] active:shadow-[var(--neu-shadow-sunken)]';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    sound.playClick(soundType as 'press' | 'knob');
    if (onMouseDown) onMouseDown(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    sound.playClick('release');
    if (onMouseUp) onMouseUp(e);
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center font-medium border select-none touch-manipulation transition-all duration-150 active:scale-[0.97] outline-none disabled:opacity-50 disabled:pointer-events-none ${getShapeClass()} ${getSizeClass()} ${getVariantClass()} ${
        glow ? 'ring-2 ring-indigo-400/30' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export const ModernButton = NeuButton;

// Glass Rotary Dial / Focus Controller
interface NeuKnobProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  size?: number;
  onChange: (val: number) => void;
  label?: string;
  unit?: string;
}

export const NeuKnob: React.FC<NeuKnobProps> = ({
  value,
  min = 5,
  max = 90,
  step = 1,
  size = 150,
  onChange,
  label = 'FOCUS TIME',
  unit = 'MIN',
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percent = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const currentAngle = -135 + percent * 270;

  const handlePointer = (clientX: number, clientY: number) => {
    if (!knobRef.current) return;
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rad = Math.atan2(clientY - centerY, clientX - centerX);
    let deg = rad * (180 / Math.PI);
    deg = (deg + 90 + 360) % 360;

    let targetPercent: number;
    if (deg >= 225 && deg <= 360) {
      targetPercent = (deg - 225) / 270;
    } else if (deg <= 135) {
      targetPercent = (deg + 135) / 270;
    } else {
      return;
    }

    targetPercent = Math.max(0, Math.min(1, targetPercent));
    let rawVal = min + targetPercent * (max - min);
    rawVal = Math.round(rawVal / step) * step;
    rawVal = Math.max(min, Math.min(max, rawVal));

    if (rawVal !== value) {
      sound.playClick('knob');
      onChange(rawVal);
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handlePointer(e.clientX, e.clientY);
    };
    const onMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        e.preventDefault();
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, value]);

  const stepDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = Math.max(min, value - step);
    if (next !== value) {
      sound.playClick('knob');
      onChange(next);
    }
  };

  const stepUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = Math.min(max, value + step);
    if (next !== value) {
      sound.playClick('knob');
      onChange(next);
    }
  };

  return (
    <div className="flex flex-col items-center select-none touch-none">
      {label && (
        <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-2">
          {label}
        </span>
      )}

      <div
        ref={knobRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handlePointer(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
        }}
        style={{ width: size, height: size }}
        className="relative rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[var(--neu-shadow-raised-lg)]"
      >
        {/* Perimeter Ticks Dotted Ring (matching reference image) */}
        <div className="absolute -inset-4 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              className="stroke-slate-400/40"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="1.5 6"
              strokeLinecap="round"
            />
            {/* Active arc indicator dot */}
            <circle
              cx="50"
              cy="50"
              r="46"
              className="stroke-indigo-600/70 transition-all duration-150"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="289"
              strokeDashoffset={289 * (1 - percent * 0.75)}
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Rotary Dial Surface with Inset Finger Indent */}
        <div
          style={{ width: size * 0.82, height: size * 0.82 }}
          className="relative rounded-full bg-gradient-to-br from-[var(--knob-bg-from)] to-[var(--knob-bg-to)] border border-[var(--border-color)] flex flex-col items-center justify-center shadow-[var(--neu-shadow-raised-sm)]"
        >
          {/* Rotating Finger Indentation Dot (matching reference image) */}
          <div
            style={{
              transform: `rotate(${currentAngle}deg)`,
            }}
            className="absolute inset-0 flex justify-center pointer-events-none p-3"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-[var(--bg-base)] shadow-[var(--neu-shadow-sunken-sm)] border border-[var(--border-sunken)]" />
          </div>

          <div className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-mono leading-none tracking-tight neu-text-headline">
            {value}
          </div>
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase mt-1 neu-text-embossed">
            {unit}
          </div>
        </div>
      </div>

      {/* Touch-Friendly Step Buttons */}
      <div className="flex items-center gap-4 mt-4">
        <button
          type="button"
          onClick={stepDown}
          disabled={value <= min}
          className="w-8 h-8 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center text-sm font-bold shadow-[var(--neu-shadow-raised-sm)] hover:shadow-[var(--neu-shadow-raised)] active:shadow-[var(--neu-shadow-sunken-sm)] disabled:opacity-30 disabled:pointer-events-none transition-all"
          title="Decrease"
        >
          -
        </button>
        <span className="text-xs font-semibold text-[var(--text-secondary)] font-mono neu-text-embossed">
          {value} {unit}
        </span>
        <button
          type="button"
          onClick={stepUp}
          disabled={value >= max}
          className="w-8 h-8 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-primary)] flex items-center justify-center text-sm font-bold shadow-[var(--neu-shadow-raised-sm)] hover:shadow-[var(--neu-shadow-raised)] active:shadow-[var(--neu-shadow-sunken-sm)] disabled:opacity-30 disabled:pointer-events-none transition-all"
          title="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
};

// Neumorphic 3D Toggle Switch
interface NeuSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const NeuSwitch: React.FC<NeuSwitchProps> = ({
  checked,
  onChange,
  label,
  size = 'md',
}) => {
  const handleClick = () => {
    sound.playClick(checked ? 'release' : 'press');
    onChange(!checked);
  };

  const dims = {
    sm: { track: 'w-12 h-6', thumb: 'w-5 h-5', travel: 'translate-x-6' },
    md: { track: 'w-14 h-7', thumb: 'w-6 h-6', travel: 'translate-x-7' },
    lg: { track: 'w-18 h-9', thumb: 'w-8 h-8', travel: 'translate-x-9' },
  }[size];

  return (
    <div
      onClick={handleClick}
      className="inline-flex items-center gap-3 cursor-pointer select-none group"
    >
      {label && (
        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider neu-text-embossed">
          {label}
        </span>
      )}
      <div
        className={`${dims.track} rounded-full p-0.5 bg-[var(--bg-base)] shadow-[var(--neu-shadow-sunken)] border border-[var(--border-sunken)] transition-all duration-200 relative flex items-center`}
      >
        <div
          className={`${dims.thumb} rounded-full bg-gradient-to-br from-[var(--switch-thumb-from)] to-[var(--switch-thumb-to)] shadow-[var(--neu-shadow-raised-sm)] border border-[var(--border-color)] transition-transform duration-200 ease-out flex items-center justify-center ${
            checked ? dims.travel : 'translate-x-0'
          }`}
        >
          {checked && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />}
        </div>
      </div>
    </div>
  );
};

// Neumorphic 3D Slider
interface NeuSliderProps {
  value: number; // 0 to 100
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
  className?: string;
}

export const NeuSlider: React.FC<NeuSliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  className = '',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percent = Math.max(0, Math.min(1, (value - min) / (max - min)));

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    let raw = min + pos * (max - min);
    raw = Math.round(raw / step) * step;
    raw = Math.max(min, Math.min(max, raw));
    if (raw !== value) {
      onChange(raw);
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const onMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, value]);

  return (
    <div className={`w-full select-none touch-none ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider neu-text-embossed">
            {label}
          </span>
          <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
            {value}%
          </span>
        </div>
      )}
      <div
        ref={trackRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches[0]) handleMove(e.touches[0].clientX);
        }}
        className="h-3.5 w-full rounded-full bg-[var(--bg-base)] shadow-[var(--neu-shadow-sunken-sm)] border border-[var(--border-sunken)] relative cursor-pointer flex items-center touch-none p-0.5"
      >
        <div
          style={{ width: `${percent * 100}%` }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500/30 to-indigo-500"
        />
        <div
          style={{ left: `calc(${percent * 100}% - 10px)` }}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--bg-base)] shadow-[var(--neu-shadow-raised-sm)] border border-[var(--border-color)] cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_4px_rgba(99,102,241,0.8)]" />
        </div>
      </div>
    </div>
  );
};

// Neumorphic Checkbox
interface NeuCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: React.ReactNode;
}

export const NeuCheckbox: React.FC<NeuCheckboxProps> = ({
  checked,
  onChange,
  size = 'md',
  label,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick(checked ? 'release' : 'press');
    onChange(!checked);
  };

  const dim = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div
      onClick={handleClick}
      className="inline-flex items-center gap-3 cursor-pointer select-none group"
    >
      <div
        className={`rounded-lg flex items-center justify-center transition-all duration-150 border ${dim} ${
          checked
            ? 'bg-[var(--bg-base)] border-[var(--border-sunken)] text-indigo-500 shadow-[var(--neu-shadow-sunken-sm)]'
            : 'bg-[var(--bg-base)] border-[var(--border-color)] shadow-[var(--neu-shadow-raised-sm)] text-transparent hover:shadow-[var(--neu-shadow-raised)]'
        }`}
      >
        <svg
          className={`w-3.5 h-3.5 stroke-current stroke-[3] transition-transform ${
            checked ? 'scale-100' : 'scale-50'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      {label && (
        <span
          className={`text-sm font-medium transition-colors ${
            checked ? 'line-through text-slate-400' : 'text-[var(--text-primary)]'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export const ModernCheckbox = NeuCheckbox;

// Pristine White Neumorphic Input
interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const NeuInput: React.FC<NeuInputProps> = ({
  icon,
  className = '',
  ...rest
}) => {
  return (
    <div className="relative flex items-center w-full">
      {icon && (
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        className={`w-full bg-[#ebf0f7] rounded-xl py-2.5 px-3.5 text-slate-800 placeholder-slate-400 border border-white/40 shadow-[inset_3px_3px_6px_#c2cdda,inset_-3px_-3px_6px_#ffffff] focus:border-indigo-500/60 outline-none transition-all text-sm font-medium ${
          icon ? 'pl-10' : ''
        } ${className}`}
        {...rest}
      />
    </div>
  );
};

export const ModernInput = NeuInput;
