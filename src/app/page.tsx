
// src/app/page.tsx
"use client";

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthButton } from '@/components/auth-button';
import Image from 'next/image';

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
    <main className="h-svh w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden h-full lg:block">
         <Image
            src="https://picsum.photos/800/1200"
            alt="A person thinking about a quiz"
            fill
            className="object-cover"
            data-ai-hint="knowledge learning"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold">Welcome to QuizWhiz</h2>
            <p className="max-w-md mt-2">The best place to test your knowledge and challenge yourself.</p>
        </div>
      </div>
       <div className="flex flex-col items-center justify-center p-4 relative">
            <div className="absolute top-4 right-4">
                <AuthButton />
            </div>
            <div className="w-full max-w-md">
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
                        <div className="space-y-4">
                            <p className="text-muted-foreground">Create and manage quizzes for your students.</p>
                            <Button asChild size="lg">
                            <Link href="/create-quiz">Create a New Quiz</Link>
                            </Button>
                        </div>
                        )}
                        {userRole === 'Student' && (
                        <div className="space-y-4">
                            <p className="text-muted-foreground mb-4">There are no active quizzes for you right now.</p>
                            <p>Please wait for your teacher to assign a quiz.</p>
                        </div>
                        )}
                        <div className="text-center mt-6">
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
       </div>
    </main>
  );
}
