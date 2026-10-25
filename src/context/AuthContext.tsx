import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  AppUser,
  signInWithGoogle,
  signInGuest,
  signOutUser,
  syncUserProfile,
} from '../services/firebase';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isGuest: boolean;
  signInGoogle: () => Promise<AppUser | null>;
  signInAnonymous: () => Promise<AppUser>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isGuest: false,
  signInGoogle: async () => null,
  signInAnonymous: async () => ({} as AppUser),
  logout: async () => {},
  error: null,
});

const GUEST_STORAGE_KEY = 'mekit_guest_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const appUser: AppUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          isAnonymous: currentUser.isAnonymous,
        };
        setUser(appUser);
        try {
          await syncUserProfile(currentUser);
        } catch (e) {
          console.warn('Could not sync user profile:', e);
        }
      } else {
        // If no Firebase Auth user, check for an active local guest session
        try {
          const storedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
          if (storedGuest) {
            setUser(JSON.parse(storedGuest));
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInGoogle = async (): Promise<AppUser | null> => {
    setError(null);
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser) {
        setUser(loggedUser);
      }
      return loggedUser;
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      // User closed popup or cancelled
      if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        return null;
      }
      const msg = e.message || 'Google sign in failed';
      setError(msg);
      throw err;
    }
  };

  const signInAnonymous = async (): Promise<AppUser> => {
    setError(null);
    try {
      const guest = await signInGuest();
      setUser(guest);
      return guest;
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Guest sign in failed');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOutUser();
      setUser(null);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Sign out failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest: !!user?.isAnonymous,
        signInGoogle,
        signInAnonymous,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
