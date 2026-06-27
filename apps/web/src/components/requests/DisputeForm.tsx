'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { createDispute } from '@/app/actions/disputes';
import { AlertTriangle } from 'lucide-react';

interface DisputeFormProps {
  requestId: string;
}

export function DisputeForm({ requestId }: DisputeFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for the dispute.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const res = await createDispute(requestId, reason);

    if (res.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        className="text-destructive border-destructive hover:bg-destructive/10"
        onClick={() => setIsOpen(true)}
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        File a Dispute
      </Button>
    );
  }

  return (
    <div className="border-2 border-destructive/20 bg-destructive/5 rounded-lg p-4 mt-4 shadow-sm">
      <h3 className="text-lg font-semibold text-destructive mb-2 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        File a Dispute
      </h3>
      <p className="text-sm text-destructive/80 mb-4">
        Filing a dispute will freeze the escrow funds. An admin will review the chat logs and intervene to resolve the issue. Please explain the problem below.
      </p>
      
      {error && <p className="text-sm text-destructive font-semibold mb-3">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea 
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="flex min-h-[100px] w-full rounded-md border border-destructive/30 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Explain why you are disputing this job..."
            required
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="destructive" isLoading={isLoading}>
            Submit Dispute
          </Button>
        </div>
      </form>
    </div>
  );
}
