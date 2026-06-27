'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { resetPassword } from '@/app/actions/auth';
import { MailCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const origin = window.location.origin;
    const result = await resetPassword(email, origin);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    
    setIsLoading(false);
  };

  if (success) {
    return (
      <Card className="border-border text-center">
        <CardContent className="pt-8 pb-6">
          <MailCheck className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Check your email</h3>
          <p className="text-muted-foreground mb-6">
            We've sent a password reset link to <strong>{email}</strong>.
          </p>
          <Button className="w-full" onClick={() => router.push('/login')}>
            Return to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl tracking-tight">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button className="w-full" type="submit" isLoading={isLoading}>
            Send Reset Link
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/login" className="text-sm text-primary hover:underline transition-all">
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}
