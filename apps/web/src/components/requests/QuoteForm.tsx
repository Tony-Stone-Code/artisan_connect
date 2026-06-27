'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createQuote } from '@/app/actions/quotes';

interface QuoteFormProps {
  requestId: string;
}

export function QuoteForm({ requestId }: QuoteFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      setIsLoading(false);
      return;
    }

    const res = await createQuote({
      request_id: requestId,
      amount: numericAmount,
      description,
      expires_in_days: 7 // default to 7 days
    });

    if (res.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      setIsOpen(false);
      setAmount('');
      setDescription('');
      router.refresh();
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
        Send Quote
      </Button>
    );
  }

  return (
    <div className="border border-border/50 bg-card rounded-lg p-4 mt-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Send a Quote</h3>
      {error && <p className="text-sm text-destructive mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount (GHS)</label>
          <Input 
            type="number" 
            min="1" 
            step="0.01" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="e.g. 500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description / Breakdown (Optional)</label>
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Explain what this quote covers..."
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Submit Quote
          </Button>
        </div>
      </form>
    </div>
  );
}
