// src/app/auth/complete-profile/page.tsx
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  gen: z.string().min(1, "Please select your Gen."),
  bio: z.string().optional(),
});

function CompleteProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const role = searchParams.get('role') || 'Student';
  const isTeacher = role === 'Teacher';
  const gens = Array.from({ length: 11 }, (_, i) => String(30 + i));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.displayName || '',
      gen: '',
      bio: '',
    },
  });
  
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
    // Pre-fill username if available from Google
    if (user?.displayName) {
        form.setValue('username', user.displayName);
    }
  }, [user, router, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ title: "Not authenticated", description: "Please sign in again.", variant: "destructive" });
        router.push('/auth/signin');
        return;
    }
    setIsLoading(true);
    try {
      await updateProfile(user, { displayName: values.username });

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: values.username,
        email: user.email,
        photoURL: user.photoURL,
        role: role,
        gen: values.gen,
        bio: values.bio,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
      
      router.push('/');

    } catch (error: any) {
      console.error('Error completing profile:', error);
      toast({
        title: 'Profile Update Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Just a few more details to get you started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="gen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gen</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isTeacher ? "Select the Gen you teach" : "Select your Gen"} />
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
                      <Textarea placeholder={isTeacher ? "Tell us about your teaching experience" : "Tell us a bit about yourself"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save and Continue
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}


export default function CompleteProfilePage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>}>
            <CompleteProfileForm />
        </Suspense>
    )
}
