'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createProfile } from '@/app/actions/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState<'CUSTOMER' | 'ARTISAN'>('CUSTOMER');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();

      // 1. Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            role,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // 2. Create user profile in our backend
        try {
          await createProfile({
            supabase_uid: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            role,
          });
        } catch (err) {
          console.warn('Backend profile creation failed', err);
        }

        // 3. Check if email confirmation is required (session will be null)
        if (!data.session) {
          setSuccess('Account created! Please check your email to confirm your account before logging in.');
          setIsLoading(false);
          return;
        }

        // 4. Redirect to dashboard if logged in (using window.location to force session sync)
        window.location.href = '/dashboard';
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl tracking-tight">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-600 dark:text-green-400">
            {success}
          </div>
        )}

        <div className="flex rounded-md border p-1 mb-4">
          <button
            type="button"
            className={`flex-1 rounded-sm py-1.5 text-sm font-medium transition-all ${
              role === 'CUSTOMER' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setRole('CUSTOMER')}
          >
            I&apos;m a Customer
          </button>
          <button
            type="button"
            className={`flex-1 rounded-sm py-1.5 text-sm font-medium transition-all ${
              role === 'ARTISAN' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setRole('ARTISAN')}
          >
            I&apos;m an Artisan
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <Input label="Email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <Button className="w-full" type="submit" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });
            }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign up with Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline transition-all">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
