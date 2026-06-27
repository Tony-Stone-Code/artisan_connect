'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { updateArtisanLocation } from '@/app/actions/artisans';

export function ArtisanLocationSettings() {
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({ type: 'error', message: "Geolocation is not supported by your browser" });
      return;
    }

    setIsLocating(true);
    setLocationStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const result = await updateArtisanLocation(latitude, longitude);
          
          if (result?.success) {
            setLocationStatus({ type: 'success', message: "Location securely updated!" });
          } else {
            setLocationStatus({ type: 'error', message: result?.error || "Failed to save location" });
          }
        } catch (error) {
          setLocationStatus({ type: 'error', message: "An unexpected error occurred" });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus({ type: 'error', message: "Location access denied. Please enable it in browser settings." });
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus({ type: 'error', message: "Location information is unavailable." });
            break;
          case error.TIMEOUT:
            setLocationStatus({ type: 'error', message: "The request to get user location timed out." });
            break;
          default:
            setLocationStatus({ type: 'error', message: "An unknown error occurred getting location." });
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Service Location
        </CardTitle>
        <CardDescription>
          Update your exact GPS coordinates so customers can find you on the interactive map.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {locationStatus && (
          <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${
            locationStatus.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
          }`}>
            {locationStatus.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {locationStatus.message}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-muted/50 p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground max-w-sm">
            We use your browser's secure location service to pinpoint your service area. This helps customers gauge travel distance accurately.
          </div>
          <Button 
            onClick={handleUpdateLocation} 
            disabled={isLocating}
            className="w-full sm:w-auto shrink-0"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Update My Location
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
