'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card border-2 border-border p-4 md:p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center gap-4">
          <Cookie className="w-6 h-6 text-primary shrink-0 mt-0.5 md:mt-0" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold">Cookie Notice</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use essential cookies to keep you signed in and remember your preferences.
              No advertising or tracking cookies are used.{' '}
              <Link href="/cookies" className="underline underline-offset-2 hover:text-primary transition-colors">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={declineCookies}
              className="rounded-none text-xs flex-1 md:flex-none"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={acceptCookies}
              className="rounded-none text-xs flex-1 md:flex-none px-6"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
