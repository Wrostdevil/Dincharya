import { Task, FocusSession, ThemeName, WeatherInfo, DincharyaHabit } from '../types';
import { DEFAULT_DINCHARYA_HABITS } from './dincharyaData';

const TASKS_STORAGE_KEY = 'neu_productivity_tasks_v1';
const SESSIONS_STORAGE_KEY = 'neu_productivity_sessions_v1';
const THEME_STORAGE_KEY = 'neu_productivity_theme_v1';
const SOUND_STORAGE_KEY = 'neu_productivity_sound_v1';
const HABITS_STORAGE_KEY = 'dincharya_habits_v1';

const todayDateStr = new Date().toISOString().split('T')[0];
const yesterdayDateStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrowDateStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Daily Dincharya Morning Rituals',
    description: 'Brahma Muhurta rising, Ushapan warm water, Jivha Nirlekhana, and Surya Namaskar flow.',
    category: 'Health',
    priority: 'urgent',
    completed: false,
    pomodorosEstimated: 2,
    pomodorosCompleted: 1,
    focusMinutesTotal: 25,
    createdAt: new Date().toISOString(),
    dueDate: todayDateStr,
    subtasks: [
      { id: 'sub-1', title: 'Drink 2 glasses warm copper water', completed: true },
      { id: 'sub-2', title: 'Practice 12 rounds Surya Namaskar', completed: true },
      { id: 'sub-3', title: '10-min Nadi Shodhana Pranayama', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Deep Work Sprint: Peak Cognitive Focus',
    description: 'Capitalize on midday Pitta sharp intelligence for high-order project architecture.',
    category: 'Work',
    priority: 'high',
    completed: false,
    pomodorosEstimated: 4,
    pomodorosCompleted: 2,
    focusMinutesTotal: 50,
    createdAt: new Date().toISOString(),
    dueDate: todayDateStr,
    subtasks: [
      { id: 'sub-4', title: 'Draft core algorithm without distraction', completed: true },
      { id: 'sub-5', title: 'Conduct code review and verification', completed: false },
    ],
  },
  {
    id: 'task-3',
    title: 'Madhya Bhojan & Shatapadi Mindful Stroll',
    description: 'Wholesome warm lunch when solar Agni is peak, followed by 100 gentle steps.',
    category: 'Health',
    priority: 'medium',
    completed: true,
    pomodorosEstimated: 1,
    pomodorosCompleted: 1,
    focusMinutesTotal: 25,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    dueDate: yesterdayDateStr,
    subtasks: [
      { id: 'sub-6', title: 'Eat mindfully without screens', completed: true },
      { id: 'sub-7', title: 'Take 100-step stroll after meal', completed: true },
    ],
  },
  {
    id: 'task-4',
    title: 'Weekly Strategy & Schedule Review',
    description: 'Synthesize accomplishments and schedule upcoming milestones on the calendar.',
    category: 'Work',
    priority: 'medium',
    completed: false,
    pomodorosEstimated: 2,
    pomodorosCompleted: 0,
    focusMinutesTotal: 0,
    createdAt: new Date().toISOString(),
    dueDate: tomorrowDateStr,
    subtasks: [
      { id: 'sub-8', title: 'Review focus analytics and habit streaks', completed: false },
    ],
  },
  {
    id: 'task-5',
    title: 'Morning Mindfulness & Zen Reset',
    description: '10 minutes deep breathing with the circadian lotus dial.',
    category: 'Health',
    priority: 'low',
    completed: true,
    pomodorosEstimated: 1,
    pomodorosCompleted: 1,
    focusMinutesTotal: 15,
    createdAt: new Date().toISOString(),
    dueDate: todayDateStr,
    subtasks: [],
  },
];

