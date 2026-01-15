import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Navigation, Star, Plus, Heart, Map, Loader2, RefreshCw, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGeofencing, Mosque } from "@/hooks/use-geofencing";
import { useNearbyMosques, NearbyMosque } from "@/hooks/use-nearby-mosques";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RADIUS_OPTIONS = [
  { value: "10", label: "10 km" },
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" },
  { value: "100", label: "100 km" },
];

export default function MobileMosques() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRadius, setSearchRadius] = useState("50");
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { 
    currentPosition, 
    startTracking,
    isTracking 
  } = useGeofencing();

  const navigate = useNavigate();

  // Fetch mosques from OpenStreetMap based on user's location
  const { 
    mosques: nearbyMosques, 
    isLoading: isLoadingMosques, 
    error: mosquesError,
    refetch: refetchMosques 
  } = useNearbyMosques(
    currentPosition?.coords.latitude,
    currentPosition?.coords.longitude,
    parseInt(searchRadius)
  );

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
    if (!isTracking) {
      startTracking();
    }
  }, [isTracking, startTracking]);

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
      {currentPosition && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
          <Globe className="h-3 w-3" />
          <span>{t('searchingNearby')} ({nearbyMosques.length} {t('found')})</span>
        </div>
      )}

      {/* Search and Radius Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchMosques')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={searchRadius} onValueChange={setSearchRadius}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RADIUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="nearby" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nearby">{t('nearby')}</TabsTrigger>
          <TabsTrigger value="favorites">{t('favorites')} ({favoriteMosques.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="nearby" className="mt-4 space-y-3">
          {isLoadingMosques ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald mb-2" />
                <p className="text-sm text-muted-foreground">{t('searchingMosques')}</p>
              </CardContent>
            </Card>
          ) : mosquesError ? (
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
          ) : filteredMosques.length > 0 ? (
            filteredMosques.map((mosque) => (
              <MosqueCard 
                key={mosque.id} 
                mosque={mosque} 
                onToggleFavorite={() => toggleFavorite(mosque.id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {currentPosition ? t('noMosquesFound') : t('enableLocation')}
                </p>
              </CardContent>
            </Card>
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
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.latitude},${mosque.longitude}`;
    window.open(url, '_blank');
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
