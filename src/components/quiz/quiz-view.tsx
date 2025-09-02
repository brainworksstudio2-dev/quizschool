"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { generateQuizQuestions, type GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import { useVisibilityChange } from '@/hooks/use-visibility-change';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ProctoringWindow } from './proctoring-window';
import { Timer } from './timer';
import { QuestionCard } from './question-card';
import { ResultsCard } from './results-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Subject } from '@/lib/curriculum';
import { useAuth } from '@/context/auth-context';

type QuizState = 'loading' | 'ready' | 'active' | 'finished' | 'error';

export function QuizView() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const quizDetails = useMemo(() => ({
    subject: (searchParams.get('subject') || '') as Subject,
    topic: searchParams.get('topic') || '',
    numQuestions: Number(searchParams.get('numQuestions')) || 5,
  }), [searchParams]);

  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [questions, setQuestions] = useState<GenerateQuizQuestionsOutput['questions']>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showTabSwitchAlert, setShowTabSwitchAlert] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleQuizEnd = useCallback(() => {
    if (quizState === 'active') {
      const finalAnswers = [...userAnswers];
      if (selectedAnswer && !isAnswered) {
          finalAnswers[currentQuestionIndex] = selectedAnswer;
      }
      // Fill in any unanswered questions as null
      for (let i = 0; i < finalAnswers.length; i++) {
        if(finalAnswers[i] === undefined) {
          finalAnswers[i] = null;
        }
      }
      setUserAnswers(finalAnswers);
      setQuizState('finished');
    }
  }, [quizState, userAnswers, selectedAnswer, isAnswered, currentQuestionIndex]);
  
  const onTabSwitch = useCallback(() => {
    if (quizState === 'active') {
        setShowTabSwitchAlert(true);
        handleQuizEnd();
    }
  }, [quizState, handleQuizEnd]);

  useVisibilityChange(onTabSwitch);

  useEffect(() => {
    const fetchQuestions = async () => {
      setQuizState('loading');
      try {
        if (!quizDetails.subject || !quizDetails.topic) {
          throw new Error('Missing quiz parameters.');
        }
        const data = await generateQuizQuestions(quizDetails);
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setUserAnswers(new Array(data.questions.length).fill(null));
          setQuizState('ready');
        } else {
          throw new Error('No questions were generated.');
        }
      } catch (error) {
        console.error('Failed to fetch quiz questions:', error);
        toast({
          title: 'Error',
          description: 'Could not load the quiz. Please try again later.',
          variant: 'destructive',
        });
        setQuizState('error');
      }
    };
    if(user) fetchQuestions();
  }, [quizDetails, toast, user]);
  
  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
        toast({ title: 'No answer selected', description: 'Please select an answer before proceeding.', variant: 'destructive'});
        return;
    }
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);
    setIsAnswered(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        handleQuizEnd();
      }
    }, 500); // A short delay to show selection
  };
  
  const handleRestart = () => {
    router.push('/');
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  if (quizState === 'loading') {
    return (
      <div className="flex flex-col gap-4 h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">Generating your unique quiz...</p>
        <p className="text-sm text-muted-foreground">This may take a moment.</p>
      </div>
    );
  }

  if (quizState === 'error') {
    return (
      <div className="flex flex-col gap-4 h-screen w-full items-center justify-center text-destructive">
        <AlertTriangle className="h-12 w-12" />
        <p className="text-lg">Failed to load quiz.</p>
        <Button onClick={handleRestart}>Go back</Button>
      </div>
    );
  }

  if (quizState === 'ready') {
    return (
        <div className="flex flex-col gap-6 h-screen w-full items-center justify-center p-4 text-center">
            <h1 className="text-4xl font-bold text-primary">Quiz Ready</h1>
            <div className="text-muted-foreground">
              <p><strong>Subject:</strong> {quizDetails.subject}</p>
              <p><strong>Topic:</strong> {quizDetails.topic}</p>
              <p><strong>Questions:</strong> {quizDetails.numQuestions}</p>
            </div>
            <div className="max-w-md bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4" role="alert">
              <p className="font-bold">Important!</p>
              <p>The timer will start as soon as you begin. Do not switch tabs or windows, as this will automatically end the quiz.</p>
            </div>
            <Button size="lg" onClick={() => setQuizState('active')}>Start Quiz</Button>
        </div>
    );
  }

  if (quizState === 'finished') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ResultsCard
          questions={questions}
          userAnswers={userAnswers}
          quizDetails={quizDetails}
          onRestart={handleRestart}
        />
        <AlertDialog open={showTabSwitchAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tab Switch Detected</AlertDialogTitle>
              <AlertDialogDescription>
                You switched tabs, which is not allowed during the quiz. Your quiz has been submitted automatically.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowTabSwitchAlert(false)}>View Results</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <header className="flex justify-between items-start mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">QuizWhiz</h1>
          <p className="text-muted-foreground">{quizDetails.topic}</p>
        </div>
        <div className="flex items-center gap-4">
            <Timer initialMinutes={quizDetails.numQuestions * 1.5} onTimeUp={handleQuizEnd} />
            <ProctoringWindow />
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl">
          <Progress value={progress} className="mb-6 h-2" />
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={setSelectedAnswer}
              isAnswered={isAnswered}
              userAnswer={userAnswers[currentQuestionIndex]}
            />
          )}
          <div className="mt-6 text-center">
            <Button size="lg" onClick={handleNextQuestion} disabled={isAnswered || selectedAnswer === null}>
              {isAnswered && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
