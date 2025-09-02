// src/components/auth-button.tsx
"use client";

import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from './ui/button';
import { useAuth } from '@/context/auth-context';
import { LogIn, LogOut } from 'lucide-react';

export function AuthButton() {
  const { user } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  if (user) {
    return (
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">Welcome, {user.displayName}</span>
            <Button onClick={handleSignOut} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </Button>
        </div>
    );
  }

  return (
    <Button onClick={handleSignIn}>
      <LogIn className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  );
}
