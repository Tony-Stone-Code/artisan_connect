'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function DirectoryBackdrop() {
  const [scrollY, setScrollY] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      setShowTopBtn(currentScroll > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Ambient Gradient Orbs that react to scroll position */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Right Ambient Orb */}
        <div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float-slow transition-transform duration-1000 ease-out"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        />

        {/* Mid-Left Ambient Gold Orb */}
        <div 
          className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-amber-500/8 blur-3xl animate-pulse-glow transition-transform duration-1000 ease-out"
          style={{ transform: `translateY(${-scrollY * 0.05}px)` }}
        />

        {/* Bottom-Right Ambient Cyan Orb */}
        <div 
          className="absolute bottom-20 -right-20 w-88 h-88 rounded-full bg-cyan-500/8 blur-3xl animate-float-slow transition-transform duration-1000 ease-out"
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        />

        {/* Subtle Architectural Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70"
        />
      </div>

      {/* Floating Back to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-20 md:bottom-8 right-6 z-40 p-3 bg-primary text-primary-foreground border-2 border-primary-foreground/20 shadow-2xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-up"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
