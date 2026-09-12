import React, { useState } from 'react';
import {
  User as FirebaseUser,
} from 'firebase/auth';
import {
  X,
  LogOut,
  Cloud,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Database,
  Calendar,
  CheckSquare,
  Timer,
  RefreshCw,
} from 'lucide-react';
import { signInWithGoogle, signOutUser } from '../utils/firebase';
import { sound } from '../utils/audio';
import { ThemeName } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  tasksCount: number;
  sessionsCount: number;
  habitsCount: number;
  onManualSync?: () => Promise<void>;
  theme: ThemeName;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  tasksCount,
  sessionsCount,
  habitsCount,
  onManualSync,
  theme,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#12141a]' : 'bg-[#ebf0f7]';
  const cardBorder = isDark ? 'border-white/[0.08]' : 'border-white/80';
  const raisedLg = isDark
    ? 'shadow-[12px_12px_28px_#06070a,-12px_-12px_28px_#1e222c]'
    : 'shadow-[12px_12px_28px_#c2cdda,-12px_-12px_28px_#ffffff]';
  const raisedSm = isDark
    ? 'shadow-[4px_4px_10px_#06070a,-4px_-4px_10px_#1e222c]'
    : 'shadow-[4px_4px_10px_#c2cdda,-4px_-4px_10px_#ffffff]';
  const sunkenSm = isDark
    ? 'shadow-[inset_2px_2px_5px_#06070a,inset_-2px_-2px_5px_#1c202a]'
    : 'shadow-[inset_2px_2px_5px_#c2cdda,inset_-2px_-2px_5px_#ffffff]';
  const headlineText = isDark ? 'text-slate-100' : 'text-slate-900';
  const subtextColor = isDark ? 'text-slate-400' : 'text-slate-600';

  const handleGoogleSignIn = async () => {
    sound.playClick('press');
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        sound.playChime();
        onClose();
      } else {
        // User closed or dismissed the popup window before selecting an account
        setErrorMsg('Sign-in cancelled. You can try again or continue in offline mode.');
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('The sign-in popup was blocked by the browser. Please allow popups or open the app in a new tab.');
      } else if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        console.warn('Sign-in notice:', err?.message || err);
        setErrorMsg(err?.message || 'Unable to sign in right now. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineMode = () => {
    sound.playClick('press');
    onClose();
  };

  const handleSignOut = async () => {
    sound.playClick('press');
    setLoading(true);
    try {
      await signOutUser();
      onClose();
    } catch (err: any) {
      console.error('Sign-out failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSync = async () => {
    if (!onManualSync) return;
    sound.playClick('press');
    setSyncing(true);
    setSyncSuccess(false);
    try {
      await onManualSync();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-md transition-all animate-fadeIn overflow-y-auto">
      <div
        className={`w-full max-w-md ${cardBg} border ${cardBorder} ${raisedLg} rounded-3xl p-5 sm:p-7 relative overflow-hidden transition-all max-h-[92vh] overflow-y-auto my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick('press');
            onClose();
          }}
          className={`absolute top-5 right-5 w-9 h-9 rounded-full ${cardBg} border ${cardBorder} ${raisedSm} flex items-center justify-center ${subtextColor} hover:${headlineText} active:${sunkenSm} transition-all`}
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser ? (
          /* ========================================================================= */
          /* LOGGED IN ACCOUNT VIEW                                                   */
          /* ========================================================================= */
          <div>
            <div className="flex items-center gap-3.5 mb-5">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-14 h-14 rounded-full border-2 border-indigo-500 shadow-md object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={`w-14 h-14 rounded-full ${cardBg} border ${cardBorder} ${sunkenSm} flex items-center justify-center font-black text-xl text-indigo-500`}>
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-base font-black ${headlineText} neu-text-headline`}>
                    {currentUser.displayName || 'Authenticated User'}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Synced
                  </span>
                </div>
                <p className={`text-xs ${subtextColor} truncate max-w-[220px] font-medium mt-0.5 neu-text-embossed`}>
                  {currentUser.email || 'Guest Anonymous Account'}
                </p>
              </div>
            </div>

            {/* Cloud Sync Status Summary */}
            <div className={`p-4 rounded-2xl ${cardBg} border ${cardBorder} ${sunkenSm} mb-5`}>
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-indigo-500 mb-3">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Cloud Saved Details</span>
                </span>
                <span className="text-[10px] text-emerald-500 font-bold">Live in Firestore</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className={`p-2.5 rounded-xl ${cardBg} border ${cardBorder} ${raisedSm}`}>
                  <CheckSquare className="w-4 h-4 mx-auto text-indigo-500 mb-1" />
                  <div className={`text-sm font-black ${headlineText}`}>{tasksCount}</div>
                  <div className={`text-[9px] font-bold ${subtextColor} uppercase`}>Tasks</div>
                </div>

                <div className={`p-2.5 rounded-xl ${cardBg} border ${cardBorder} ${raisedSm}`}>
                  <Timer className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                  <div className={`text-sm font-black ${headlineText}`}>{sessionsCount}</div>
                  <div className={`text-[9px] font-bold ${subtextColor} uppercase`}>Sessions</div>
                </div>

                <div className={`p-2.5 rounded-xl ${cardBg} border ${cardBorder} ${raisedSm}`}>
                  <Calendar className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                  <div className={`text-sm font-black ${headlineText}`}>{habitsCount}</div>
                  <div className={`text-[9px] font-bold ${subtextColor} uppercase`}>Habits</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* Force Sync Now Button */}
              {onManualSync && (
                <button
                  type="button"
                  disabled={syncing}
                  onClick={handleTriggerSync}
                  className={`w-full py-2.5 px-4 rounded-2xl ${cardBg} border ${cardBorder} ${raisedSm} hover:border-indigo-500/40 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 ${headlineText} active:${sunkenSm} transition-all`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing to Cloud...' : syncSuccess ? 'Sync Completed!' : 'Sync All Data Now'}</span>
                </button>
              )}

              {/* Sign Out Button */}
              <button
                type="button"
                disabled={loading}
                onClick={handleSignOut}
                className="w-full py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>{loading ? 'Signing out...' : 'Sign Out of Account'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* LOGGED OUT SIGN IN VIEW                                                  */
          /* ========================================================================= */
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-11 h-11 rounded-2xl ${cardBg} border ${cardBorder} ${sunkenSm} flex items-center justify-center text-indigo-500`}>
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`text-lg font-black ${headlineText} neu-text-headline`}>
                  Account & Cloud Sync
                </h2>
                <p className={`text-xs ${subtextColor} neu-text-embossed`}>
                  Save all tasks, habits, and focus history permanently.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Features list */}
            <div className={`mt-4 mb-6 p-4 rounded-2xl ${cardBg} border ${cardBorder} ${sunkenSm} space-y-2.5 text-xs ${subtextColor}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Persistent cross-device cloud backup in Firestore</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Previous focus timer sessions & deep work logs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Personal circadian habits and customized daily schedules</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              {/* Google Sign-in Button */}
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className={`w-full py-3 px-5 rounded-2xl ${cardBg} border ${cardBorder} ${raisedSm} hover:border-indigo-500/50 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-wider ${headlineText} active:${sunkenSm} transition-all shadow-sm`}
              >
                {/* Google Multi-color G Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{loading ? 'Connecting...' : 'Sign In with Google'}</span>
              </button>

              {/* Offline / Local Storage Option */}
              <button
                type="button"
                disabled={loading}
                onClick={handleOfflineMode}
                className={`w-full py-2.5 px-4 rounded-2xl border border-transparent text-xs font-bold ${subtextColor} hover:${headlineText} flex items-center justify-center gap-2 transition-all`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Continue in Offline Mode (Local Storage)</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/20 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Direct Firestore Authentication & Row-level Security</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
