import { useEffect } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGeofencing } from '@/hooks/use-geofencing';

interface GeofenceStatusProps {
  compact?: boolean;
}

export function GeofenceStatus({ compact = false }: GeofenceStatusProps) {
  const { 
    isTracking, 
    insideMosque, 
    nearbyMosques,
    permissionStatus, 
    error,
    startTracking,
    stopTracking,
    currentPosition,
  } = useGeofencing();

  // Auto-start tracking on mount
  useEffect(() => {
    if (permissionStatus === 'granted' && !isTracking) {
      startTracking();
    }
  }, [permissionStatus, isTracking, startTracking]);

  if (compact) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isTracking ? (
            <div className="relative">
              <MapPin className="h-5 w-5 text-emerald" />
              <span className="absolute -right-1 -top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald"></span>
              </span>
            </div>
          ) : permissionStatus === 'denied' ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : (
            <MapPin className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">Mosque Detection</p>
            <p className="text-xs text-muted-foreground">
              {isTracking 
                ? insideMosque 
                  ? `Inside ${insideMosque.name}`
                  : `${nearbyMosques.length} mosques nearby`
                : permissionStatus === 'denied'
                ? 'Location access denied'
                : 'Tap to enable location tracking'
              }
            </p>
          </div>
        </div>
        {!isTracking && permissionStatus !== 'denied' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={startTracking}
          >
            Enable
          </Button>
        )}
        {isTracking && (
          <Badge variant={insideMosque ? 'approved' : 'secondary'} className="text-xs">
            {insideMosque ? 'Active' : 'Scanning'}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={`border-emerald/30 ${insideMosque ? 'bg-gradient-to-br from-emerald/20 to-emerald/10' : 'bg-gradient-to-br from-emerald/10 to-emerald/5'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                isTracking 
                  ? insideMosque ? 'bg-emerald' : 'bg-emerald/20'
                  : 'bg-muted'
              }`}>
                {isTracking ? (
                  <MapPin className={`h-6 w-6 ${insideMosque ? 'text-white' : 'text-emerald'}`} />
                ) : (
                  <Navigation className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              {isTracking && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75"></span>
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald"></span>
                </span>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mosque Detection</p>
              <p className={`font-medium ${insideMosque ? 'text-emerald' : ''}`}>
                {isTracking 
                  ? insideMosque 
                    ? `Inside ${insideMosque.name}`
                    : 'Active - Scanning'
                  : 'Inactive'
                }
              </p>
            </div>
          </div>
          
          {isTracking ? (
            <Button variant="outline" size="sm" onClick={stopTracking}>
              Stop
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={startTracking}>
              {permissionStatus === 'denied' ? 'Settings' : 'Start'}
            </Button>
          )}
        </div>

        {/* Status message */}
        {isTracking && (
          <div className={`mt-3 flex items-center gap-2 rounded-lg p-2 text-xs ${
            insideMosque ? 'bg-emerald/20 text-emerald' : 'bg-muted/50 text-muted-foreground'
          }`}>
            {insideMosque ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Phone silenced. May your prayers be accepted.</span>
              </>
            ) : nearbyMosques.length > 0 ? (
              <>
                <MapPin className="h-4 w-4" />
                <span>{nearbyMosques.length} mosque{nearbyMosques.length > 1 ? 's' : ''} within 1km</span>
              </>
            ) : (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Scanning for nearby mosques...</span>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {permissionStatus === 'denied' && !isTracking && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Location permission denied. Enable in device settings.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
