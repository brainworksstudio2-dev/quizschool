"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { curriculum, type Subject, type Week } from '@/lib/curriculum';
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

const formSchema = z.object({
  subject: z.string().min(1, 'Please select a subject.'),
  week: z.string().min(1, 'Please select a week.'),
  topic: z.string().min(1, 'Please select a topic.'),
  numQuestions: z.coerce
    .number()
    .min(1, 'Number of questions must be at least 1.')
    .max(20, 'Number of questions cannot exceed 20.'),
});

export function QuizSetup() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      week: '',
      topic: '',
      numQuestions: 5,
    },
  });

  const subject = form.watch('subject') as Subject | undefined;
  const week = form.watch('week') as (Subject extends infer S ? S extends Subject ? Week<S> : never : never) | undefined;

  const weeks = subject ? Object.keys(curriculum[subject]) : [];
  const topics = subject && week && curriculum[subject][week] ? (curriculum[subject] as any)[week] : [];

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const params = new URLSearchParams({
      subject: values.subject,
      week: values.week,
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
              <Select onValueChange={(value) => {
                field.onChange(value);
                form.setValue('week', '');
                form.setValue('topic', '');
              }} defaultValue={field.value}>
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
          name="week"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Week</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                form.setValue('topic', '');
              }} value={field.value} disabled={!subject}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a week" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {weeks.map((week) => (
                    <SelectItem key={week} value={week}>
                      {week}
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
              <Select onValueChange={field.onChange} value={field.value} disabled={!week}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {topics.map((topic: string) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
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
          name="numQuestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Questions</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Start Quiz
        </Button>
      </form>
    </Form>
  );
}
