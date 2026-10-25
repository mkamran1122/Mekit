import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  deleteDoc,
  addDoc,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(firebaseApp);

// Initialize Cloud Firestore with explicit firestoreDatabaseId
export const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Operation Types for Audit & Error Tracking
export enum OperationType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
}

export interface FirestoreErrorDetails {
  code: string;
  message: string;
  operation: OperationType;
  path: string | null;
}

/**
 * Standardized Firestore error handler for structured error reporting
 */
export function handleFirestoreError(
  error: unknown,
  operation: OperationType,
  path: string | null = null
): void {
  const err = error as { code?: string; message?: string };
  const errorDetails: FirestoreErrorDetails = {
    code: err?.code || 'unknown',
    message: err?.message || 'An unknown error occurred',
    operation,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errorDetails));
  throw error;
}

// Unified User type across Firebase Auth and Local Guest sessions
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

// User Presets Interface
export interface CloudPreset {
  id: string;
  userId: string;
  title: string;
  mode: 'compress' | 'resize' | 'convert';
  quality: number;
  targetSizeKb?: number;
  width?: number;
  height?: number;
  format: string;
  maintainAspectRatio: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Processing History Record (zero image bytes, file stats only for privacy)
export interface ProcessingHistoryRecord {
  id: string;
  userId: string;
  fileName: string;
  tool: 'compressor' | 'resizer' | 'converter';
  originalBytes: number;
  compressedBytes: number;
  savingsPercent: number;
  format: string;
  timestamp: string;
}

// Local Storage Keys for Guest Sessions
const GUEST_STORAGE_KEY = 'mekit_guest_session';
const GUEST_PRESETS_KEY = 'mekit_guest_presets';
const GUEST_HISTORY_KEY = 'mekit_guest_history';

/**
 * Creates or retrieves a persistent local guest user session
 */
export function getLocalGuestUser(): AppUser {
  try {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore localStorage parse errors
  }

  const guestId = 'guest_' + Math.random().toString(36).substring(2, 10);
  const guestUser: AppUser = {
    uid: guestId,
    email: null,
    displayName: 'Guest User',
    photoURL: null,
    isAnonymous: true,
  };

  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
  } catch {
    // Ignore quota errors
  }

  return guestUser;
}

/**
 * Authentication Methods
 */
export async function signInWithGoogle(): Promise<AppUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(result.user);
    // Clear guest session flag upon real sign-in
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {}
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      isAnonymous: false,
    };
  } catch (error: any) {
    // Gracefully handle user cancelling or closing the popup
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request'
    ) {
      return null;
    }

    if (error?.code === 'auth/popup-blocked') {
      const customErr = new Error('Sign-in popup was blocked by your browser. Please allow popups for mekit.online.');
      (customErr as any).code = 'auth/popup-blocked';
      throw customErr;
    }

    if (error?.code === 'auth/unauthorized-domain') {
      const customErr = new Error('This preview domain is not authorized in Firebase Console yet. You can continue seamlessly using Guest Mode.');
      (customErr as any).code = 'auth/unauthorized-domain';
      throw customErr;
    }

    console.warn('Google Sign-In issue:', error?.message || error);
    throw error;
  }
}

export async function signInGuest(): Promise<AppUser> {
  try {
    // Try Firebase anonymous auth first
    const result = await signInAnonymously(auth);
    return {
      uid: result.user.uid,
      email: null,
      displayName: 'Guest User',
      photoURL: null,
      isAnonymous: true,
    };
  } catch (error: any) {
    // When anonymous auth is disabled in Firebase Console (e.g., auth/admin-restricted-operation),
    // seamlessly provide a robust local guest session without failing or crashing.
    return getLocalGuestUser();
  }
}

export async function signOutUser(): Promise<void> {
  try {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {}
    if (auth.currentUser) {
      await signOut(auth);
    }
  } catch (error) {
    console.warn('Sign Out issue:', error);
  }
}

/**
 * Synchronize user document in /users/{uid} (Firestore)
 */
