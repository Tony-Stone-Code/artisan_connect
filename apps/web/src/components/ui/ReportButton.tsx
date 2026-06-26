'use client';

import { useState } from 'react';
import { Button } from './Button';
import { submitReport } from '@/app/actions/reports';
import { EntityType } from '@prisma/client';

export function ReportButton({ targetId, targetType }: { targetId: string, targetType: EntityType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen && !isSuccess) {
    return (
      <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => setIsOpen(true)}>
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
        Report Issue
      </Button>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        Report Submitted
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border p-6 rounded-lg max-w-md w-full shadow-2xl relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h3 className="text-xl font-bold mb-2">Submit a Report</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Please describe the issue in detail. Our moderation team will review this shortly.
        </p>
        <form action={async () => {
          setIsLoading(true);
          try {
            await submitReport({ targetId, targetType, reason });
            setIsSuccess(true);
            setIsOpen(false);
          } catch (e) {
            console.error(e);
            alert('Failed to submit report. Please make sure you are logged in.');
          } finally {
            setIsLoading(false);
          }
        }}>
          <textarea
            className="w-full h-32 p-3 bg-muted border border-border rounded-md text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="What happened?"
            value={reason}
            onChange={e => setReason(e.target.value)}
            required
            minLength={10}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading} disabled={reason.length < 10}>Submit Report</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
