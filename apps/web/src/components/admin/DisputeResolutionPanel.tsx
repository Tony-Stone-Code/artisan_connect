'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { generateDisputeSummary, resolveDispute } from '@/app/actions/disputes';
import { Bot, RefreshCw, HandCoins, UserMinus } from 'lucide-react';

interface DisputeResolutionPanelProps {
  reportId: string;
  reason: string;
  aiSummary: string | null;
  status: string;
}

export function DisputeResolutionPanel({ reportId, reason, aiSummary, status }: DisputeResolutionPanelProps) {
  const router = useRouter();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isResolving, setIsResolving] = useState<'REFUND' | 'RELEASE' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setError(null);
    const res = await generateDisputeSummary(reportId);
    if (res.error) {
      setError(res.error);
    } else {
      router.refresh();
    }
    setIsSummarizing(false);
  };

  const handleResolve = async (decision: 'REFUND' | 'RELEASE') => {
    if (!confirm(`Are you sure you want to FORCE ${decision}? This action is irreversible.`)) return;
    
    setIsResolving(decision);
    setError(null);
    const res = await resolveDispute(reportId, decision);
    
    if (res.error) {
      setError(res.error);
      setIsResolving(null);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="border rounded-lg bg-card shadow-sm p-5 space-y-5">
      
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Customer's Reason</h4>
        <div className="bg-muted p-3 rounded-md text-sm border-l-4 border-destructive">
          {reason}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Bot className="w-4 h-4" /> AI Dispute Analysis
          </h4>
          {!aiSummary && status === 'OPEN' && (
            <Button size="sm" variant="outline" onClick={handleSummarize} isLoading={isSummarizing}>
              <RefreshCw className="w-3 h-3 mr-2" /> Generate Summary
            </Button>
          )}
        </div>
        
        {aiSummary ? (
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-md text-sm whitespace-pre-wrap leading-relaxed text-slate-700">
            {aiSummary}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No AI summary generated yet.</p>
        )}
      </div>

      {error && <p className="text-sm text-destructive font-semibold">{error}</p>}

      {status === 'OPEN' && (
        <div className="pt-4 border-t flex gap-3">
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white" 
            onClick={() => handleResolve('REFUND')}
            isLoading={isResolving === 'REFUND'}
            disabled={isResolving !== null}
          >
            <UserMinus className="w-4 h-4 mr-2" /> Force Refund to Customer
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
            onClick={() => handleResolve('RELEASE')}
            isLoading={isResolving === 'RELEASE'}
            disabled={isResolving !== null}
          >
            <HandCoins className="w-4 h-4 mr-2" /> Force Release to Artisan
          </Button>
        </div>
      )}

      {status === 'RESOLVED' && (
        <div className="pt-4 border-t text-center text-green-600 font-semibold flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" /> Dispute Resolved
        </div>
      )}
    </div>
  );
}

// Just a quick icon for the resolved state
function CheckCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
