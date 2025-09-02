import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ExplanationDialog } from './explanation-dialog';
import { CheckCircle2, XCircle, Award } from 'lucide-react';
import { saveQuizResult } from '@/lib/history';
import type { Subject, Week } from '@/lib/curriculum';
import { useEffect } from 'react';
import Link from 'next/link';

interface ResultsCardProps {
  questions: GenerateQuizQuestionsOutput['questions'];
  userAnswers: (string | null)[];
  quizDetails: { subject: Subject; week: Week<Subject>; topic: string; numQuestions: number };
  onRestart: () => void;
}

export function ResultsCard({ questions, userAnswers, quizDetails, onRestart }: ResultsCardProps) {
  const score = questions.reduce((acc, question, index) => {
    return acc + (question.correctAnswer === userAnswers[index] ? 1 : 0);
  }, 0);
  const percentage = Math.round((score / questions.length) * 100);

  useEffect(() => {
    saveQuizResult({
      subject: quizDetails.subject,
      week: quizDetails.week,
      topic: quizDetails.topic,
      numQuestions: questions.length,
      score: score,
    });
  }, []);


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <Award className="w-16 h-16 mx-auto text-primary" />
        <CardTitle className="text-3xl font-bold mt-4">Quiz Complete!</CardTitle>
        <CardDescription className="text-xl text-muted-foreground">You scored</CardDescription>
        <p className="text-5xl font-bold text-primary">{percentage}%</p>
        <p className="text-lg text-muted-foreground">({score} out of {questions.length} correct)</p>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6 flex items-center justify-center gap-4">
          <Button onClick={onRestart}>Take Another Quiz</Button>
          <Button asChild variant="outline">
            <Link href="/progress">View Progress</Link>
          </Button>
        </div>
        <Separator className="my-6" />
        <h3 className="text-xl font-semibold mb-4 text-center">Review Your Answers</h3>
        <ScrollArea className="h-[40vh]">
          <div className="space-y-4 pr-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = question.correctAnswer === userAnswer;
              return (
                <div key={index} className="p-4 border rounded-lg bg-card">
                  <p className="font-semibold">{index + 1}. {question.question}</p>
                  <div className="flex items-center mt-2 text-sm">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2 text-red-500" />
                    )}
                    <span>Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer ?? 'Not answered'}</span></span>
                  </div>
                  {!isCorrect && userAnswer && (
                    <p className="mt-1 text-sm text-muted-foreground">Correct answer: {question.correctAnswer}</p>
                  )}
                  <div className="mt-3">
                    {userAnswer && <ExplanationDialog question={question} userAnswer={userAnswer} quizDetails={quizDetails} />}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
