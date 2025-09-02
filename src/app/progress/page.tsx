// src/app/progress/page.tsx
import { ProgressDashboard } from '@/components/progress/progress-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

export default function ProgressPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-6">
          <Target className="w-16 h-16 text-primary" />
        </div>
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Your Progress</CardTitle>
            <CardDescription className="text-lg">
              Track your performance across different subjects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressDashboard />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
