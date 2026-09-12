import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  signInAnonymously,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Task, FocusSession, DincharyaHabit } from '../types';

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);

// Use named firestore database ID from applet config if provided
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Authentication Helpers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Save/update user profile in Firestore
    const userDocPath = `users/${user.uid}`;
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Focus Explorer',
          photoURL: user.photoURL || '',
          lastLoginAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (fsErr) {
      handleFirestoreError(fsErr, OperationType.WRITE, userDocPath);
    }
    return user;
  } catch (error: any) {
    // If the user closed or cancelled the popup, handle gracefully without error logs
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request'
    ) {
      return null;
    }
    // Re-throw other errors (e.g. auth/popup-blocked) for UI notification
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

// User Profile Listener
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// =========================================================================
// FIRESTORE DATA SYNC SERVICES
// =========================================================================

// Tasks Firestore Operations
export async function loadUserTasks(userId: string): Promise<Task[]> {
  const path = `users/${userId}/tasks`;
  try {
    const tasksCol = collection(db, 'users', userId, 'tasks');
    const q = query(tasksCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const tasks: Task[] = [];
    snapshot.forEach((docSnap) => {
      tasks.push(docSnap.data() as Task);
    });
    return tasks;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

export async function saveUserTask(userId: string, task: Task): Promise<void> {
  const path = `users/${userId}/tasks/${task.id}`;
  try {
    const taskDoc = doc(db, 'users', userId, 'tasks', task.id);
    await setDoc(taskDoc, task, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteUserTask(userId: string, taskId: string): Promise<void> {
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    const taskDoc = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(taskDoc);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Sessions Firestore Operations (History & Previous Details)
export async function loadUserSessions(userId: string): Promise<FocusSession[]> {
  const path = `users/${userId}/sessions`;
  try {
    const sessionsCol = collection(db, 'users', userId, 'sessions');
    const q = query(sessionsCol, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const sessions: FocusSession[] = [];
    snapshot.forEach((docSnap) => {
      sessions.push(docSnap.data() as FocusSession);
    });
    return sessions;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

export async function saveUserSession(userId: string, session: FocusSession): Promise<void> {
  const path = `users/${userId}/sessions/${session.id}`;
  try {
    const sessionDoc = doc(db, 'users', userId, 'sessions', session.id);
    await setDoc(sessionDoc, session, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Habits Firestore Operations
export async function loadUserHabits(userId: string): Promise<DincharyaHabit[]> {
  const path = `users/${userId}/habits`;
  try {
    const habitsCol = collection(db, 'users', userId, 'habits');
    const snapshot = await getDocs(habitsCol);
    const habits: DincharyaHabit[] = [];
    snapshot.forEach((docSnap) => {
      habits.push(docSnap.data() as DincharyaHabit);
    });
    return habits;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

export async function saveUserHabit(userId: string, habit: DincharyaHabit): Promise<void> {
  const path = `users/${userId}/habits/${habit.id}`;
  try {
    const habitDoc = doc(db, 'users', userId, 'habits', habit.id);
    await setDoc(habitDoc, habit, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Bulk Upload / Migration for First Sign-In
export async function syncLocalDataToFirestore(
  userId: string,
  localTasks: Task[],
  localSessions: FocusSession[],
  localHabits: DincharyaHabit[]
): Promise<void> {
  try {
    // Check if cloud tasks exist
    const cloudTasks = await loadUserTasks(userId);
    if (cloudTasks.length === 0 && localTasks.length > 0) {
      await Promise.all(localTasks.map((t) => saveUserTask(userId, t)));
    }

    const cloudSessions = await loadUserSessions(userId);
    if (cloudSessions.length === 0 && localSessions.length > 0) {
      await Promise.all(localSessions.map((s) => saveUserSession(userId, s)));
    }

    const cloudHabits = await loadUserHabits(userId);
    if (cloudHabits.length === 0 && localHabits.length > 0) {
      await Promise.all(localHabits.map((h) => saveUserHabit(userId, h)));
    }
  } catch (err) {
    console.error('Error syncing local data to cloud:', err);
  }
}
