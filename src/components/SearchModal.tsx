import React, { useState, useEffect } from 'react';
import { Search, X, CheckCircle2, Clock, Play, ArrowRight, Compass, Calendar } from 'lucide-react';
import { Task, ActivePage } from '../types';
import { NeuInput, NeuButton } from './NeumorphicElements';
import { sound } from '../utils/audio';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onNavigate: (page: ActivePage) => void;
  onSelectTask: (task: Task) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onNavigate,
  onSelectTask,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(query.toLowerCase())) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 p-3 sm:p-4 bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white/90 backdrop-blur-2xl border border-white w-full max-w-lg rounded-3xl p-5 sm:p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            Omni Search & Quick Navigation
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full bg-white/80 border border-white shadow-xs hover:bg-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <NeuInput
          autoFocus
          placeholder="Type to search tasks, tags, or routines..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />

        {/* Quick Page Jump Chips */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 py-1 mr-1">
            Jump to:
          </span>
          {(
            [
              { id: 'poster', label: 'Dashboard' },
              { id: 'dincharya', label: 'Dincharya' },
              { id: 'calendar', label: 'Calendar' },
              { id: 'tasks', label: 'Tasks' },
              { id: 'pomodoro', label: 'Pomodoro' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'music', label: 'Spotify' },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                sound.playClick('press');
                onNavigate(p.id);
                onClose();
              }}
              className="text-xs font-bold px-3 py-1 rounded-full bg-white/80 border border-white text-slate-600 hover:text-indigo-600 hover:bg-white shadow-xs transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="mt-4 max-h-60 overflow-y-auto flex flex-col gap-2 pr-1">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 font-medium">
              No matching tasks found.
            </div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  sound.playClick('press');
                  onSelectTask(t);
                  onClose();
                }}
                className="bg-white/80 backdrop-blur-xs border border-white/95 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:border-indigo-300 shadow-xs transition-all text-xs group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      t.completed ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                  />
                  <span className="font-bold text-slate-800 truncate group-hover:text-indigo-600">
                    {t.title}
                  </span>
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-white border border-slate-200/60 shadow-xs flex-shrink-0">
                    {t.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 flex-shrink-0 ml-2">
                  <span className="text-[10px] font-semibold">{t.dueDate}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
