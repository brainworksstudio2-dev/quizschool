// src/app/page.tsx
"use client";

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizSetup } from '@/components/quiz-setup';

export default function Home() {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <BrainCircuit className="w-16 h-16 text-primary" />
        </div>
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">QuizWhiz</CardTitle>
            <CardDescription className="text-lg">
              {user ? `Welcome back, ${user.displayName?.split(' ')[0]}!` : "An AI-powered quiz platform."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="text-center">
                {userRole === 'Teacher' && (
                   <p className="mb-4">Create and manage quizzes for your students.</p>
                )}
                 {userRole === 'Student' && (
                   <p className="mb-4">Take a quiz to test your knowledge.</p>
                )}
                <div className="flex justify-center gap-4">
                  {userRole === 'Teacher' && (
                    <Button asChild>
                      <Link href="/create-quiz">Create Quiz</Link>
                    </Button>
                  )}
                  {userRole === 'Student' && (
                     <QuizSetup />
                  )}
                </div>
                 <div className="text-center mt-4">
                  <Button asChild variant="link">
                    <Link href="/progress">View My Progress</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">Sign in or create an account to get started.</p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
