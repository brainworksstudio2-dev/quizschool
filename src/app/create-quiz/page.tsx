// src/app/create-quiz/page.tsx
"use client";

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { QuizSetup } from '@/components/quiz-setup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';
import { AuthButton } from '@/components/auth-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function CreateQuizPage() {
    const { user, userRole, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || userRole !== 'Teacher')) {
            router.push('/');
        }
    }, [user, userRole, loading, router]);

    if (loading || userRole !== 'Teacher') {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg">Verifying access...</p>
            </div>
        );
    }
  
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
            <CardTitle className="text-3xl font-bold text-primary">Create a Quiz</CardTitle>
            <CardDescription className="text-lg">
              Set up a new quiz for your students.
            </CardDescription>
          </CardHeader>
          <CardContent>
                <QuizSetup />
                <div className="text-center mt-4">
                  <Button asChild variant="link">
                    <Link href="/progress">View Student Progress</Link>
                  </Button>
                </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
