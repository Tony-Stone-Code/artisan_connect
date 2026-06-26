'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createRequest, getArtisans } from '@/app/actions/requests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Artisan {
  id: string;
  first_name: string;
  last_name: string;
}

function RequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialArtisanId = searchParams.get('artisan_id') || '';
  const initialTitle = searchParams.get('title') || '';
  const initialDescription = searchParams.get('description') || '';
  const initialLocation = searchParams.get('location') || '';

  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [artisanId, setArtisanId] = useState(initialArtisanId);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const res = await getArtisans();
        setArtisans(res.artisans);
      } catch (err) {
        console.error('Failed to fetch artisans', err);
      }
    };
    fetchArtisans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!artisanId) {
      setError('Please select an artisan');
      setIsLoading(false);
      return;
    }

    try {
      const result = await createRequest({
        artisan_id: artisanId,
        title,
        description,
        location_text: location,
      });

      if (result.error) throw new Error(result.error);

      router.push('/dashboard/requests');
    } catch (err: any) {
      setError(err.message || 'Failed to create request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Details</CardTitle>
        <CardDescription>Provide as much detail as possible to help the artisan understand the job.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md text-sm bg-destructive/10 text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Select Artisan</label>
            <select 
              value={artisanId} 
              onChange={(e) => setArtisanId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="" disabled>-- Choose an Artisan --</option>
              {artisans.map(a => (
                <option key={a.id} value={a.id}>{a.first_name} {a.last_name}</option>
              ))}
            </select>
          </div>

          <Input 
            label="Job Title" 
            placeholder="e.g. Fix leaking pipe in kitchen" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Description</label>
            <textarea 
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe what needs to be done..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <Input 
            label="Location" 
            placeholder="e.g. 123 Main St, Accra" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />

          <div className="pt-4 flex gap-4">
            <Button type="submit" isLoading={isLoading}>Submit Request</Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import { Suspense } from 'react';

export default function NewRequestPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create New Request</h2>
        <p className="text-muted-foreground">Describe your project and choose an artisan to help.</p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <RequestForm />
      </Suspense>
    </div>
  );
}
