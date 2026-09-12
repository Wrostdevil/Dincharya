export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskCategory = 'Work' | 'Design' | 'Study' | 'Health' | 'Personal';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Priority;
  completed: boolean;
  pomodorosEstimated: number;
  pomodorosCompleted: number;
  focusMinutesTotal: number;
  createdAt: string;
  dueDate?: string;
  subtasks: Subtask[];
}

export type FocusMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'deepWork' | 'custom';

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  mode: FocusMode;
  timestamp: string; // ISO date string
  completed: boolean;
}

export type ThemeName = 'classic' | 'warm' | 'sage' | 'dark';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  bgBase: string;
  shadowLight: string;
  shadowDark: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
}

export type ActivePage = 'dashboard' | 'dincharya' | 'calendar' | 'tasks' | 'pomodoro' | 'analytics' | 'music' | 'poster';

export type DincharyaPhase = 'pratah' | 'vyayama' | 'madhyanha' | 'aparanha' | 'sandhya' | 'ratri';
export type DoshaEnergy = 'Vata' | 'Pitta' | 'Kapha';

export interface DincharyaHabit {
  id: string;
  title: string;
  sanskritName: string;
  description: string;
  phase: DincharyaPhase;
  timeRange: string;
  startHour: number; // 0-23
  endHour: number;   // 0-23
  dosha: DoshaEnergy;
  completed: boolean;
  benefit: string;
  icon: string;
}

export interface CalendarDayInfo {
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasTasks: boolean;
  hasSessions: boolean;
  completedHabitsCount: number;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  location: string;
  high: number;
  low: number;
  forecast: {
    day: string;
    temp: number;
    icon: 'cloud' | 'sun' | 'cloud-sun' | 'rain';
  }[];
}

export type TimeRange = 'day' | 'week' | 'month' | 'year';

export type AmbientSoundType =
  | 'rain'
  | 'thunder'
  | 'ocean'
  | 'binaural'
  | 'binaural_alpha'
  | 'binaural_theta'
  | 'binaural_delta'
  | 'cortisol_528'
  | 'cortisol_432'
  | 'tibetan_bowl'
  | 'zen'
  | 'brownnoise'
  | 'whitenoise';

export interface SoundOption {
  id: AmbientSoundType;
  name: string;
  category: 'Binaural Beats' | 'Cortisol Removal' | 'Nature & Focus';
  subtitle: string;
  description: string;
  tag: string;
}

export interface AmbientSound {
  id: string;
  name: string;
  icon: string;
  volume: number; // 0 to 1
  isPlaying: boolean;
}
