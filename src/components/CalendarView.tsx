import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Plus,
  Play,
  Flame,
  Sparkles,
  CalendarDays,
  Target,
} from 'lucide-react';
import { Task, FocusSession, DincharyaHabit } from '../types';
import { NeuCard, NeuButton } from './NeumorphicElements';
import { sound } from '../utils/audio';

interface CalendarViewProps {
  tasks: Task[];
  sessions: FocusSession[];
  habits: DincharyaHabit[];
  onSelectTask: (task: Task) => void;
  onOpenAddTaskWithDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  sessions,
  habits,
  onSelectTask,
  onOpenAddTaskWithDate,
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    today.toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState<'month' | 'daySchedule'>('month');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    sound.playClick('press');
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    sound.playClick('press');
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleJumpToToday = () => {
    sound.playClick('press');
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(now.toISOString().split('T')[0]);
  };

  // Calendar calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Days grid generation
  const daysArray: {
    dateStr: string;
    dayNum: number;
    isCurrentMonth: boolean;
    isToday: boolean;
  }[] = [];

  // Previous month filler days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthDate = new Date(currentYear, currentMonth - 1, day);
    const dateStr = prevMonthDate.toISOString().split('T')[0];
    daysArray.push({
      dateStr,
      dayNum: day,
      isCurrentMonth: false,
      isToday: dateStr === today.toISOString().split('T')[0],
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(currentYear, currentMonth, d);
    const dateStr = thisDate.toISOString().split('T')[0];
    daysArray.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
      isToday: dateStr === today.toISOString().split('T')[0],
    });
  }

  // Next month filler days to complete grid (multiples of 7)
  const remaining = (7 - (daysArray.length % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    const nextMonthDate = new Date(currentYear, currentMonth + 1, n);
    const dateStr = nextMonthDate.toISOString().split('T')[0];
    daysArray.push({
      dateStr,
      dayNum: n,
      isCurrentMonth: false,
      isToday: dateStr === today.toISOString().split('T')[0],
    });
  }

  // Selected date data
  const tasksForSelectedDate = tasks.filter((t) => t.dueDate === selectedDateStr);
  const sessionsForSelectedDate = sessions.filter(
    (s) => s.timestamp.startsWith(selectedDateStr) && s.completed
  );
  const totalFocusMinutesOnDate = sessionsForSelectedDate.reduce(
    (acc, s) => acc + s.durationMinutes,
    0
  );

  const formattedSelectedDate = new Date(selectedDateStr + 'T00:00:00').toLocaleDateString(
    undefined,
    { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  );

  const isSelectedDateToday = selectedDateStr === today.toISOString().split('T')[0];

  // Hourly timeline for Day Schedule view (24 hours)
  const hourlySlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
            <CalendarIcon className="w-4 h-4" />
            <span>Temporal Organization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
            Productivity Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Map out your deep work blocks, Ayurvedic rituals, and target milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="bg-white/60 backdrop-blur-md p-1 rounded-2xl border border-white/90 shadow-xs flex items-center gap-1">
            <button
              onClick={() => {
                sound.playClick('press');
                setViewMode('month');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-indigo-600 shadow-xs border border-white font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => {
                sound.playClick('press');
                setViewMode('daySchedule');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'daySchedule'
                  ? 'bg-white text-indigo-600 shadow-xs border border-white font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Day Schedule
            </button>
          </div>

          <NeuButton
            shape="pill"
            size="sm"
            onClick={handleJumpToToday}
            className="text-xs font-bold"
          >
            Today
          </NeuButton>

          <NeuButton
            shape="pill"
            size="sm"
            variant="primary"
            onClick={() => onOpenAddTaskWithDate(selectedDateStr)}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </NeuButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Month Calendar */}
        <div className={viewMode === 'month' ? 'lg:col-span-8' : 'lg:col-span-5'}>
          <NeuCard className="p-4 sm:p-6">
            {/* Month & Navigation Strip */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="flex items-center gap-1">
                <NeuButton
                  shape="circle"
                  size="sm"
                  onClick={handlePrevMonth}
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </NeuButton>
                <NeuButton
                  shape="circle"
                  size="sm"
                  onClick={handleNextMonth}
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </NeuButton>
              </div>
            </div>

            {/* Weekday Row */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {weekDayNames.map((day) => (
                <span
                  key={day}
                  className="text-[11px] font-black uppercase text-slate-400 py-1"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Month Days Grid - White Glass Cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 select-none">
              {daysArray.map((cell, idx) => {
                const isSelected = cell.dateStr === selectedDateStr;
                const dateTasks = tasks.filter((t) => t.dueDate === cell.dateStr);
                const hasTasks = dateTasks.length > 0;
                const hasCompletedTasks = dateTasks.some((t) => t.completed);
                const dateSessions = sessions.filter(
                  (s) => s.timestamp.startsWith(cell.dateStr) && s.completed
                );
                const hasSessions = dateSessions.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      sound.playClick('press');
                      setSelectedDateStr(cell.dateStr);
                    }}
                    className={`relative min-h-[50px] sm:min-h-[64px] p-1.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-sm'
                        : cell.isToday
                        ? 'bg-amber-50/80 border-amber-300/90 hover:border-amber-400 shadow-xs'
                        : cell.isCurrentMonth
                        ? 'bg-white/70 backdrop-blur-md border-white/90 hover:bg-white/95 hover:border-white shadow-xs'
                        : 'bg-white/30 border-transparent text-slate-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black ${
                          isSelected
                            ? 'text-indigo-700'
                            : cell.isToday
                            ? 'text-amber-700 font-extrabold'
                            : cell.isCurrentMonth
                            ? 'text-slate-800'
                            : 'text-slate-300'
                        }`}
                      >
                        {cell.dayNum}
                      </span>
                      {cell.isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </div>

                    {/* Indicator dots for tasks & sessions */}
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {hasTasks && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            hasCompletedTasks ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                          title={`${dateTasks.length} tasks`}
                        />
                      )}
                      {hasSessions && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-amber-500"
                          title="Focus session logged"
                        />
                      )}
                    </div>

                    {/* Desktop task count badge */}
                    {hasTasks && (
                      <span className="hidden sm:block text-[9px] font-bold text-slate-500 truncate">
                        {dateTasks.length} {dateTasks.length === 1 ? 'task' : 'tasks'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Pending Task</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Completed Task</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Focus Session</span>
              </div>
            </div>
          </NeuCard>
        </div>

        {/* Right Column: Selected Date Schedule & Tasks */}
        <div className={viewMode === 'month' ? 'lg:col-span-4' : 'lg:col-span-7'}>
          <NeuCard className="p-4 sm:p-6 h-full flex flex-col">
            {/* Header for Selected Date */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600">
                  {isSelectedDateToday ? 'Current Day Focus' : 'Selected Schedule'}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {formattedSelectedDate}
                </h3>
              </div>

              <NeuButton
                shape="pill"
                size="sm"
                variant="outline"
                onClick={() => onOpenAddTaskWithDate(selectedDateStr)}
                className="text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </NeuButton>
            </div>

            {/* Quick Metrics on Selected Date */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-white/80 backdrop-blur-md border border-white/95 shadow-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Focus Logged</span>
                </div>
                <div className="text-xl font-black text-slate-900 font-mono mt-1">
                  {totalFocusMinutesOnDate}{' '}
                  <span className="text-xs font-semibold text-slate-400">min</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/80 backdrop-blur-md border border-white/95 shadow-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tasks Due</span>
                </div>
                <div className="text-xl font-black text-slate-900 font-mono mt-1">
                  {tasksForSelectedDate.length}
                </div>
              </div>
            </div>

            {/* If in daySchedule mode: Hourly Timeline */}
            {viewMode === 'daySchedule' ? (
              <div className="flex-1 overflow-y-auto pr-1 max-h-[500px] space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                  24-Hour Circadian Schedule
                </span>

                {hourlySlots.map((hour) => {
                  const hourLabel = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                  const isCurrentLiveHour = isSelectedDateToday && today.getHours() === hour;

                  return (
                    <div
                      key={hour}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                        isCurrentLiveHour
                          ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/50 shadow-xs'
                          : 'bg-white/70 backdrop-blur-md border-white/90 shadow-xs'
                      }`}
                    >
                      <span className="w-16 font-mono font-bold text-slate-400 flex-shrink-0">
                        {hourLabel}
                      </span>
                      <div className="flex-1 min-w-0">
                        {isCurrentLiveHour && (
                          <div className="text-[10px] font-black text-amber-600 uppercase flex items-center gap-1 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span>Current Hour Active</span>
                          </div>
                        )}
                        <span className="text-slate-600">
                          {hour === 6
                            ? 'Surya Namaskar & Yoga Flow (Kapha)'
                            : hour === 9
                            ? 'Deep Work Focus Block 1 (Pitta)'
                            : hour === 12
                            ? 'Madhya Bhojan (Main Lunch) & Shatapadi'
                            : hour === 15
                            ? 'Creative Collaboration & Project Milestones'
                            : hour === 18
                            ? 'Sandhya Sunset Reflection & Light Dinner'
                            : hour === 21
                            ? 'Swadhyaya, Digital Sunset & Haldi Doodh'
                            : 'Available focus slot'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Month mode: Tasks list for this date */
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                    Tasks for this Date ({tasksForSelectedDate.length})
                  </div>

                  {tasksForSelectedDate.length === 0 ? (
                    <div className="py-8 text-center bg-white/50 backdrop-blur-md rounded-2xl border border-dashed border-slate-200/80 p-4">
                      <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-medium text-slate-500">
                        No tasks scheduled for {selectedDateStr}.
                      </p>
                      <button
                        onClick={() => onOpenAddTaskWithDate(selectedDateStr)}
                        className="text-xs font-bold text-indigo-600 hover:underline mt-2 inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Schedule task
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {tasksForSelectedDate.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 rounded-xl bg-white/80 backdrop-blur-md border border-white/95 shadow-xs hover:border-indigo-300 transition-all flex items-center justify-between gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <span
                              className={`text-xs font-bold text-slate-800 line-clamp-1 ${
                                task.completed ? 'line-through text-slate-400' : ''
                              }`}
                            >
                              {task.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                              <span className="font-semibold">{task.category}</span>
                              <span>•</span>
                              <span>🍅 {task.pomodorosCompleted}/{task.pomodorosEstimated}</span>
                            </div>
                          </div>

                          <NeuButton
                            shape="circle"
                            size="sm"
                            onClick={() => onSelectTask(task)}
                            title="Focus on this task"
                            className="text-indigo-600 flex-shrink-0"
                          >
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          </NeuButton>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Focus sessions history on this date */}
                {sessionsForSelectedDate.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                      Focus Sessions Logged ({sessionsForSelectedDate.length})
                    </div>
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                      {sessionsForSelectedDate.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-white/70 backdrop-blur-xs border border-white/80 text-slate-700"
                        >
                          <span className="font-medium truncate max-w-[180px]">
                            {s.taskTitle || 'General Focus'}
                          </span>
                          <span className="font-mono font-bold text-indigo-600">
                            {s.durationMinutes} min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </NeuCard>
        </div>
      </div>
    </div>
  );
};
