import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Geolocation } from '@capacitor/geolocation';

interface Mosque {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  geofence_radius: number;
}

const MAPBOX_TOKEN_KEY = 'mapbox_public_token';

const MosqueMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => 
    localStorage.getItem(MAPBOX_TOKEN_KEY) || ''
  );
  const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem(MAPBOX_TOKEN_KEY));
  const [tempToken, setTempToken] = useState('');
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Fetch mosques from database
  useEffect(() => {
    const fetchMosques = async () => {
      const { data, error } = await supabase
        .from('mosques')
        .select('*')
        .eq('is_verified', true);
      
      if (!error && data) {
        setMosques(data);
      }
    };
    fetchMosques();
  }, []);

  // Get user location
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true
        });
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      } catch (error) {
        console.log('Could not get user location:', error);
        // Default to a central location if permission denied
        setUserLocation({ lat: 40.7128, lng: -74.0060 });
      }
    };
    getUserLocation();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !userLocation) return;
    
    setIsLoading(true);
    setMapError(null);

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [userLocation.lng, userLocation.lat],
        zoom: 13,
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('load', () => {
        setIsLoading(false);
        
        // Add user location marker
        const userEl = document.createElement('div');
        userEl.className = 'user-marker';
        userEl.innerHTML = `
          <div class="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
        `;
        
        userMarker.current = new mapboxgl.Marker({ element: userEl })
          .setLngLat([userLocation.lng, userLocation.lat])
          .setPopup(new mapboxgl.Popup().setHTML('<p class="font-semibold text-foreground">Your Location</p>'))
          .addTo(map.current!);

        // Add mosque markers
        mosques.forEach((mosque) => {
          const mosqueEl = document.createElement('div');
          mosqueEl.className = 'mosque-marker cursor-pointer';
          mosqueEl.innerHTML = `
            <div class="w-10 h-10 bg-primary/90 rounded-full border-2 border-primary-foreground shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform">
              <span class="text-lg">🕌</span>
            </div>
          `;
          
          new mapboxgl.Marker({ element: mosqueEl })
            .setLngLat([mosque.longitude, mosque.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="p-2">
                  <h3 class="font-bold text-foreground text-sm">${mosque.name}</h3>
                  ${mosque.address ? `<p class="text-xs text-muted-foreground mt-1">${mosque.address}</p>` : ''}
                  ${mosque.city ? `<p class="text-xs text-muted-foreground">${mosque.city}</p>` : ''}
                </div>
              `)
            )
            .addTo(map.current!);
        });
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Failed to load map. Please check your Mapbox token.');
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map');
      setIsLoading(false);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, userLocation, mosques]);

  const handleSaveToken = () => {
    if (tempToken.trim()) {
      localStorage.setItem(MAPBOX_TOKEN_KEY, tempToken.trim());
      setMapboxToken(tempToken.trim());
      setShowTokenInput(false);
    }
  };

  const centerOnUser = () => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 14,
        duration: 1500
      });
    }
  };

  if (showTokenInput) {
    return (
      <Card className="p-6 m-4 bg-card/80 backdrop-blur-md border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Setup Mapbox</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          To display the interactive map, please enter your Mapbox public token. 
          You can get one free at{' '}
          <a 
            href="https://mapbox.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            mapbox.com
          </a>
        </p>
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="pk.eyJ1Ijo..."
            value={tempToken}
            onChange={(e) => setTempToken(e.target.value)}
            className="bg-background/50"
          />
          <Button onClick={handleSaveToken} className="w-full">
            Save & Show Map
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative h-full w-full min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Card className="p-4 m-4 bg-destructive/10 border-destructive/20">
            <p className="text-destructive text-sm">{mapError}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                localStorage.removeItem(MAPBOX_TOKEN_KEY);
                setShowTokenInput(true);
                setMapError(null);
              }}
            >
              Reset Token
            </Button>
          </Card>
        </div>
      )}
      
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {/* Map controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between z-10">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowTokenInput(true)}
          className="bg-card/80 backdrop-blur-md shadow-lg"
        >
          <Settings className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          onClick={centerOnUser}
          className="bg-primary shadow-lg"
        >
          <Navigation className="w-4 h-4 mr-2" />
          My Location
        </Button>
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="p-3 bg-card/80 backdrop-blur-md border-primary/20">
          <div className="text-xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <span className="text-muted-foreground">Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🕌</span>
              <span className="text-muted-foreground">Mosque ({mosques.length})</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MosqueMap;
