"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';
import { FirebaseError } from 'firebase/app';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User, AuthContextType } from '@/types';
import { toast } from 'sonner';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser: FirebaseUser | null) => {
      setFirebaseUser(currentFirebaseUser);
      if (currentFirebaseUser) {
        try {
          // Get user data from Firestore with a simple getDoc
          const userDoc = await getDoc(doc(db, 'users', currentFirebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: currentFirebaseUser.uid,
              email: currentFirebaseUser.email || '',
              name: userData.name || '',
              isAdmin: userData.isAdmin || false,
              createdAt: userData.createdAt?.toDate() || new Date()
            });
          } else {
            // Create user document if it doesn't exist
            const newUser: Omit<User, 'uid'> = {
              email: currentFirebaseUser.email || '',
              name: currentFirebaseUser.displayName || '',
              isAdmin: false,
              createdAt: new Date()
            };

            await setDoc(doc(db, 'users', currentFirebaseUser.uid), newUser);
            setUser({
              uid: currentFirebaseUser.uid,
              ...newUser
            });
          }
          // Save user ID in cookie
          Cookies.set('eclipse-shop-user', currentFirebaseUser.uid, { expires: 30, secure: true, sameSite: 'strict' });
        } catch (error) {
          // Only show toast if it's a real error, not just a cancelled request
          if (error instanceof Error && error.message !== 'cancelled') {
            toast.error('Error loading user data');
          }
        }
      } else {
        setUser(null);
        // Remove user ID from cookie
        Cookies.remove('eclipse-shop-user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully signed in!');
    } catch (error: unknown) {
      let errorMessage = 'Failed to sign in';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Try again later';
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore
      const userData: Omit<User, 'uid'> = {
        email,
        name,
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      toast.success('Account created successfully!');
    } catch (error: unknown) {
      let errorMessage = 'Failed to create account';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Account creation is currently disabled';
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast.success('Successfully signed out!');
    } catch (error: unknown) {
      toast.error('Failed to sign out');
      throw error;
    }
  }, []);

  const value: AuthContextType = useMemo(() => ({
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signOut
  }), [user, firebaseUser, loading, signIn, signUp, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
