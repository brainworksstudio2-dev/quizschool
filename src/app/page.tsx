import { QuizSetup } from '@/components/quiz-setup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function Home() {
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
              Create a quiz to test your knowledge.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuizSetup />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
