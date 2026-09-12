import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar as CalendarIcon, Check } from 'lucide-react';
import { Task, TaskCategory, Priority, Subtask } from '../types';
import { NeuButton, NeuInput } from './NeumorphicElements';
import { sound } from '../utils/audio';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'pomodorosCompleted' | 'focusMinutesTotal'>) => void;
  initialTask?: Task | null;
  defaultDueDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  defaultDueDate,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [pomodorosEstimated, setPomodorosEstimated] = useState(2);
  const [dueDate, setDueDate] = useState(defaultDueDate || todayStr);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setCategory(initialTask.category);
      setPriority(initialTask.priority);
      setPomodorosEstimated(initialTask.pomodorosEstimated);
      setDueDate(initialTask.dueDate || todayStr);
      setSubtasks(initialTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Work');
      setPriority('medium');
      setPomodorosEstimated(2);
      setDueDate(defaultDueDate || todayStr);
      setSubtasks([]);
    }
  }, [initialTask, isOpen, defaultDueDate, todayStr]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    sound.playClick('press');
    setSubtasks((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    sound.playClick('press');
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    sound.playClick('press');
    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      completed: initialTask ? initialTask.completed : false,
      pomodorosEstimated,
      dueDate,
      subtasks,
    });
    onClose();
  };

  const categories: TaskCategory[] = ['Work', 'Design', 'Study', 'Health', 'Personal'];
  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/30 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 border border-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
              Task Matrix
            </span>
            <h2 className="text-xl font-black text-slate-900">
              {initialTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <NeuButton
            shape="circle"
            size="sm"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </NeuButton>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
              Task Title *
            </label>
            <NeuInput
              autoFocus
              required
              placeholder="e.g. Complete Q3 Product Architecture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              placeholder="Brief context, links, or specific acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/80 rounded-xl p-3 text-slate-800 placeholder-slate-400 border border-white/90 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    sound.playClick('press');
                    setCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    category === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white/70 backdrop-blur-md text-slate-600 border-white/90 hover:bg-white shadow-xs'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Chips */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => {
                    sound.playClick('press');
                    setPriority(p);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                    priority === p
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-black shadow-xs'
                      : 'bg-white/70 backdrop-blur-md text-slate-600 border-white/90 hover:bg-white shadow-xs'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Pomodoros Estimate & Target Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Est. Pomodoros (🍅)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPomodorosEstimated((v) => Math.max(1, v - 1))}
                  className="w-8 h-8 rounded-lg bg-white/80 border border-white font-bold text-slate-700 shadow-xs hover:bg-white"
                >
                  -
                </button>
                <span className="font-mono font-black text-slate-800 text-base px-3 py-1 bg-white/90 rounded-lg border border-slate-200/60 shadow-xs">
                  {pomodorosEstimated}
                </span>
                <button
                  type="button"
                  onClick={() => setPomodorosEstimated((v) => Math.min(10, v + 1))}
                  className="w-8 h-8 rounded-lg bg-white/80 border border-white font-bold text-slate-700 shadow-xs hover:bg-white"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Target Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/80 rounded-xl p-2 text-xs font-bold text-slate-800 border border-white/90 shadow-inner outline-none"
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
              Subtasks ({subtasks.length})
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add subtask step..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 bg-white/80 rounded-xl p-2.5 text-xs text-slate-800 border border-white/90 shadow-inner outline-none"
              />
              <NeuButton
                type="button"
                shape="square"
                size="sm"
                onClick={handleAddSubtask}
                className="flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </NeuButton>
            </div>

            {subtasks.length > 0 && (
              <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-xl p-2 bg-white/70 backdrop-blur-xs border border-white/80 flex items-center justify-between text-xs shadow-xs"
                  >
                    <span className={sub.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
                      {sub.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <NeuButton type="button" shape="pill" size="md" onClick={onClose}>
              Cancel
            </NeuButton>
            <NeuButton type="submit" variant="primary" shape="pill" size="md" className="font-bold">
              {initialTask ? 'Save Changes' : 'Create Task'}
            </NeuButton>
          </div>
        </form>
      </div>
    </div>
  );
};