// Pre-seeded sessions across today, past week, past months so the Day/Week/Month/Year charts look authentic and rich
export const INITIAL_SESSIONS: FocusSession[] = [
  // Today's sessions
  {
    id: 'sess-today-1',
    taskId: 'task-1',
    taskTitle: 'Finalize 3D Neumorphism Design System',
    durationMinutes: 25,
    mode: 'pomodoro',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    completed: true,
  },
  {
    id: 'sess-today-2',
    taskId: 'task-1',
    taskTitle: 'Finalize 3D Neumorphism Design System',
    durationMinutes: 25,
    mode: 'pomodoro',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    completed: true,
  },
  {
    id: 'sess-today-3',
    taskId: 'task-2',
    taskTitle: 'Build Deep Focus Pomodoro Flow',
    durationMinutes: 25,
    mode: 'pomodoro',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    completed: true,
  },
  // Yesterday & earlier this week
  {
    id: 'sess-w-1',
    taskId: 'task-3',
    taskTitle: 'Curate Spotify Lo-Fi & Ambient Soundscapes',
    durationMinutes: 50,
    mode: 'deepWork',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    completed: true,
  },
  {
    id: 'sess-w-2',
    taskId: 'task-2',
    taskTitle: 'Build Deep Focus Pomodoro Flow',
    durationMinutes: 45,
    mode: 'custom',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    completed: true,
  },
  {
    id: 'sess-w-3',
    taskId: 'task-1',
    taskTitle: 'Finalize 3D Neumorphism Design System',
    durationMinutes: 50,
    mode: 'deepWork',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    completed: true,
  },
  {
    id: 'sess-w-4',
    taskTitle: 'Sprint Architecture Review',
    durationMinutes: 30,
    mode: 'pomodoro',
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    completed: true,
  },
  {
    id: 'sess-w-5',
    taskTitle: 'UI Elevation Polishing',
    durationMinutes: 60,
    mode: 'deepWork',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    completed: true,
  },
  // Month data
  {
    id: 'sess-m-1',
    taskTitle: 'Core Component Library',
    durationMinutes: 120,
    mode: 'deepWork',
    timestamp: new Date(Date.now() - 86400000 * 12).toISOString(),
    completed: true,
  },
  {
    id: 'sess-m-2',
    taskTitle: 'Tactile Dial Physics',
    durationMinutes: 90,
    mode: 'deepWork',
    timestamp: new Date(Date.now() - 86400000 * 18).toISOString(),
    completed: true,
  },
  {
    id: 'sess-m-3',
    taskTitle: 'Spotify Web Audio Testing',
    durationMinutes: 75,
    mode: 'deepWork',
    timestamp: new Date(Date.now() - 86400000 * 25).toISOString(),
    completed: true,
  },
  // Year data points
  {
    id: 'sess-y-1',
    taskTitle: 'Design Token System',
    durationMinutes: 180,
    mode: 'deepWork',
    timestamp: new Date(Date.now() - 86400000 * 60).toISOString(),
    completed: true,
  },
  {
    id: 'sess-y-2',
    taskTitle: 'Product Roadmap Planning',
    durationMinutes: 150,
    mode: 'deepWork',
    timestamp: new Date(Date.now() - 86400000 * 120).toISOString(),
    completed: true,
  },
  {
    id: 'sess-y-3',
    taskTitle: 'Winter Productivity Sprint',
    durationMinutes: 210,
    mode: 'deepWork',
    timestamp: new Date(Date.now() - 86400000 * 200).toISOString(),
    completed: true,
  },
];

export const INITIAL_WEATHER: WeatherInfo = {
  temperature: 23,
  condition: 'CLOUDY',
  location: 'New York, USA',
  high: 25,
  low: 19,
  forecast: [
    { day: 'MON', temp: 21, icon: 'cloud' },
    { day: 'TUE', temp: 24, icon: 'cloud-sun' },
    { day: 'WED', temp: 22, icon: 'cloud' },
    { day: 'THU', temp: 26, icon: 'sun' },
  ],
};

export const getStoredTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return INITIAL_TASKS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_TASKS;
  }
};

export const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
};

export const getStoredSessions = (): FocusSession[] => {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return INITIAL_SESSIONS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_SESSIONS;
  }
};

export const saveSessions = (sessions: FocusSession[]) => {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch {}
};

export const getStoredTheme = (): ThemeName => {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName;
    return theme || 'classic';
  } catch {
    return 'classic';
  }
};

export const saveTheme = (theme: ThemeName) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
};

export const getStoredSound = (): boolean => {
  try {
    const sound = localStorage.getItem(SOUND_STORAGE_KEY);
    return sound !== null ? sound === 'true' : true;
  } catch {
    return true;
  }
};

export const saveSound = (enabled: boolean) => {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
  } catch {}
};

export const getStoredHabits = (): DincharyaHabit[] => {
  try {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    if (!raw) return DEFAULT_DINCHARYA_HABITS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DINCHARYA_HABITS;
  }
};

export const saveHabits = (habits: DincharyaHabit[]) => {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch {}
};
