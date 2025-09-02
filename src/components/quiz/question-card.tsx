import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionCardProps {
  question: GenerateQuizQuestionsOutput['questions'][0];
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  isAnswered: boolean;
  userAnswer?: string | null;
  isResultView?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  isAnswered,
  userAnswer,
  isResultView = false
}: QuestionCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-baseline">
          <CardTitle className="text-xl md:text-2xl leading-snug">
            {question.question}
          </CardTitle>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer || undefined}
          onValueChange={onAnswerSelect}
          disabled={isAnswered || isResultView}
          className="space-y-4"
        >
          {question.options.map((option, index) => {
            const isCorrect = option === question.correctAnswer;
            const isSelected = option === userAnswer;
            let stateClass = '';
            if (isAnswered) {
              if (option === selectedAnswer) {
                stateClass = 'border-primary ring-2 ring-primary';
              }
            }
            if (isResultView) {
              if (isCorrect) stateClass = 'bg-green-100 dark:bg-green-900/50 border-green-500';
              if (isSelected && !isCorrect) stateClass = 'bg-red-100 dark:bg-red-900/50 border-red-500';
            }

            return (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50'} ${stateClass}`}
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <span>{option}</span>
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
