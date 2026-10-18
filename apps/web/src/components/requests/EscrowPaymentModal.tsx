'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  X, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { acceptQuoteAndPayEscrow } from '@/app/actions/escrow';

interface EscrowPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteId: string;
  amount: number;
  description?: string | null;
}

type PaymentNetwork = 'MTN' | 'TELECEL' | 'AT' | 'CARD';

export function EscrowPaymentModal({
  isOpen,
  onClose,
  quoteId,
  amount,
  description,
}: EscrowPaymentModalProps) {
  const router = useRouter();
  const [network, setNetwork] = useState<PaymentNetwork>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('024 456 7890');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'DETAILS' | 'USSD_WAIT' | 'SUCCESS'>('DETAILS');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quoteAmount = Number(amount);
  const escrowFee = quoteAmount * 0.05;
  const totalAmount = quoteAmount + escrowFee;

  const handlePay = async () => {
    setIsProcessing(true);
    setError(null);
    setPaymentStep('USSD_WAIT');

    // Simulate 1.5s network prompt latency for realism
    await new Promise((r) => setTimeout(r, 1400));

    try {
      const res = await acceptQuoteAndPayEscrow(quoteId);
      if (res.error) {
        setError(res.error);
        setPaymentStep('DETAILS');
        setIsProcessing(false);
      } else {
        setPaymentStep('SUCCESS');
        setTimeout(() => {
          onClose();
          router.refresh();
        }, 1800);
      }
    } catch (e: any) {
      setError(e.message || 'Payment failed');
      setPaymentStep('DETAILS');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-lg bg-card border border-border shadow-2xl p-6 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Lock className="w-3.5 h-3.5" />
              Escrow Virtual Vault
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Accept Quote &amp; Fund Escrow
            </h3>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Step: DETAILS */}
        {paymentStep === 'DETAILS' && (
          <div className="space-y-5">
            {/* Quote Amount Breakdown */}
            <div className="p-4 bg-muted/40 border border-border/70 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Artisan Service Quote</span>
                <span className="font-semibold text-foreground">
                  GHS {quoteAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  Escrow Guarantee Fee (5%)
                  <ShieldCheck className="w-3 h-3 text-primary" />
                </span>
                <span className="font-semibold text-foreground">
                  GHS {escrowFee.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-between font-bold text-sm text-foreground">
                <span>Total Escrow Deposit</span>
                <span className="text-primary text-base">
                  GHS {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Select Mobile Money Network or Card:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'MTN', name: 'MTN MoMo', color: 'border-amber-500/60 text-amber-600 dark:text-amber-400' },
                  { id: 'TELECEL', name: 'Telecel', color: 'border-red-500/60 text-red-600 dark:text-red-400' },
                  { id: 'AT', name: 'AT Money', color: 'border-blue-500/60 text-blue-600 dark:text-blue-400' },
                  { id: 'CARD', name: 'Card', color: 'border-slate-500/60 text-foreground' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNetwork(item.id as PaymentNetwork)}
                    className={`py-2 px-2 text-center border text-xs font-bold transition-all cursor-pointer ${
                      network === item.id 
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary' 
                        : 'border-border/70 bg-card hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Account / Phone input */}
            {network !== 'CARD' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-primary" />
                  {network} Mobile Money Number:
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="024 000 0000"
                  className="w-full h-11 px-3 bg-background border border-border/80 text-sm font-medium focus:outline-none focus:border-primary"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                  Card Number (Debit / Credit):
                </label>
                <input
                  type="text"
                  defaultValue="4111 2222 3333 4444"
                  readOnly
                  className="w-full h-11 px-3 bg-muted/40 border border-border/80 text-sm font-medium focus:outline-none"
                />
              </div>
            )}

            {/* Escrow Trust Notice */}
            <div className="flex items-start gap-2.5 p-3 bg-primary/5 border border-primary/20 text-xs text-muted-foreground leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p>
                <strong>Zero-Risk Escrow:</strong> Your funds will stay safely locked. The artisan is NOT paid until you personally inspect and approve the work.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button 
                variant="ghost" 
                onClick={onClose} 
                className="rounded-none text-xs font-bold cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePay} 
                className="rounded-none px-6 h-11 text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
              >
                Deposit GHS {totalAmount.toFixed(2)} Into Escrow <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: USSD Prompt Waiting */}
        {paymentStep === 'USSD_WAIT' && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-base text-foreground">
                Authorizing Mobile Money Deposit...
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Please approve the prompt sent to <strong>{phoneNumber}</strong> on the {network} network to lock funds in Escrow.
              </p>
            </div>
            <div className="inline-block p-2 bg-muted/60 text-xs font-mono border border-border">
              USSD Prompt: *170# &gt; Approvals &gt; Enter PIN
            </div>
          </div>
        )}

        {/* Step: SUCCESS */}
        {paymentStep === 'SUCCESS' && (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-lg text-foreground">
              Escrow Deposit Confirmed!
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              GHS {totalAmount.toFixed(2)} has been locked in the virtual escrow vault. The artisan has been notified to commence work.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
