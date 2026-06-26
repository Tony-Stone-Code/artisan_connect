'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { matchServiceRequest } from '@/app/actions/match';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, ArrowRight, MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function AIMatchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';
  
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsAnalyzing(true);
    setError('');
    
    try {
      const res = await matchServiceRequest(prompt);
      if (res.error) {
        setError(res.error);
      } else {
        setResult(res.result);
        setArtisans(res.artisans || []);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-trigger if initial prompt exists
  useEffect(() => {
    if (initialPrompt && !result && !isAnalyzing) {
      // Create a synthetic event to pass to handleMatch, or just extract the logic
      const runMatch = async () => {
        setIsAnalyzing(true);
        setError('');
        try {
          const res = await matchServiceRequest(initialPrompt);
          if (res.error) {
            setError(res.error);
          } else {
            setResult(res.result);
            setArtisans(res.artisans || []);
          }
        } catch (err) {
          setError('An unexpected error occurred.');
        } finally {
          setIsAnalyzing(false);
        }
      };
      runMatch();
    }
  }, [initialPrompt]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered Matching
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Describe your problem.<br/>We'll find the right expert.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Don't know exactly who to call? Just tell us what's broken, leaking, or needs building, and our AI will instantly match you with verified artisans.
        </p>
      </div>

      {/* Input Area */}
      <Card className="border-2 border-primary/20 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <CardContent className="p-6">
          <form onSubmit={handleMatch} className="flex flex-col gap-4">
            <textarea
              className="w-full min-h-[160px] p-4 text-lg bg-background rounded-xl border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none placeholder:text-muted-foreground/50"
              placeholder="e.g., 'Water is coming out of the wall in my bathroom really fast and the floor is flooding. I live in East Legon.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isAnalyzing}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="lg" 
                className="gap-2 px-8 shadow-md"
                disabled={!prompt.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Analyzing Request...
                  </>
                ) : (
                  <>
                    Find Matches <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
          {error && (
            <div className="mt-4 p-4 text-sm text-destructive bg-destructive/10 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Area */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-xl mb-2">{result.title}</h3>
                  <p className="text-muted-foreground">{result.cleanedDescription}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="text-sm px-3 py-1 border-primary/30">
                    Needs: <strong className="ml-1">{result.profession}</strong>
                  </Badge>
                  <Badge variant="outline" className={`text-sm px-3 py-1 ${getUrgencyColor(result.urgency)}`}>
                    Urgency: {result.urgency}
                  </Badge>
                  {result.location && (
                    <Badge variant="outline" className="text-sm px-3 py-1 flex items-center gap-1 border-primary/30">
                      <MapPin className="w-3 h-3" /> {result.location}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 rounded-xl p-6 flex flex-col justify-center border border-border">
              <h3 className="font-semibold text-lg mb-2">Next Steps</h3>
              <p className="text-muted-foreground mb-4">
                We've identified the best-matched artisans for your specific problem. Review them below and click <strong>"Select"</strong> to forward your pre-filled request to them.
              </p>
              <div className="text-sm font-medium text-primary">
                Found {artisans.length} matching artisans
              </div>
            </div>
          </div>

          {/* Artisans List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Recommended Artisans</h2>
            {artisans.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground">No artisans found matching "{result.profession}" in our directory yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artisans.map(artisan => (
                  <Card key={artisan.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {artisan.first_name} {artisan.last_name}
                        </h4>
                        {artisan.business_name && (
                          <p className="text-sm text-muted-foreground">{artisan.business_name}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {artisan.matched_service}
                          </Badge>
                          <div className="text-sm font-medium text-amber-500">
                            ★ {artisan.average_rating.toFixed(1)} ({artisan.review_count})
                          </div>
                        </div>
                      </div>
                      <Link 
                        href={`/dashboard/requests/new?artisan_id=${artisan.id}&title=${encodeURIComponent(result.title)}&description=${encodeURIComponent(result.cleanedDescription)}&location=${encodeURIComponent(result.location || '')}`}
                        className="w-full sm:w-auto"
                      >
                        <Button className="w-full">Select</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIMatchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <AIMatchContent />
    </Suspense>
  );
}
