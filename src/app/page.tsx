// src/app/page.tsx
"use client";

import { QuizSetup } from '@/components/quiz-setup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';
import { AuthButton } from '@/components/auth-button';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-4">
       <div className="absolute top-4 right-4">
          <AuthButton />
        </div>
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <BrainCircuit className="w-16 h-16 text-primary" />
        </div>
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">QuizWhiz</CardTitle>
            <CardDescription className="text-lg">
              {user ? `Welcome back, ${user.displayName?.split(' ')[0]}!` : "Create a quiz to test your knowledge."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <>
                <QuizSetup />
                <div className="text-center mt-4">
                  <Button asChild variant="link">
                    <Link href="/progress">View My Progress</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Please sign in to start creating quizzes and tracking your progress.</p>
                <AuthButton />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
