import React, { useState, useEffect } from 'react';
import {
  LayoutTemplate,
  Sun,
  Moon,
  Calendar as CalendarIcon,
  CheckSquare,
  Timer,
  BarChart3,
  Music,
  Plus,
  Search,
  Volume2,
  VolumeX,
  Compass,
  User as UserIcon,
  Cloud,
  LogIn,
} from 'lucide-react';
import {
  Task,
  FocusSession,
  ActivePage,
  ThemeName,
  WeatherInfo,
  DincharyaHabit,
  FocusMode,
} from './types';
import confetti from 'canvas-confetti';
import { User as FirebaseUser } from 'firebase/auth';
import {
  subscribeToAuth,
  loadUserTasks,
  saveUserTask,
  deleteUserTask,
  loadUserSessions,
  saveUserSession,
  loadUserHabits,
  saveUserHabit,
  syncLocalDataToFirestore,
} from './utils/firebase';
import {
  getStoredTasks,
  saveTasks,
  getStoredSessions,
  saveSessions,
  getStoredTheme,
  saveTheme,
  getStoredSound,
  saveSound,
  getStoredHabits,
  saveHabits,
  INITIAL_WEATHER,
} from './utils/storage';
import { sound } from './utils/audio';

// Components
import { ShowcasePoster } from './components/ShowcasePoster';
import { DincharyaView } from './components/DincharyaView';
import { CalendarView } from './components/CalendarView';
import { TodoList } from './components/TodoList';
import { PomodoroTimer } from './components/PomodoroTimer';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { SpotifyPlayer } from './components/SpotifyPlayer';
import { TaskModal } from './components/TaskModal';
import { ZenModal } from './components/ZenModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { NeuButton } from './components/NeumorphicElements';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(getStoredTasks);
  const [sessions, setSessions] = useState<FocusSession[]>(getStoredSessions);
  const [habits, setHabits] = useState<DincharyaHabit[]>(getStoredHabits);
  const [theme, setTheme] = useState<ThemeName>(getStoredTheme);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(getStoredSound);
  const [weather] = useState<WeatherInfo>(INITIAL_WEATHER);

  // Authentication & Cloud Sync State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Focus & Timer Shared State (Unified across App, Dashboard, Pomodoro, Tasks)
  const [activeTaskId, setActiveTaskId] = useState<string | undefined>(tasks[0]?.id);
  const [timerMode, setTimerMode] = useState<FocusMode>('pomodoro');
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskModalDefaultDate, setTaskModalDefaultDate] = useState<string | undefined>(undefined);
  const [isZenModalOpen, setIsZenModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Firebase Auth Listener & Initial Cloud Sync
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsCloudSyncing(true);
        try {
          const [cloudTasks, cloudSessions, cloudHabits] = await Promise.all([
            loadUserTasks(user.uid),
            loadUserSessions(user.uid),
            loadUserHabits(user.uid),
          ]);

          if (cloudTasks.length > 0) {
            setTasks(cloudTasks);
          } else if (tasks.length > 0) {
            await Promise.all(tasks.map((t) => saveUserTask(user.uid, t)));
          }

          if (cloudSessions.length > 0) {
            setSessions(cloudSessions);
          } else if (sessions.length > 0) {
            await Promise.all(sessions.map((s) => saveUserSession(user.uid, s)));
          }

          if (cloudHabits.length > 0) {
            setHabits(cloudHabits);
          } else if (habits.length > 0) {
            await Promise.all(habits.map((h) => saveUserHabit(user.uid, h)));
          }
        } catch (err) {
          console.error('Error synchronizing Firestore user data:', err);
        } finally {
          setIsCloudSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Manual Sync helper
  const handleManualSync = async () => {
    if (!currentUser) return;
    setIsCloudSyncing(true);
    try {
      await syncLocalDataToFirestore(currentUser.uid, tasks, sessions, habits);
      const [cloudTasks, cloudSessions, cloudHabits] = await Promise.all([
        loadUserTasks(currentUser.uid),
        loadUserSessions(currentUser.uid),
        loadUserHabits(currentUser.uid),
      ]);
      if (cloudTasks.length > 0) setTasks(cloudTasks);
      if (cloudSessions.length > 0) setSessions(cloudSessions);
      if (cloudHabits.length > 0) setHabits(cloudHabits);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Timer Tick Interval - Runs globally across all pages
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleCompleteTimerSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsRemaining, activeTaskId, timerMinutes, timerMode]);

  // Sync tasks & sessions & habits to storage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveTheme(theme);
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  useEffect(() => {
    saveSound(soundEnabled);
    sound.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Global Keyboard Shortcuts (Ctrl/Cmd + K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Tasks with Firestore sync
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          const updatedTask = {
            ...t,
            completed: nextCompleted,
            pomodorosCompleted: nextCompleted
              ? Math.max(t.pomodorosCompleted, t.pomodorosEstimated)
              : t.pomodorosCompleted,
          };
          if (currentUser) {
            saveUserTask(currentUser.uid, updatedTask);
          }
          return updatedTask;
        }
        return t;
      });
      return updated;
    });
  };

  const handleDeleteTask = (taskId: string) => {
    sound.playClick('press');
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeTaskId === taskId) setActiveTaskId(undefined);
    if (currentUser) {
      deleteUserTask(currentUser.uid, taskId);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskModalDefaultDate(task.dueDate);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'pomodorosCompleted' | 'focusMinutesTotal'>
  ) => {
    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        ...taskData,
      };
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updatedTask : t))
      );
      if (currentUser) {
        saveUserTask(currentUser.uid, updatedTask);
      }
      setEditingTask(null);
    } else {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        pomodorosCompleted: 0,
        focusMinutesTotal: 0,
      };
      setTasks((prev) => [newTask, ...prev]);
      if (currentUser) {
        saveUserTask(currentUser.uid, newTask);
      }
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedTask = {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
          };
          if (currentUser) {
            saveUserTask(currentUser.uid, updatedTask);
          }
          return updatedTask;
        }
        return t;
      })
    );
  };

  const handleStartFocusOnTask = (task: Task) => {
    setActiveTaskId(task.id);
    setTimerMode('pomodoro');
    setTimerMinutes(25);
    setTimerSecondsRemaining(25 * 60);
    setIsTimerRunning(true);
    sound.playClick('press');
    setActivePage('dashboard');
  };

  const handleOpenAddTaskWithDate = (dateStr: string) => {
    setEditingTask(null);
    setTaskModalDefaultDate(dateStr);
    setIsTaskModalOpen(true);
  };

  // Handlers for Dincharya Habits with Firestore sync
  const handleToggleHabit = (id: string) => {
    sound.playClick('press');
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const updated = { ...h, completed: !h.completed };
          if (currentUser) {
            saveUserHabit(currentUser.uid, updated);
          }
          return updated;
        }
        return h;
      })
    );
  };

  const handleAddCustomHabit = (newHabit: DincharyaHabit) => {
    sound.playClick('press');
    setHabits((prev) => [newHabit, ...prev]);
    if (currentUser) {
      saveUserHabit(currentUser.uid, newHabit);
    }
  };

  const handleStartFocusOnHabit = (habit: DincharyaHabit) => {
    sound.playClick('press');
    setActiveTaskId(undefined);
    const mins = habit.phase === 'pratah' || habit.phase === 'vyayama' ? 20 : 45;
    setTimerMode('custom');
    setTimerMinutes(mins);
    setTimerSecondsRemaining(mins * 60);
    setIsTimerRunning(true);
    setActivePage('dashboard');
  };

  // Handlers for Sessions with Firestore sync
  const handleSessionComplete = (newSession: FocusSession) => {
    setSessions((prev) => [newSession, ...prev]);
    if (currentUser) {
      saveUserSession(currentUser.uid, newSession);
    }

    if (newSession.taskId) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === newSession.taskId) {
            const updated = {
              ...t,
              pomodorosCompleted: t.pomodorosCompleted + 1,
              focusMinutesTotal: t.focusMinutesTotal + newSession.durationMinutes,
            };
            if (currentUser) {
              saveUserTask(currentUser.uid, updated);
            }
            return updated;
          }
          return t;
        })
      );
    }
  };

  // Unified Timer Actions
  const handleCompleteTimerSession = () => {
    setIsTimerRunning(false);
    sound.playChime();
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch {}

    const currentTask = tasks.find((t) => t.id === activeTaskId);
    const newSession: FocusSession = {
      id: `session-${Date.now()}`,
      taskId: currentTask?.id,
      taskTitle: currentTask?.title || 'General Deep Focus',
      durationMinutes: timerMinutes,
      completed: true,
      timestamp: new Date().toISOString(),
      mode: timerMode,
    };
    handleSessionComplete(newSession);
    setTimerSecondsRemaining(timerMinutes * 60);
  };

  const handleToggleTimer = () => {
    sound.playClick('press');
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    sound.playClick('press');
    setIsTimerRunning(false);
    setTimerSecondsRemaining(timerMinutes * 60);
  };

  const handleSkipTimer = () => {
    sound.playClick('press');
    handleCompleteTimerSession();
  };

  const handleSelectTimerMode = (newMode: FocusMode) => {
    sound.playClick('press');
    setTimerMode(newMode);
    setIsTimerRunning(false);
    let mins = 25;
    if (newMode === 'pomodoro') mins = 25;
    if (newMode === 'shortBreak') mins = 5;
    if (newMode === 'longBreak') mins = 15;
    if (newMode === 'deepWork') mins = 50;
    setTimerMinutes(mins);
    setTimerSecondsRemaining(mins * 60);
  };

  const handleTimerMinutesChange = (newMins: number) => {
    if (!isTimerRunning) {
      setTimerMinutes(newMins);
      setTimerSecondsRemaining(newMins * 60);
      setTimerMode('custom');
    }
  };

  const handleAddTimerMinutes = (extraMins: number) => {
    sound.playClick('press');
    setTimerMinutes((prev) => prev + extraMins);
    setTimerSecondsRemaining((prev) => prev + extraMins * 60);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setSoundEnabled(next);
    if (next) sound.playClick('press');
  };

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'dincharya', label: 'Dincharya', icon: <Sun className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'pomodoro', label: 'Focus Timer', icon: <Timer className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'music', label: 'Spotify', icon: <Music className="w-4 h-4" /> },
  ];

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      {/* Pristine Glass Header */}
      <header className={`sticky top-0 z-40 ${isDark ? 'bg-[#12141a]/80 border-b border-white/[0.08] shadow-[0_4px_24px_0_rgba(0,0,0,0.5)]' : 'bg-white/70 border-b border-white/90 shadow-[0_4px_24px_0_rgba(148,163,184,0.06)]'} backdrop-blur-2xl transition-all duration-200`}>
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo / Brand */}
          <div
            onClick={() => {
              sound.playClick('press');
              setActivePage('dashboard');
            }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-[0_4px_14px_0_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className={`text-xs font-black uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'} leading-tight`}>
                Dincharya
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider uppercase hidden xs:block">
                {isDark ? 'Obsidian Black Edition' : 'White Glass Edition'}
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Desktop / Tablet) */}
          <nav className={`hidden md:flex items-center gap-0.5 lg:gap-1 ${isDark ? 'bg-black/40 border-white/[0.08]' : 'bg-white/60 border-white/90 shadow-[0_2px_12px_0_rgba(148,163,184,0.06)]'} backdrop-blur-xl rounded-2xl p-1 border overflow-x-auto scrollbar-none`}>
            {navItems.map((item) => {
              const isActive =
                activePage === item.id || (item.id === 'dashboard' && activePage === 'poster');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick('press');
                    setActivePage(item.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all select-none whitespace-nowrap ${
                    isActive
                      ? isDark
                        ? 'bg-[#1e222d] text-indigo-400 shadow-[0_2px_8px_0_rgba(0,0,0,0.4)] border border-white/[0.08] font-extrabold'
                        : 'bg-white text-indigo-600 shadow-[0_2px_8px_0_rgba(99,102,241,0.15)] border border-white font-extrabold'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {item.icon}
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="inline xl:hidden text-[11px]">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search shortcut */}
            <NeuButton
              shape="circle"
              size="sm"
              onClick={() => {
                sound.playClick('press');
                setIsSearchModalOpen(true);
              }}
              title="Search (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5" />
            </NeuButton>

            {/* Theme Toggle in Header (Quick Access) */}
            <NeuButton
              shape="circle"
              size="sm"
              onClick={() => {
                sound.playClick('press');
                setTheme(isDark ? 'classic' : 'dark');
              }}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Black Theme'}
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-600" />
              )}
            </NeuButton>

            {/* Sound toggle */}
            <NeuButton
              shape="circle"
              size="sm"
              onClick={toggleSound}
              title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
              )}
            </NeuButton>

            {/* User Account / Cloud Sync Button */}
            <NeuButton
              shape="pill"
              size="sm"
              onClick={() => {
                sound.playClick('press');
                setIsAuthModalOpen(true);
              }}
              title={currentUser ? `Signed in as ${currentUser.displayName || currentUser.email}` : 'Sign In / Sync'}
              className="flex items-center gap-1.5 font-bold"
            >
              {currentUser ? (
                <>
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Avatar"
                      className="w-4 h-4 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] flex items-center justify-center font-bold">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-bold truncate max-w-[80px]">
                    {currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Account'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Cloud Synced" />
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-xs">Sign In</span>
                </>
              )}
            </NeuButton>

            {/* Add Task Button for Mobile */}
            <NeuButton
              shape="circle"
              size="sm"
              variant="primary"
              onClick={() => {
                setEditingTask(null);
                setTaskModalDefaultDate(undefined);
                setIsTaskModalOpen(true);
              }}
              className="flex sm:hidden font-bold"
              title="Add Task"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </NeuButton>

            {/* Add Task Button for Desktop */}
            <NeuButton
              shape="pill"
              size="sm"
              variant="primary"
              onClick={() => {
                setEditingTask(null);
                setTaskModalDefaultDate(undefined);
                setIsTaskModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </NeuButton>
          </div>
        </div>
      </header>

      {/* Main Content Area based on Active Page */}
      <main className="flex-1 pb-24 md:pb-8 w-full max-w-[100vw] overflow-x-hidden">
        {(activePage === 'dashboard' || activePage === 'poster') && (
          <ShowcasePoster
            tasks={tasks}
            sessions={sessions}
            habits={habits}
            onNavigate={(page) => {
              sound.playClick('press');
              setActivePage(page);
            }}
            onOpenAddTask={() => {
              setEditingTask(null);
              setTaskModalDefaultDate(undefined);
              setIsTaskModalOpen(true);
            }}
            onOpenZenModal={() => setIsZenModalOpen(true)}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            currentTheme={theme}
            onThemeChange={setTheme}
            weather={weather}
            isTimerRunning={isTimerRunning}
            timerMinutes={timerMinutes}
            timerSecondsRemaining={timerSecondsRemaining}
            timerMode={timerMode}
            activeTaskId={activeTaskId}
            onTimerMinutesChange={handleTimerMinutesChange}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onAddMinutes={handleAddTimerMinutes}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activePage === 'dincharya' && (
          <DincharyaView
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddCustomHabit={handleAddCustomHabit}
            onStartFocusOnHabit={handleStartFocusOnHabit}
          />
        )}

        {activePage === 'calendar' && (
          <CalendarView
            tasks={tasks}
            sessions={sessions}
            habits={habits}
            onSelectTask={handleStartFocusOnTask}
            onOpenAddTaskWithDate={handleOpenAddTaskWithDate}
          />
        )}

        {activePage === 'tasks' && (
          <TodoList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onOpenAddTask={() => {
              setEditingTask(null);
              setTaskModalDefaultDate(undefined);
              setIsTaskModalOpen(true);
            }}
            onStartFocusOnTask={handleStartFocusOnTask}
            onToggleSubtask={handleToggleSubtask}
          />
        )}

        {activePage === 'pomodoro' && (
          <PomodoroTimer
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSelectTask={setActiveTaskId}
            onSessionComplete={handleSessionComplete}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            mode={timerMode}
            durationMinutes={timerMinutes}
            secondsRemaining={timerSecondsRemaining}
            isRunning={isTimerRunning}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onSkipTimer={handleSkipTimer}
            onSelectMode={handleSelectTimerMode}
            onDurationChange={handleTimerMinutesChange}
          />
        )}

        {activePage === 'analytics' && (
          <AnalyticsTracker sessions={sessions} tasks={tasks} />
        )}

        {activePage === 'music' && <SpotifyPlayer />}
      </main>

      {/* Footer Info Bar */}
      <footer className={`w-full max-w-5xl mx-auto py-6 px-4 flex flex-col items-center text-xs font-semibold ${isDark ? 'text-slate-400 border-white/[0.08]' : 'text-slate-500 border-white/90'} gap-4 border-t`}>
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Dincharya • {isDark ? 'Obsidian Black Circadian Productivity System' : 'Full White & Glass Circadian Productivity System'}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsZenModalOpen(true)}
              className="hover:text-indigo-500 transition-colors"
            >
              1-Min Zen Breath
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage('dincharya')}
              className="hover:text-indigo-500 transition-colors"
            >
              Daily Regimen
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePage('calendar')}
              className="hover:text-indigo-500 transition-colors"
            >
              Calendar
            </button>
          </div>
        </div>

        {/* Attribution at the very bottom */}
        <div className={`pt-2 border-t w-full text-center ${isDark ? 'border-white/[0.04] text-slate-400' : 'border-slate-200/60 text-slate-500'} text-xs font-medium tracking-wide`}>
          made by <span className="font-semibold text-indigo-500">shakti prosad Dey</span>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Dock */}
      <nav className={`flex md:hidden fixed bottom-0 left-0 right-0 z-40 ${isDark ? 'bg-[#12141a]/90 border-t border-white/[0.08] shadow-[0_-8px_32px_0_rgba(0,0,0,0.6)]' : 'bg-white/85 border-t border-white/95 shadow-[0_-8px_32px_0_rgba(148,163,184,0.1)]'} backdrop-blur-2xl pb-safe px-1.5 py-1 justify-around items-center overflow-x-auto scrollbar-none`}>
        {navItems.map((item) => {
          const isActive =
            activePage === item.id || (item.id === 'dashboard' && activePage === 'poster');
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick('press');
                setActivePage(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-[10px] font-bold transition-all select-none touch-manipulation min-w-[42px] flex-shrink-0 ${
                isActive
                  ? 'text-indigo-500'
                  : isDark
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div className={isActive ? 'text-indigo-500 scale-110' : ''}>
                {item.icon}
              </div>
              <span className="mt-0.5 whitespace-nowrap text-[9px] font-extrabold tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setTaskModalDefaultDate(undefined);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        defaultDueDate={taskModalDefaultDate}
      />

      <ZenModal
        isOpen={isZenModalOpen}
        onClose={() => setIsZenModalOpen(false)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        tasks={tasks}
        onNavigate={(p) => setActivePage(p)}
        onSelectTask={(task) => {
          handleStartFocusOnTask(task);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        tasksCount={tasks.length}
        sessionsCount={sessions.length}
        habitsCount={habits.length}
        onManualSync={handleManualSync}
        theme={theme}
      />
    </div>
  );
}
