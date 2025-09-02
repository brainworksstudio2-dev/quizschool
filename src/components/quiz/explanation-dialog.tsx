"use client";

import { useState } from 'react';
import { generateExplanation } from '@/ai/flows/generate-explanation';
import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Loader2, Lightbulb } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import type { Subject } from '@/lib/curriculum';

interface ExplanationDialogProps {
  question: GenerateQuizQuestionsOutput['questions'][0];
  userAnswer: string;
  quizDetails: { subject: Subject; topic: string; };
}

export function ExplanationDialog({ question, userAnswer, quizDetails }: ExplanationDialogProps) {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const getExplanation = async () => {
    if (explanation) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await generateExplanation({
        ...quizDetails,
        question: question.question,
        answer: userAnswer,
        isCorrect: userAnswer === question.correctAnswer,
        correctAnswer: question.correctAnswer,
      });
      setExplanation(result.explanation);
    } catch (e) {
      console.error(e);
      setError('Failed to generate explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={getExplanation}>
          <Lightbulb className="mr-2 h-4 w-4" />
          Explain
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Explanation</DialogTitle>
          <DialogDescription>{question.question}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
          <div className="p-4 border rounded-md min-h-[10rem]">
            {isLoading && (
              <div className="flex items-center justify-center p-8 h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {explanation && <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: explanation.replace(/\n/g, '<br />') }}></div>}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
