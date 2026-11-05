export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground transition-opacity">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Brand Shield Emblem */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Subtle pulsating outer ring */}
          <div className="absolute -inset-3 rounded-2xl bg-amber-500/15 blur-sm animate-pulse" />
          
          <div className="relative w-16 h-16 rounded-2xl bg-[#002B49] border-2 border-amber-500/60 shadow-lg shadow-amber-500/10 flex items-center justify-center">
            {/* Geometric Shield Motif */}
            <svg
              className="w-9 h-9 text-amber-500 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Artisan<span className="text-amber-500">Connect</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-muted-foreground animate-pulse">
          Connecting verified professionals across Ghana...
        </p>

        {/* Sleek indeterminate loader bar */}
        <div className="mt-6 w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-[#0284C7] rounded-full w-1/2 animate-[shimmer_1.5s_infinite_linear]" 
               style={{
                 animation: 'loadingSweep 1.6s ease-in-out infinite'
               }} 
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loadingSweep {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(250%); }
        }
      `}} />
    </div>
  );
}
