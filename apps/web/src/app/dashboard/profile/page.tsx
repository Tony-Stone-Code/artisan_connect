'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { updateProfile } from '@/app/actions/auth';
import { uploadMedia, getIdentityStatus } from '@/app/actions/identity';
import Link from 'next/link';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ProfilePage() {
  const { user } = useAuth();
  
  // Profile State
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [identityStatus, setIdentityStatus] = useState<any>(null);

  useEffect(() => {
    if (user?.user_metadata?.role === 'ARTISAN') {
      getIdentityStatus().then(status => setIdentityStatus(status));
    }
  }, [user]);

  // Security State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSecurityLoading, setIsSecurityLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMessage(null);

    try {
      const supabase = createClient();
      let finalAvatarUrl = avatarUrl;

      // Upload avatar if a new file was selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('bucket', 'verifications'); // Using verifications bucket for now
        const uploadResult = await uploadMedia(formData);
        if (uploadResult.error || !uploadResult.url) {
          throw new Error(uploadResult.error || 'Failed to upload avatar');
        }
        finalAvatarUrl = uploadResult.url;
        setAvatarUrl(finalAvatarUrl);
      }

      // 1. Update Supabase Auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          ...(finalAvatarUrl && { avatar_url: finalAvatarUrl })
        }
      });

      if (authError) throw authError;

      // 2. Update Backend Database via Server Action
      try {
        await updateProfile({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          ...(finalAvatarUrl && { avatar_url: finalAvatarUrl })
        });
      } catch (actionError) {
        console.warn('Backend update failed', actionError);
        // We still show success if supabase updated successfully, but log warning
      }

      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setProfileMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSecurityLoading(true);
    setSecurityMessage(null);

    if (password !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'Passwords do not match' });
      setIsSecurityLoading(false);
      return;
    }

    if (password.length < 6) {
      setSecurityMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setIsSecurityLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setSecurityMessage({ type: 'success', text: 'Password updated successfully!' });
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setSecurityMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setIsSecurityLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and personal information.</p>
      </div>

      {user?.user_metadata?.role === 'ARTISAN' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${
                identityStatus?.status === 'VERIFIED' ? 'bg-green-100 text-green-600' :
                identityStatus?.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                'bg-primary/20 text-primary'
              }`}>
                {identityStatus?.status === 'VERIFIED' ? <ShieldCheck className="w-6 h-6" /> :
                 identityStatus?.status === 'PENDING' ? <ShieldAlert className="w-6 h-6" /> :
                 <Shield className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-semibold text-lg">Identity Verification</h3>
                <p className="text-sm text-muted-foreground">
                  {identityStatus?.status === 'VERIFIED' ? 'Your identity is fully verified. Customers trust you more.' :
                   identityStatus?.status === 'PENDING' ? 'Your verification documents are under review.' :
                   'Verify your identity (Ghana Card) to build trust and win more jobs.'}
                </p>
              </div>
            </div>
            <Link href="/dashboard/identity">
              <Button variant={identityStatus?.status === 'VERIFIED' ? 'outline' : 'primary'} size="sm">
                {identityStatus?.status ? 'View Verification' : 'Verify Identity Now'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {profileMessage && (
              <div className={`p-3 rounded-md text-sm ${profileMessage.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                {profileMessage.text}
              </div>
            )}
            
            <div className="flex items-center gap-6 pb-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                {avatarFile ? (
                  <img src={URL.createObjectURL(avatarFile)} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-muted-foreground">{firstName[0]}{lastName[0] || ''}</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Profile Picture</label>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">Recommended size: 256x256px</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <Input label="Email Address" type="email" value={user?.email || ''} disabled />
            <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <div className="pt-4">
              <Button type="submit" isLoading={isProfileLoading}>Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Update your password and security preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSecuritySubmit} className="space-y-4">
            {securityMessage && (
              <div className={`p-3 rounded-md text-sm ${securityMessage.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                {securityMessage.text}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div className="pt-4">
              <Button type="submit" variant="outline" isLoading={isSecurityLoading}>Update Password</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
