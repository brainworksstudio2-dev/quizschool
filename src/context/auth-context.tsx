// src/context/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type UserRole = 'Student' | 'Teacher' | null;

interface UserData {
    uid: string;
    displayName: string;
    email: string | null;
    photoURL: string | null;
    role: UserRole;
    gen?: string;
    bio?: string;
    createdAt: any;
    lastLogin: any;
}


interface AuthContextType {
  user: User | null;
  userData: UserData | null,
  userRole: UserRole;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, userRole: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const fetchedUserData = docSnap.data() as UserData;
          setUser(user);
          setUserData(fetchedUserData);
          setUserRole(fetchedUserData.role);
          // Update last login time and photoURL on every login
          await setDoc(userRef, { 
            lastLogin: serverTimestamp(),
            photoURL: user.photoURL,
           }, { merge: true });
        } else {
            // New user signed up with Google, but profile is not complete yet.
            // The logic in the signup pages will handle the redirect.
            // We set the user to null initially to prevent a flicker or race condition.
            setUser(null);
            setUserData(null);
            setUserRole(null);
        }
      } else {
        setUser(null);
        setUserData(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // This second effect handles the user state once it's confirmed.
  // It runs after the initial onAuthStateChanged check.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if(user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
           const fetchedUserData = docSnap.data() as UserData;
           setUser(user);
           setUserData(fetchedUserData);
           setUserRole(fetchedUserData.role);
        } else if (!pathname.startsWith('/auth/complete-profile')) {
            // If the user doc doesn't exist and they aren't completing their profile,
            // it means they've just signed up with a provider. The signup page will redirect them.
        }
      }
      setLoading(false);
    });
     return () => unsubscribe();
  }, [pathname, router]);


  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userData, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
