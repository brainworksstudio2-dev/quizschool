
// src/app/auth/signup/teacher/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, UserCredential } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  gen: z.string().min(1, "Please select the Gen you teach."),
  bio: z.string().optional(),
});

export default function TeacherSignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const gens = Array.from({ length: 11 }, (_, i) => String(30 + i));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      gen: '',
      bio: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: values.username });

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: values.username,
        email: values.email,
        photoURL: user.photoURL,
        role: 'Teacher',
        gen: values.gen,
        bio: values.bio,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
      
      router.push('/');

    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        // User already exists, so just sign them in.
        router.push('/');
      } else {
        // This is a new user. Redirect them to complete their profile.
        router.push('/auth/complete-profile?role=Teacher');
      }
      
    } catch (error: any) {
      console.error('Error with Google sign up:', error);
      // Avoid showing an error toast if the user closes the popup
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({
          title: 'Google Sign Up Failed',
          description: error.message,
          variant: 'destructive'
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };


  return (
     <main className="min-h-svh w-full grid grid-cols-1 lg:grid-cols-2">
       <div className="relative hidden lg:block">
        <Image
            src="https://picsum.photos/1200/1807"
            alt="Teacher in a classroom"
            width={1200}
            height={1807}
            className="h-full w-full object-cover"
            data-ai-hint="teacher classroom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
            <h2 className="text-3xl font-bold">Empower your students</h2>
            <p className="max-w-md mt-2">Create engaging quizzes, track performance, and inspire learning with powerful AI tools.</p>
        </div>
      </div>
       <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
            <CardTitle>Create a Teacher Account</CardTitle>
            <CardDescription>Get started with creating quizzes for your students.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                        <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
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
                <FormField
                    control={form.control}
                    name="gen"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Gen</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select the Gen you teach" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {gens.map((gen) => (
                            <SelectItem key={gen} value={gen}>
                                Gen {gen}
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
                    name="bio"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Tell us a little bit about your teaching experience" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up as Teacher
                </Button>
                </form>
            </Form>

            <Separator className="my-6" />

            <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isLoading || isGoogleLoading}>
                {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.4 64.5c-31.4-29.5-71.4-48-117.5-48-90.8 0-164.7 73.9-164.7 164.7s73.9 164.7 164.7 164.7c101.5 0 146.9-72.3 151.2-111.9H248v-85.3h236.2c2.4 12.7 3.8 26.1 3.8 40.2z"></path></svg>}
                Sign up with Google
            </Button>

            <div className="mt-4 text-center text-sm">
                Are you a student?{' '}
                <Link href="/auth/signup" className="underline">
                Sign up here
                </Link>
            </div>

            <div className="mt-2 text-center text-sm">
                Already have an account?{' '}
                <Link href="/auth/signin" className="underline">
                Sign in
                </Link>
            </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
