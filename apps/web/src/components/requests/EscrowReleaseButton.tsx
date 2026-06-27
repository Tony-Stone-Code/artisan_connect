'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { releaseEscrow } from '@/app/actions/escrow';
import { CheckCircle } from 'lucide-react';

interface EscrowReleaseButtonProps {
  requestId: string;
}

export function EscrowReleaseButton({ requestId }: EscrowReleaseButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRelease = async () => {
    if (!confirm('Are you sure the job is completed to your satisfaction? This will release the funds to the artisan and cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    const res = await releaseEscrow(requestId);
    
    if (res.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="mt-6 border border-green-200 bg-green-50 rounded-lg p-5">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-green-900">Job Completed by Artisan</h3>
          <p className="text-sm text-green-700 mt-1 mb-4">
            The artisan has marked this job as completed. Please inspect the work. If everything looks good, release the escrow funds to pay the artisan.
          </p>
          
          {error && <p className="text-sm text-destructive mb-3">{error}</p>}
          
          <Button 
            onClick={handleRelease} 
            isLoading={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Release Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
