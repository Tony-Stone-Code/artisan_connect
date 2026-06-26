'use client';

import { useState, useMemo } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';

// Center of Accra roughly
const INITIAL_VIEW_STATE = {
  longitude: -0.1869,
  latitude: 5.6037,
  zoom: 11
};

interface ArtisanMapProps {
  artisans: any[];
}

export default function ArtisanMap({ artisans }: ArtisanMapProps) {
  const [selectedArtisan, setSelectedArtisan] = useState<any | null>(null);

  // Filter out artisans without coordinates
  const mapArtisans = useMemo(() => {
    return artisans.filter(a => a.latitude && a.longitude);
  }, [artisans]);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-border shadow-sm relative">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onClick={() => setSelectedArtisan(null)}
      >
        <NavigationControl position="top-right" />

        {mapArtisans.map((artisan) => (
          <Marker
            key={artisan.id}
            longitude={artisan.longitude}
            latitude={artisan.latitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedArtisan(artisan);
            }}
          >
            <div className="bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:scale-110 hover:bg-primary/90 transition-transform shadow-lg shadow-primary/30 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </Marker>
        ))}

        {selectedArtisan && (
          <Popup
            longitude={selectedArtisan.longitude}
            latitude={selectedArtisan.latitude}
            anchor="top"
            onClose={() => setSelectedArtisan(null)}
            closeOnClick={false}
            className="z-50"
            maxWidth="300px"
          >
            <Card className="border-0 shadow-none">
              <CardContent className="p-3 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm">
                      {selectedArtisan.user.first_name} {selectedArtisan.user.last_name}
                    </h4>
                    {selectedArtisan.business_name && (
                      <p className="text-xs text-muted-foreground">{selectedArtisan.business_name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded text-xs font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{selectedArtisan.average_rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {selectedArtisan.services?.slice(0, 2).map((service: any) => (
                    <Badge key={service.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {service.subcategory?.name}
                    </Badge>
                  ))}
                  {selectedArtisan.services?.length > 2 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      +{selectedArtisan.services.length - 2}
                    </Badge>
                  )}
                </div>

                <Link href={`/artisans/${selectedArtisan.id}`} className="block w-full">
                  <Button size="sm" className="w-full text-xs h-8">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Popup>
        )}
      </Map>
    </div>
  );
}
