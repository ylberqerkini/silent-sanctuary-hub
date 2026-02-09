import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Navigation, Star, Plus, Heart, Map, Loader2, RefreshCw, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGeofencing, Mosque } from "@/hooks/use-geofencing";
import { useNearbyMosques, NearbyMosque } from "@/hooks/use-nearby-mosques";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { ManualLocationSearch } from "@/components/mobile/ManualLocationSearch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MAX_NEARBY_MOSQUES = 5;

export default function MobileMosques() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [manualPosition, setManualPosition] = useState<{ lat: number; lon: number } | null>(null);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { 
    currentPosition, 
    startTracking,
    isTracking,
    permissionStatus,
    error: locationError
  } = useGeofencing();

  const navigate = useNavigate();
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  // Use GPS position or manual position
  const effectiveLat = currentPosition?.coords.latitude ?? manualPosition?.lat;
  const effectiveLon = currentPosition?.coords.longitude ?? manualPosition?.lon;

  // Fetch top 5 nearest mosques from OpenStreetMap based on user's location
  const { 
    mosques: nearbyMosques, 
    isLoading: isLoadingMosques, 
    error: mosquesError,
    refetch: refetchMosques 
  } = useNearbyMosques(
    effectiveLat,
    effectiveLon,
    MAX_NEARBY_MOSQUES
  );

  // Whether we have any position (GPS or manual)
  const hasPosition = !!currentPosition || !!manualPosition;

  // Determine if we're waiting for location
  const isWaitingForLocation = !currentPosition && !manualPosition && isTracking && !locationError;
  const noGpsAvailable = (!currentPosition && (permissionStatus === 'denied' || locationError)) || (!currentPosition && !isTracking && !isRequestingLocation);

  // Fetch user favorites
  useEffect(() => {
    if (!user) return;
    
    const fetchFavorites = async () => {
      const { data } = await supabase
        .from('user_favorite_mosques')
        .select('mosque_id')
        .eq('user_id', user.id);
      
      if (data) {
        setFavorites(data.map(f => f.mosque_id));
      }
    };

    fetchFavorites();
  }, [user]);

  // Start tracking if not already
  useEffect(() => {
    if (!isTracking && !isRequestingLocation) {
      setIsRequestingLocation(true);
      startTracking().finally(() => setIsRequestingLocation(false));
    }
  }, [isTracking, startTracking, isRequestingLocation]);

  // Toggle favorite
  const toggleFavorite = async (mosqueId: string) => {
    if (!user) {
      toast.error(t('pleaseSignInToSaveFavorites'));
      return;
    }

    const isFavorite = favorites.includes(mosqueId);

    if (isFavorite) {
      const { error } = await supabase
        .from('user_favorite_mosques')
        .delete()
        .eq('user_id', user.id)
        .eq('mosque_id', mosqueId);

      if (!error) {
        setFavorites(prev => prev.filter(id => id !== mosqueId));
        toast.success(t('removedFromFavorites'));
      }
    } else {
      const { error } = await supabase
        .from('user_favorite_mosques')
        .insert({ user_id: user.id, mosque_id: mosqueId });

      if (!error) {
        setFavorites(prev => [...prev, mosqueId]);
        toast.success(t('addedToFavorites'));
      }
    }
  };

  // Filter mosques by search query
  const filteredMosques = nearbyMosques
    .map(mosque => ({
      ...mosque,
      isFavorite: favorites.includes(mosque.id)
    }))
    .filter((mosque) =>
      mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mosque.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mosque.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const favoriteMosques = filteredMosques.filter((m) => m.isFavorite);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {t('mosques')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('findMosquesNearYou')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={refetchMosques}
            disabled={isLoadingMosques}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingMosques ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="islamic" 
            size="sm"
            onClick={() => navigate('/mobile/map')}
          >
            <Map className="mr-1 h-4 w-4" />
            {t('map')}
          </Button>
        </div>
      </div>

      {/* Location info */}
      {hasPosition ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
          <Globe className="h-3 w-3" />
          <span>
            {currentPosition ? t('searchingNearby') : t('manualLocationSearch')} ({nearbyMosques.length} {t('found')})
          </span>
        </div>
      ) : permissionStatus === 'denied' || locationError ? (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          <MapPin className="h-3 w-3" />
          <span>{t('locationDenied')}</span>
        </div>
      ) : isWaitingForLocation ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>{t('gettingLocation') || 'Getting your location...'}</span>
        </div>
      ) : null}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('searchMosques')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="nearby" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nearby">{t('nearby')}</TabsTrigger>
          <TabsTrigger value="favorites">{t('favorites')} ({favoriteMosques.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="nearby" className="mt-4 space-y-3">
          {hasPosition && isLoadingMosques ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald mb-2" />
                <p className="text-sm text-muted-foreground">{t('searchingMosques')}</p>
              </CardContent>
            </Card>
          ) : hasPosition && mosquesError ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="mb-2 h-8 w-8 text-destructive" />
                <p className="text-sm text-muted-foreground mb-2">{mosquesError}</p>
                <Button variant="outline" size="sm" onClick={refetchMosques}>
                  <RefreshCw className="mr-1 h-3 w-3" />
                  {t('retry')}
                </Button>
              </CardContent>
            </Card>
          ) : hasPosition && filteredMosques.length > 0 ? (
            filteredMosques.map((mosque) => (
              <MosqueCard 
                key={mosque.id} 
                mosque={mosque} 
                onToggleFavorite={() => toggleFavorite(mosque.id)}
              />
            ))
          ) : hasPosition && filteredMosques.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t('noMosquesFound')}
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={refetchMosques}>
                  <RefreshCw className="mr-1 h-3 w-3" />
                  {t('searchAgain')}
                </Button>
              </CardContent>
            </Card>
          ) : isWaitingForLocation || isRequestingLocation ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald mb-2" />
                <p className="text-sm text-muted-foreground">{t('gettingLocation')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('pleaseAllowLocation')}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {noGpsAvailable && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                    <MapPin className="mb-2 h-8 w-8 text-destructive" />
                    <p className="text-sm font-medium text-foreground mb-1">{t('locationAccessRequired')}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {t('enableLocationInstructions')}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsRequestingLocation(true);
                        startTracking().finally(() => setIsRequestingLocation(false));
                      }}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      {t('tryAgain')}
                    </Button>
                  </CardContent>
                </Card>
              )}
              <div className="text-center text-xs text-muted-foreground py-1">
                {t('orSearchManually')}
              </div>
              <ManualLocationSearch onLocationSelected={(lat, lon) => setManualPosition({ lat, lon })} />
            </>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-4 space-y-3">
          {favoriteMosques.length > 0 ? (
            favoriteMosques.map((mosque) => (
              <MosqueCard 
                key={mosque.id} 
                mosque={mosque} 
                onToggleFavorite={() => toggleFavorite(mosque.id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Star className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t('noFavoritesYet')}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('tapHeartToAdd')}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Submit Mosque Button */}
      <Button variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        {t('submitNewMosque')}
      </Button>
    </div>
  );
}

interface MosqueCardProps {
  mosque: NearbyMosque & { isFavorite: boolean };
  onToggleFavorite: () => void;
}

function MosqueCard({ mosque, onToggleFavorite }: MosqueCardProps) {
  const { t } = useLanguage();
  
  const handleNavigate = () => {
    const destination = `${mosque.latitude},${mosque.longitude}`;
    
    // Detect iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      // Open Apple Maps with directions
      window.open(`maps://maps.apple.com/?daddr=${destination}&dirflg=d`, '_self');
    } else {
      // Open Google Maps with directions (works on Android and web)
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`, '_blank');
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10">
              <MapPin className="h-6 w-6 text-emerald" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{mosque.name}</h3>
                {mosque.source === 'openstreetmap' && (
                  <Badge variant="secondary" className="text-[10px]">OSM</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {mosque.address || mosque.city || t('addressNotAvailable')}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald">
                  <Navigation className="h-3 w-3" />
                  {mosque.distanceText}
                </span>
                {mosque.city && (
                  <span className="text-muted-foreground">
                    {mosque.city}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleFavorite}
            className="h-8 w-8"
          >
            <Heart 
              className={`h-5 w-5 ${mosque.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>

        <div className="mt-3 flex items-center justify-end border-t border-border pt-3">
          <Button variant="islamic" size="sm" onClick={handleNavigate}>
            <Navigation className="mr-1 h-3 w-3" />
            {t('navigate')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
