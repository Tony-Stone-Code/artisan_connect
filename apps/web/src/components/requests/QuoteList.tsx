'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { acceptQuoteAndPayEscrow } from '@/app/actions/escrow';
import { rejectQuote } from '@/app/actions/quotes';

interface Quote {
  id: string;
  amount: number | any; // Decimal type from Prisma
  description: string | null;
  status: string;
  created_at: Date;
}

interface QuoteListProps {
  quotes: Quote[];
  isCustomer: boolean;
}

export function QuoteList({ quotes, isCustomer }: QuoteListProps) {
  const router = useRouter();
  const [loadingQuoteId, setLoadingQuoteId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendingQuotes = quotes.filter(q => q.status === 'PENDING');
  const acceptedQuote = quotes.find(q => q.status === 'ACCEPTED');

  if (quotes.length === 0) return null;

  const handleAccept = async (quoteId: string) => {
    setLoadingQuoteId(quoteId);
    setActionType('accept');
    setError(null);
    const res = await acceptQuoteAndPayEscrow(quoteId);
    if (res.error) {
      setError(res.error);
      setLoadingQuoteId(null);
      setActionType(null);
    } else {
      router.refresh();
    }
  };

  const handleReject = async (quoteId: string) => {
    if (!confirm('Are you sure you want to reject this quote?')) return;
    setLoadingQuoteId(quoteId);
    setActionType('reject');
    setError(null);
    const res = await rejectQuote(quoteId);
    if (res.error) {
      setError(res.error);
      setLoadingQuoteId(null);
      setActionType(null);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Quotes</h3>
      
      {error && <p className="text-sm text-destructive">{error}</p>}

      {acceptedQuote && (
        <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">Accepted Quote</span>
              <p className="text-xl font-bold">GHS {Number(acceptedQuote.amount).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">Paid securely into Escrow</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                HELD IN ESCROW
              </span>
            </div>
          </div>
          {acceptedQuote.description && (
            <div className="mt-3 text-sm border-t border-primary/10 pt-3">
              <p className="font-medium text-foreground">Breakdown:</p>
              <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{acceptedQuote.description}</p>
            </div>
          )}
        </div>
      )}

      {!acceptedQuote && pendingQuotes.length > 0 && (
        <div className="space-y-3">
          {pendingQuotes.map((quote) => (
            <div key={quote.id} className="border border-border/50 bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xl font-bold">GHS {Number(quote.amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Received {new Date(quote.created_at).toLocaleDateString()}</p>
                </div>
                {!isCustomer && (
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">
                    PENDING CUSTOMER
                  </span>
                )}
              </div>
              
              {quote.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">{quote.description}</p>
              )}

              {isCustomer && (
                <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-border/40">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleReject(quote.id)}
                    disabled={loadingQuoteId === quote.id}
                  >
                    Reject
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleAccept(quote.id)}
                    isLoading={loadingQuoteId === quote.id && actionType === 'accept'}
                    disabled={loadingQuoteId === quote.id}
                  >
                    Accept & Pay
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!acceptedQuote && pendingQuotes.length === 0 && quotes.length > 0 && (
        <p className="text-sm text-muted-foreground italic">All quotes were rejected or expired.</p>
      )}
    </div>
  );
}
