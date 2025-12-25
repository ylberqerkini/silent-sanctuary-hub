import { useState, useEffect } from 'react';
import { Compass, Navigation, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQibla, calculateDistanceToKaaba } from '@/hooks/use-qibla';
import { Geolocation } from '@capacitor/geolocation';

export function QiblaCompass() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    qiblaDirection,
    qiblaFromDevice,
    isSupported,
    hasPermission,
    error,
    requestPermission,
  } = useQibla(location?.lat, location?.lng);

  // Get user location
  useEffect(() => {
    const getLocation = async () => {
      try {
        setIsLoadingLocation(true);
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      } catch (err) {
        setLocationError('Could not get your location');
        console.error('Location error:', err);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getLocation();
  }, []);

  // Auto-request permission on supported devices without permission API
  useEffect(() => {
    if (isSupported && !hasPermission && location) {
      // Try to auto-enable for non-iOS devices
      const checkAutoPermission = () => {
        const testHandler = (e: DeviceOrientationEvent) => {
          if (e.alpha !== null) {
            requestPermission();
          }
          window.removeEventListener('deviceorientation', testHandler);
        };
        window.addEventListener('deviceorientation', testHandler, { once: true });
      };
      checkAutoPermission();
    }
  }, [isSupported, hasPermission, location, requestPermission]);

  const distance = location ? calculateDistanceToKaaba(location.lat, location.lng) : null;

  if (isLoadingLocation) {
    return (
      <Card className="bg-gradient-to-br from-emerald/10 to-gold/5 border-emerald/20">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald mb-4" />
          <p className="text-sm text-muted-foreground">Getting your location...</p>
        </CardContent>
      </Card>
    );
  }

  if (locationError) {
    return (
      <Card className="bg-card/80 border-destructive/20">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-sm text-destructive mb-4">{locationError}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-emerald/10 to-gold/5 border-emerald/20 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-serif flex items-center gap-2">
            <Compass className="h-5 w-5 text-emerald" />
            Qibla Direction
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {Math.round(qiblaDirection)}° from North
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Compass Container */}
        <div className="relative mx-auto w-64 h-64">
          {/* Outer ring with degree markings */}
          <div className="absolute inset-0 rounded-full border-4 border-emerald/20 bg-background/50">
            {/* Cardinal direction markers */}
            {['N', 'E', 'S', 'W'].map((dir, i) => (
              <div
                key={dir}
                className="absolute font-bold text-sm"
                style={{
                  top: dir === 'N' ? '8px' : dir === 'S' ? 'auto' : '50%',
                  bottom: dir === 'S' ? '8px' : 'auto',
                  left: dir === 'W' ? '8px' : dir === 'E' ? 'auto' : '50%',
                  right: dir === 'E' ? '8px' : 'auto',
                  transform: dir === 'N' || dir === 'S' ? 'translateX(-50%)' : 'translateY(-50%)',
                }}
              >
                <span className={dir === 'N' ? 'text-emerald' : 'text-muted-foreground'}>
                  {dir}
                </span>
              </div>
            ))}

            {/* Degree tick marks */}
            {Array.from({ length: 72 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 left-1/2 h-2"
                style={{
                  transform: `translateX(-50%) rotate(${i * 5}deg)`,
                  transformOrigin: 'bottom center',
                  height: '128px',
                }}
              >
                <div 
                  className={`w-0.5 ${i % 6 === 0 ? 'h-3 bg-emerald/50' : 'h-1.5 bg-muted-foreground/30'}`}
                />
              </div>
            ))}
          </div>

          {/* Rotating compass needle container */}
          <div
            className="absolute inset-4 rounded-full transition-transform duration-300 ease-out"
            style={{
              transform: `rotate(${qiblaFromDevice ?? 0}deg)`,
            }}
          >
            {/* Qibla pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[24px] border-l-transparent border-r-transparent border-b-emerald" />
              <span className="text-[10px] font-bold text-emerald mt-1">QIBLA</span>
            </div>

            {/* Kaaba icon at center-top direction */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
              <div className="w-10 h-10 rounded-lg bg-emerald/20 border-2 border-emerald flex items-center justify-center">
                <span className="text-2xl">🕋</span>
              </div>
            </div>
          </div>

          {/* Center dot (user position) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg" />
          </div>

          {/* Current heading indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
            <Navigation className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Info section */}
        <div className="mt-6 space-y-3">
          {/* Distance to Kaaba */}
          {distance && (
            <div className="flex items-center justify-center gap-2 text-center">
              <MapPin className="h-4 w-4 text-emerald" />
              <span className="text-sm text-muted-foreground">
                Distance to Kaaba: <span className="font-semibold text-foreground">{Math.round(distance).toLocaleString()} km</span>
              </span>
            </div>
          )}

          {/* Permission/Support status */}
          {!hasPermission && isSupported && (
            <div className="text-center">
              <Button 
                onClick={requestPermission}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Compass className="h-4 w-4" />
                Enable Compass
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Tap to enable live compass tracking
              </p>
            </div>
          )}

          {!isSupported && (
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">
                Compass not available on this device. 
                Qibla direction is {Math.round(qiblaDirection)}° from North.
              </p>
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive text-center">{error}</p>
          )}

          {/* Live indicator */}
          {hasPermission && qiblaFromDevice !== null && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              <span className="text-xs text-muted-foreground">Live compass active</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default QiblaCompass;
