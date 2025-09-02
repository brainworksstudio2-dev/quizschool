import { QuizView } from '@/components/quiz/quiz-view';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function QuizLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg">Preparing your quiz...</p>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<QuizLoading />}>
      <QuizView />
    </Suspense>
  );
}
