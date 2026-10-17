'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Something Went Wrong</h2>
          <p className="text-muted-foreground text-sm">
            An unexpected error has occurred. Please try again or contact support if the issue persists.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button onClick={reset} className="rounded-none px-8">Try Again</Button>
          <a href="/">
            <Button variant="outline" className="rounded-none px-8">Return Home</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