export async function syncUserProfile(user: AppUser | FirebaseUser): Promise<void> {
  if (user.uid.startsWith('guest_') || user.isAnonymous) {
    return;
  }
  const userRef = doc(db, 'users', user.uid);
  try {
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Mekit User',
        photoURL: user.photoURL || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
  }
}

/**
 * Cloud & Local Presets CRUD
 */
export async function saveUserPreset(
  userId: string,
  preset: Omit<CloudPreset, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  // If guest, store in local storage
  if (userId.startsWith('guest_')) {
    try {
      const current = await getUserPresets(userId);
      const filtered = current.filter((p) => p.id !== preset.id);
      const newPreset: CloudPreset = {
        ...preset,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(GUEST_PRESETS_KEY, JSON.stringify([newPreset, ...filtered]));
      return;
    } catch {
      return;
    }
  }

  const path = `users/${userId}/presets/${preset.id}`;
  try {
    const presetRef = doc(db, 'users', userId, 'presets', preset.id);
    await setDoc(
      presetRef,
      {
        ...preset,
        userId,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getUserPresets(userId: string): Promise<CloudPreset[]> {
  if (userId.startsWith('guest_')) {
    try {
      const raw = localStorage.getItem(GUEST_PRESETS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  const path = `users/${userId}/presets`;
  try {
    const presetsCol = collection(db, 'users', userId, 'presets');
    const snapshot = await getDocs(presetsCol);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<CloudPreset, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function deleteUserPreset(userId: string, presetId: string): Promise<void> {
  if (userId.startsWith('guest_')) {
    try {
      const current = await getUserPresets(userId);
      const filtered = current.filter((p) => p.id !== presetId);
      localStorage.setItem(GUEST_PRESETS_KEY, JSON.stringify(filtered));
      return;
    } catch {
      return;
    }
  }

  const path = `users/${userId}/presets/${presetId}`;
  try {
    const presetRef = doc(db, 'users', userId, 'presets', presetId);
    await deleteDoc(presetRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Processing Audit History CRUD (Zero raw image payload, privacy-first)
 */
export async function recordProcessingLog(
  userId: string,
  logData: {
    fileName: string;
    tool: 'compressor' | 'resizer' | 'converter';
    originalBytes: number;
    compressedBytes: number;
    savingsPercent: number;
    format: string;
  }
): Promise<void> {
  if (userId.startsWith('guest_')) {
    try {
      const current = await getUserProcessingHistory(userId, 50);
      const newEntry: ProcessingHistoryRecord = {
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        ...logData,
        timestamp: new Date().toISOString(),
      };
      const updated = [newEntry, ...current].slice(0, 50);
      localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(updated));
      return;
    } catch {
      return;
    }
  }

  const path = `users/${userId}/history`;
  try {
    const historyCol = collection(db, 'users', userId, 'history');
    await addDoc(historyCol, {
      ...logData,
      userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getUserProcessingHistory(
  userId: string,
  maxResults = 25
): Promise<ProcessingHistoryRecord[]> {
  if (userId.startsWith('guest_')) {
    try {
      const raw = localStorage.getItem(GUEST_HISTORY_KEY);
      const list: ProcessingHistoryRecord[] = raw ? JSON.parse(raw) : [];
      return list.slice(0, maxResults);
    } catch {
      return [];
    }
  }

  const path = `users/${userId}/history`;
  try {
    const historyCol = collection(db, 'users', userId, 'history');
    const q = query(historyCol, limit(maxResults));
    const snapshot = await getDocs(q);
    const records = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ProcessingHistoryRecord, 'id'>),
    }));
    return records.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function clearUserHistory(userId: string): Promise<void> {
  if (userId.startsWith('guest_')) {
    try {
      localStorage.removeItem(GUEST_HISTORY_KEY);
      return;
    } catch {
      return;
    }
  }

  const path = `users/${userId}/history`;
  try {
    const historyCol = collection(db, 'users', userId, 'history');
    const snapshot = await getDocs(historyCol);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Submit Contact / Support Inquiries to Firestore
 */
export async function submitContactInquiry(inquiry: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const path = 'contact_messages';
  try {
    const colRef = collection(db, 'contact_messages');
    await addDoc(colRef, {
      ...inquiry,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
