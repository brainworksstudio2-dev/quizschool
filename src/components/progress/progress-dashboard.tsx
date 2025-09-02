// src/components/progress/progress-dashboard.tsx
"use client";

import { useEffect, useState } from 'react';
import { getQuizHistory, type QuizRecord } from '@/lib/history';
import { curriculum, type Subject } from '@/lib/curriculum';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

interface SubjectProgress {
  correct: number;
  total: number;
}

export function ProgressDashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<Subject, SubjectProgress>>(() => {
    const initial: Record<Subject, SubjectProgress> = {} as Record<Subject, SubjectProgress>;
    for (const subject in curriculum) {
        initial[subject as Subject] = { correct: 0, total: 0 };
    }
    return initial;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) {
        setIsLoading(false);
        return;
      };
      
      const history = await getQuizHistory(user.uid);
      const newProgress = { ...progress };

      for (const record of history) {
        // The record from firestore might not have subject.
        if (record.subject && newProgress[record.subject]) {
          newProgress[record.subject].correct += record.score;
          newProgress[record.subject].total += record.numQuestions;
        }
      }
      
      setProgress(newProgress);
      setIsLoading(false);
    }

    fetchHistory();
  }, [user]);

  const overallProgress = Object.values(progress).reduce((acc, subj) => {
    acc.correct += subj.correct;
    acc.total += subj.total;
    return acc;
  }, { correct: 0, total: 0 });

  const overallPercentage = overallProgress.total > 0 ? (overallProgress.correct / overallProgress.total) * 100 : 0;

  if (isLoading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!user) {
    return (
        <div className="text-center text-muted-foreground py-8">
            <p>Please sign in to view your progress.</p>
            <Button asChild variant="link" className="mt-2">
                <Link href="/">Sign In</Link>
            </Button>
        </div>
    )
  }
  
  const hasHistory = overallProgress.total > 0;

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
                {hasHistory ? (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-muted-foreground">Total Score</span>
                            <span className="font-bold">{overallProgress.correct} / {overallProgress.total}</span>
                        </div>
                        <Progress value={overallPercentage} />
                         <p className="text-right mt-2 text-lg font-bold">{Math.round(overallPercentage)}%</p>
                    </>
                ) : (
                    <p className="text-muted-foreground">You haven't completed any quizzes yet.</p>
                )}
            </CardContent>
        </Card>
      
        <Card>
            <CardHeader>
                <CardTitle>Progress by Subject</CardTitle>
            </CardHeader>
            <CardContent>
             {hasHistory ? (
                <div className="space-y-4">
                {Object.entries(progress).map(([subject, data]) => {
                    const percentage = data.total > 0 ? (data.correct / data.total) * 100 : 0;
                    if (data.total === 0) return null;
                    return (
                    <div key={subject}>
                        <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{subject}</span>
                        <span className="text-sm text-muted-foreground">{data.correct} / {data.total}</span>
                        </div>
                        <Progress value={percentage} />
                        <p className="text-right mt-1 text-sm font-semibold">{Math.round(percentage)}%</p>
                    </div>
                    );
                })}
                </div>
             ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>Complete a quiz to see your progress by subject.</p>
                     <Button asChild variant="link" className="mt-2">
                        <Link href="/">Take a Quiz</Link>
                    </Button>
                </div>
             )}
            </CardContent>
        </Card>

        <div className="text-center mt-8">
            <Button asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
    </div>
  );
}
