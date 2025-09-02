// src/app/auth/signin/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push('/');
    } catch (error: any) {
      console.error('Error signing in:', error);
       toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error: any) {
      console.error('Error with Google sign in:', error);
      toast({
        title: 'Google Sign In Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-svh w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
            src="https://picsum.photos/1200/1800"
            alt="Students collaborating"
            width={1200}
            height={1800}
            className="h-full w-full object-cover"
            data-ai-hint="students learning"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold">QuizWhiz</h2>
            <p className="max-w-md mt-2">Unlock your potential with AI-powered quizzes tailored just for you.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>Sign in to continue to QuizWhiz.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </Button>
                </form>
            </Form>

            <Separator className="my-6" />

            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.4 64.5c-31.4-29.5-71.4-48-117.5-48-90.8 0-164.7 73.9-164.7 164.7s73.9 164.7 164.7 164.7c101.5 0 146.9-72.3 151.2-111.9H248v-85.3h236.2c2.4 12.7 3.8 26.1 3.8 40.2z"></path></svg>}
                Sign in with Google
            </Button>

            <div className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="underline">
                Sign up
                </Link>
            </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
