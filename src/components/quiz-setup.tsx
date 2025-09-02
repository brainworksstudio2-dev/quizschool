// src/components/quiz-setup.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { curriculum, type Subject } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  subject: z.string().min(1, 'Please select a subject.'),
  topic: z.string().min(3, 'Topic must be at least 3 characters.'),
  numQuestions: z.coerce
    .number()
    .min(1, 'Number of questions must be at least 1.')
    .max(10, 'For practice, the max is 10 questions.'),
});

const teacherFormSchema = formSchema.extend({
    numQuestions: z.coerce
    .number()
    .min(1, 'Number of questions must be at least 1.')
    .max(50, 'Number of questions cannot exceed 50.'),
});

export function QuizSetup() {
  const router = useRouter();
  const { userRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTeacher = userRole === 'Teacher';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(isTeacher ? teacherFormSchema : formSchema),
    defaultValues: {
      subject: '',
      topic: '',
      numQuestions: isTeacher ? 10 : 5,
    },
  });

  const subject = form.watch('subject') as Subject | undefined;

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const params = new URLSearchParams({
      subject: values.subject,
      topic: values.topic,
      numQuestions: String(values.numQuestions),
    });
    router.push(`/quiz?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(curriculum).map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
               <FormControl>
                 <Input placeholder="e.g., 'React Hooks' or 'CSS Flexbox'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numQuestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Questions</FormLabel>
              <FormControl>
                <Input type="number" min="1" max={isTeacher ? "50" : "10"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isTeacher ? 'Generate Quiz' : 'Start Practice Quiz'}
        </Button>
      </form>
    </Form>
  );
}
