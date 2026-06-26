'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { getIdentityStatus, submitIdentity, uploadMedia } from '@/app/actions/identity';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { UploadCloud, CreditCard, Camera, CheckCircle2 } from 'lucide-react';

interface IdentityStatus {
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  notes: string | null;
  ghana_card_no: string;
}

export default function IdentityVerificationPage() {
  const [identity, setIdentity] = useState<IdentityStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [ghanaCardNo, setGhanaCardNo] = useState('');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await getIdentityStatus();
      if (data) setIdentity(data as any);
    } catch (err) {
      console.error('Error fetching identity status', err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'public_assets');

    const result = await uploadMedia(formData);
    
    if (result.error || !result.url) throw new Error(result.error || 'No URL returned');
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ghanaCardNo || !idCardFile || !selfieFile) {
      setError('All fields are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const cardUrl = await uploadFile(idCardFile);
      const selfieUrl = await uploadFile(selfieFile);

      const result = await submitIdentity({
        ghana_card_no: ghanaCardNo,
        card_image_url: cardUrl,
        selfie_url: selfieUrl
      });

      if (result.error) throw new Error(result.error);

      setIdentity({
        status: 'PENDING',
        ghana_card_no: ghanaCardNo,
        notes: null
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Identity Verification</h2>
        <p className="text-muted-foreground">Verify your identity to increase trust with customers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ghana Card Verification</CardTitle>
          <CardDescription>
            Submit your official Ghana Card and a clear selfie for manual review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {identity && identity.status === 'VERIFIED' && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md border border-green-200">
              <h3 className="font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Identity Verified
              </h3>
              <p className="text-sm mt-1">Your identity has been successfully verified. A verified badge will appear on your profile.</p>
            </div>
          )}

          {identity && identity.status === 'PENDING' && (
            <div className="bg-amber-50 text-amber-700 p-4 rounded-md border border-amber-200">
              <h3 className="font-bold">Verification Pending</h3>
              <p className="text-sm mt-1">We have received your documents. An admin is currently reviewing them.</p>
            </div>
          )}

          {identity && identity.status === 'REJECTED' && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200 mb-6">
              <h3 className="font-bold">Verification Rejected</h3>
              <p className="text-sm mt-1">Unfortunately, your submission was rejected. Reason: {identity.notes}</p>
              <p className="text-sm font-semibold mt-2">Please resubmit your documents below.</p>
            </div>
          )}

          {(!identity || identity.status === 'REJECTED') && (
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ghana Card Number</label>
                <Input 
                  placeholder="GHA-123456789-0"
                  value={ghanaCardNo}
                  onChange={(e) => setGhanaCardNo(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Upload ID Card (Front)
                  </label>
                  <div className="relative border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors bg-muted/20 overflow-hidden group">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className="flex flex-col items-center justify-center p-8 text-center h-48">
                      {idCardFile ? (
                        <div className="absolute inset-0">
                          <img src={URL.createObjectURL(idCardFile)} alt="ID Preview" className="w-full h-full object-cover opacity-90" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white font-medium text-sm">Click to change image</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <UploadCloud className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Click to upload ID Card</p>
                          <p className="text-xs text-muted-foreground mt-1">JPEG, PNG up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    Upload a Selfie
                  </label>
                  <div className="relative border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors bg-muted/20 overflow-hidden group">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className="flex flex-col items-center justify-center p-8 text-center h-48">
                      {selfieFile ? (
                        <div className="absolute inset-0">
                          <img src={URL.createObjectURL(selfieFile)} alt="Selfie Preview" className="w-full h-full object-cover opacity-90" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white font-medium text-sm">Click to change selfie</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Camera className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Click to upload Selfie</p>
                          <p className="text-xs text-muted-foreground mt-1">Well-lit face, no glasses</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Uploading & Submitting...' : 'Submit Identity Documents'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
