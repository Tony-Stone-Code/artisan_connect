'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updatePassword } from '@/app/actions/auth';
import { CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await updatePassword(password);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }
    
    setIsLoading(false);
  };

  if (success) {
    return (
      <Card className="border-border text-center">
        <CardContent className="pt-8 pb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Password Reset Successful</h3>
          <p className="text-muted-foreground mb-6">
            Your password has been updated. Redirecting to your dashboard...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl tracking-tight">Set New Password</CardTitle>
        <CardDescription>
          Please enter your new password below.
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
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button className="w-full" type="submit" isLoading={isLoading}>
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
