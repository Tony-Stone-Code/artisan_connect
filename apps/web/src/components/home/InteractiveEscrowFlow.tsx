'use client';

import { useState } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  Wallet, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Agree & Deposit in Escrow',
    tagline: 'Funds are secured before work starts',
    description:
      'Review your artisan’s itemized quote. When accepted, fund the escrow balance directly using MTN Mobile Money, Telecel Cash, or debit card. Your money is protected in escrow—the artisan cannot withdraw it yet, but they know their pay is guaranteed.',
    customerAction: 'Pays deposit into Escrow via MoMo / Card',
    artisanAction: 'Receives instant confirmation: "Funds secured in Escrow. You are authorized to begin."',
    icon: Lock,
    previewBadge: 'MTN MoMo & Telecel Supported',
    previewStatus: 'Deposit Locked in Escrow',
    previewAmount: 'GHS 480.00',
  },
  {
    step: '02',
    title: 'Work Completed With Care',
    tagline: 'Artisan delivers quality craftsmanship',
    description:
      'Your verified artisan arrives on time with genuine tools and materials. Keep in touch via in-app messaging, share job site photos, and track the project every step of the way without sharing personal phone numbers.',
    customerAction: 'Tracks work progress in real-time',
    artisanAction: 'Carries out installation with verified professional standards',
    icon: Clock,
    previewBadge: 'Direct In-App Messaging',
    previewStatus: 'Work in Progress',
    previewAmount: 'Job on Schedule',
  },
  {
    step: '03',
    title: 'Inspect & Release Payment',
    tagline: 'You only pay when satisfied',
    description:
      'Once the artisan finishes, take your time to inspect the work. If everything is up to standard, release the funds with one tap to the artisan’s mobile money. If work falls short, our mediation team steps in to protect your deposit.',
    customerAction: 'Inspects and approves completed job',
    artisanAction: 'Receives instant payout directly to Mobile Money wallet',
    icon: ShieldCheck,
    previewBadge: '100% Satisfaction Sign-off',
    previewStatus: 'Payment Released to Artisan',
    previewAmount: 'Job Completed',
  },
];

export function InteractiveEscrowFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const current = STEPS[activeStep];
  const StepIcon = current.icon;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          Zero-Risk Guarantee
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          How Escrow Protects Your Money
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          No more paying upfront and praying the contractor turns up. With ArtisanConnect, your payment is held safely until you inspect and approve the job.
        </p>
      </div>

      {/* Step Cards Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`text-left p-6 border transition-all cursor-pointer relative ${
                isActive
                  ? 'border-primary bg-card shadow-lg ring-1 ring-primary'
                  : 'border-border/70 bg-card/60 hover:border-primary/40 hover:bg-card'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-black px-2.5 py-1 ${
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {s.step}
                </span>
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">
                {s.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {s.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Detail & Visual Preview Box */}
      <div className="bg-card border border-border/70 p-6 md:p-8 shadow-md grid lg:grid-cols-12 gap-8 items-center">
        {/* Left: Explanatory Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Step {current.step} Breakdown
            </span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-xs font-semibold text-muted-foreground">
              {current.previewBadge}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {current.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {current.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-muted/50 border border-border/60 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                For You (Customer)
              </p>
              <p className="text-xs font-medium text-foreground">
                {current.customerAction}
              </p>
            </div>
            <div className="p-3 bg-primary/5 border border-primary/20 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                For Artisan
              </p>
              <p className="text-xs font-medium text-foreground">
                {current.artisanAction}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Simulated Mobile Escrow Interface Card */}
        <div className="lg:col-span-5 bg-background border border-border/80 p-5 shadow-inner space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground">Escrow Wallet</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5">
              Verified State
            </span>
          </div>

          <div className="space-y-1 text-center py-3 bg-muted/40 border border-border/50">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              {current.previewStatus}
            </p>
            <p className="text-2xl font-extrabold text-foreground">
              {current.previewAmount}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-primary" /> Escrow Safe &amp; Insured
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Security Method</span>
              <span className="font-semibold text-foreground">Escrow Deposit</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Release Trigger</span>
              <span className="font-semibold text-foreground">Customer Inspection</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Dispute Backup</span>
              <span className="font-semibold text-foreground">Admin Mediation</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="w-full py-2 px-3 bg-primary text-primary-foreground text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4" /> Protected Transaction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
