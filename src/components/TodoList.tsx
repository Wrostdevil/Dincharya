import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Tag,
  Trash2,
  Edit2,
  Play,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Filter,
  Check,
  CheckSquare,
} from 'lucide-react';
import { Task, TaskCategory, Priority } from '../types';
import { NeuCard, NeuButton, NeuCheckbox, NeuInput } from './NeumorphicElements';
import { sound } from '../utils/audio';

interface TodoListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onOpenAddTask: () => void;
  onStartFocusOnTask: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onOpenAddTask,
  onStartFocusOnTask,
  onToggleSubtask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const categories: string[] = ['All', 'Work', 'Design', 'Study', 'Health', 'Personal'];

  const toggleExpand = (taskId: string) => {
    sound.playClick('press');
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleCheckbox = (task: Task) => {
    const willComplete = !task.completed;
    onToggleTask(task.id);

    if (willComplete) {
      sound.playChime();
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#4f46e5', '#38bdf8', '#10b981', '#ffffff'],
        });
      } catch {}
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'pending' && !task.completed) ||
      (selectedStatus === 'completed' && task.completed);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/80">
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
            Low
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
            <CheckSquare className="w-4 h-4" />
            <span>Task Master</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
            Task Orchestration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Capture, categorize, and execute your high-leverage priorities.
          </p>
        </div>

        {/* Counter Badges & Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-white/80 backdrop-blur-md border border-white/95 rounded-2xl px-3 py-1.5 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{pendingCount} Pending</span>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-white/95 rounded-2xl px-3 py-1.5 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{completedCount} Done</span>
          </div>

          <NeuButton
            shape="pill"
            size="md"
            variant="primary"
            onClick={onOpenAddTask}
            className="font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </NeuButton>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6">
        <div className="w-full">
          <NeuInput
            placeholder="Search tasks, descriptions, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Categories Carousel / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none overscroll-x-contain touch-pan-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick('press');
                setSelectedCategory(cat);
              }}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap touch-manipulation border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white/70 backdrop-blur-md text-slate-600 border-white/90 hover:bg-white shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-5 w-[1px] bg-slate-300 mx-1 flex-shrink-0" />

          {/* Status filter */}
          {(['all', 'pending', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                sound.playClick('press');
                setSelectedStatus(status);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap touch-manipulation border ${
                selectedStatus === status
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white/70 backdrop-blur-md text-slate-500 border-white/90 hover:bg-white shadow-xs'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {filteredTasks.length === 0 ? (
          <NeuCard className="text-center py-12 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-xs">
              <Check className="w-7 h-7" />
            </div>
            <div className="text-base font-bold text-slate-800">No tasks found</div>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              {searchQuery
                ? 'Try adjusting your search query or filter tags.'
                : 'All caught up! Press the button below to add your next focus objective.'}
            </p>
            <NeuButton
              shape="pill"
              size="sm"
              variant="primary"
              onClick={onOpenAddTask}
              className="mt-4 font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
            </NeuButton>
          </NeuCard>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = !!expandedTasks[task.id];
            const subtasksCompleted =
              task.subtasks?.filter((s) => s.completed).length || 0;
            const totalSubtasks = task.subtasks?.length || 0;

            return (
              <div
                key={task.id}
                className={`rounded-3xl p-5 transition-all duration-200 border ${
                  task.completed
                    ? 'bg-white/45 backdrop-blur-xs border-slate-200/60 opacity-80'
                    : 'bg-white/80 backdrop-blur-xl border-white/95 shadow-[0_8px_32px_0_rgba(148,163,184,0.06)] hover:bg-white/95 hover:border-white'
                }`}
              >
                {/* Main Task Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      <NeuCheckbox
                        checked={task.completed}
                        onChange={() => handleCheckbox(task)}
                        size="md"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-base font-bold tracking-tight text-slate-800 transition-all ${
                            task.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        {getPriorityBadge(task.priority)}
                        <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded-full bg-white/90 border border-slate-200/70 shadow-xs">
                          {task.category}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Meta info: Pomodoros & Due Date */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
                        {/* Pomodoros */}
                        <div
                          className="flex items-center gap-1.5"
                          title={`${task.pomodorosCompleted} of ${task.pomodorosEstimated} Pomodoros completed`}
                        >
                          <span className="text-sm">🍅</span>
                          <span className="text-slate-700 font-bold">
                            {task.pomodorosCompleted} / {task.pomodorosEstimated}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            ({task.focusMinutesTotal} min logged)
                          </span>
                        </div>

                        {/* Due Date */}
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{task.dueDate}</span>
                          </div>
                        )}

                        {/* Subtask count */}
                        {totalSubtasks > 0 && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="text-indigo-600 hover:underline flex items-center gap-1 font-bold text-[11px]"
                          >
                            <span>
                              {subtasksCompleted}/{totalSubtasks} subtasks
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Task Quick Action Buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Start Focus Button */}
                    {!task.completed && (
                      <NeuButton
                        shape="circle"
                        size="sm"
                        onClick={() => onStartFocusOnTask(task)}
                        title="Focus on this task in 3D Pomodoro"
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      </NeuButton>
                    )}

                    <NeuButton
                      shape="circle"
                      size="sm"
                      onClick={() => onEditTask(task)}
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                    </NeuButton>

                    <NeuButton
                      shape="circle"
                      size="sm"
                      onClick={() => onDeleteTask(task.id)}
                      title="Delete task"
                      className="hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                    </NeuButton>
                  </div>
                </div>

                {/* Expandable Subtasks Checklist */}
                {isExpanded && totalSubtasks > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 pl-8 flex flex-col gap-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Subtasks Checklist
                    </div>
                    {task.subtasks.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-2.5 py-1 text-xs"
                      >
                        <NeuCheckbox
                          size="sm"
                          checked={sub.completed}
                          onChange={() => onToggleSubtask(task.id, sub.id)}
                        />
                        <span
                          className={`font-medium ${
                            sub.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-700'
                          }`}
                        >
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
