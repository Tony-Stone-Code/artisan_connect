'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { rejectQuote } from '@/app/actions/quotes';
import { EscrowPaymentModal } from '@/components/requests/EscrowPaymentModal';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Quote {
  id: string;
  amount: number | any;
  description: string | null;
  status: string;
  created_at: Date;
  escrow?: {
    id: string;
    amount: number;
    fee_amount: number;
    status: string;
  } | null;
}

interface QuoteListProps {
  quotes: Quote[];
  isCustomer: boolean;
}

export function QuoteList({ quotes, isCustomer }: QuoteListProps) {
  const router = useRouter();
  const [selectedQuoteForPayment, setSelectedQuoteForPayment] = useState<Quote | null>(null);
  const [loadingQuoteId, setLoadingQuoteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendingQuotes = quotes.filter((q) => q.status === 'PENDING');
  const acceptedQuote = quotes.find((q) => q.status === 'ACCEPTED');

  if (quotes.length === 0) return null;

  const handleReject = async (quoteId: string) => {
    if (!confirm('Are you sure you want to decline this quote?')) return;
    setLoadingQuoteId(quoteId);
    setError(null);
    const res = await rejectQuote(quoteId);
    if (res.error) {
      setError(res.error);
      setLoadingQuoteId(null);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Artisan Quotes &amp; Proposals
        </h3>
        <span className="text-xs font-semibold text-muted-foreground">
          {quotes.length} quote(s)
        </span>
      </div>

      {error && <p className="text-xs text-destructive font-semibold">{error}</p>}

      {/* Accepted Quote in Escrow */}
      {acceptedQuote && (
        <div className="border border-primary/40 bg-primary/5 p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                Accepted Quote
              </span>
              <p className="text-2xl font-black text-foreground">
                GHS {Number(acceptedQuote.amount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-primary" /> Funds Locked in Escrow
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              <CheckCircle2 className="w-3 h-3 mr-1" /> HELD IN ESCROW
            </span>
          </div>

          {acceptedQuote.description && (
            <div className="text-xs border-t border-border/60 pt-3">
              <p className="font-bold text-foreground mb-1">Itemized Scope:</p>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {acceptedQuote.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pending Quotes */}
      {!acceptedQuote && pendingQuotes.length > 0 && (
        <div className="space-y-3">
          {pendingQuotes.map((quote) => (
            <div
              key={quote.id}
              className="border border-border/70 bg-card p-4 space-y-3 shadow-sm hover:border-primary/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-black text-foreground">
                    GHS {Number(quote.amount).toFixed(2)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Received {new Date(quote.created_at).toLocaleDateString()}
                  </p>
                </div>
                {!isCustomer && (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Awaiting Customer
                  </span>
                )}
              </div>

              {quote.description && (
                <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed border-t border-border/50 pt-2">
                  {quote.description}
                </p>
              )}

              {isCustomer && (
                <div className="flex gap-2 justify-end pt-3 border-t border-border/60">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReject(quote.id)}
                    disabled={loadingQuoteId === quote.id}
                    className="rounded-none text-xs font-bold cursor-pointer"
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setSelectedQuoteForPayment(quote)}
                    className="rounded-none px-4 text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 mr-1.5" /> Accept &amp; Pay Escrow
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!acceptedQuote && pendingQuotes.length === 0 && quotes.length > 0 && (
        <p className="text-xs text-muted-foreground italic">
          All previous quotes have expired or been rejected.
        </p>
      )}

      {/* Payment Modal */}
      {selectedQuoteForPayment && (
        <EscrowPaymentModal
          isOpen={!!selectedQuoteForPayment}
          quoteId={selectedQuoteForPayment.id}
          amount={Number(selectedQuoteForPayment.amount)}
          description={selectedQuoteForPayment.description}
          onClose={() => setSelectedQuoteForPayment(null)}
        />
      )}
    </div>
  );
}
