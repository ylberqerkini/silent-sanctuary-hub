import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Navigation, Star, Clock, Plus, Heart, Map } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGeofencing, Mosque } from "@/hooks/use-geofencing";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function MobileMosques() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();
  const { 
    allMosques, 
    nearbyMosques: geofenceNearby, 
    currentPosition, 
    calculateDistance,
    startTracking,
    isTracking 
  } = useGeofencing();

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
      toast.error('Please sign in to save favorites');
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
        toast.success('Removed from favorites');
      }
    } else {
      const { error } = await supabase
        .from('user_favorite_mosques')
        .insert({ user_id: user.id, mosque_id: mosqueId });

      if (!error) {
        setFavorites(prev => [...prev, mosqueId]);
        toast.success('Added to favorites');
      }
    }
  };

  // Calculate distances and sort mosques
  const mosquesWithDistance = allMosques.map(mosque => {
    let distance = 'N/A';
    let distanceMeters = Infinity;
    
    if (currentPosition) {
      distanceMeters = calculateDistance(
        currentPosition.coords.latitude,
        currentPosition.coords.longitude,
        Number(mosque.latitude),
        Number(mosque.longitude)
      );
      const distanceInMiles = (distanceMeters / 1609.34).toFixed(1);
      distance = `${distanceInMiles} mi`;
    }
    
    return { 
      ...mosque, 
      distance, 
      distanceMeters,
      isFavorite: favorites.includes(mosque.id) 
    };
  }).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const filteredMosques = mosquesWithDistance.filter((mosque) =>
    mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mosque.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteMosques = filteredMosques.filter((m) => m.isFavorite);

  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Mosques
          </h1>
          <p className="text-sm text-muted-foreground">
            Find mosques near you
          </p>
        </div>
        <Button 
          variant="islamic" 
          size="sm"
          onClick={() => navigate('/mobile/map')}
        >
          <Map className="mr-1 h-4 w-4" />
          Map
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search mosques..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="nearby" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favoriteMosques.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="nearby" className="mt-4 space-y-3">
          {filteredMosques.length > 0 ? (
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
                  No mosques found
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
                  No favorite mosques yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tap the heart icon to add favorites
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Submit Mosque Button */}
      <Button variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Submit New Mosque
      </Button>
    </div>
  );
}

interface MosqueCardProps {
  mosque: Mosque & { distance: string; distanceMeters: number; isFavorite: boolean };
  onToggleFavorite: () => void;
}

function MosqueCard({ mosque, onToggleFavorite }: MosqueCardProps) {
  const handleNavigate = () => {
    // Open in maps app
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
                {mosque.is_verified && (
                  <Badge variant="approved" className="text-[10px]">Verified</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {mosque.address || mosque.city || 'Address not available'}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald">
                  <Navigation className="h-3 w-3" />
                  {mosque.distance}
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

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {mosque.geofence_radius}m radius
            </Badge>
          </div>
          <Button variant="islamic" size="sm" onClick={handleNavigate}>
            <Navigation className="mr-1 h-3 w-3" />
            Navigate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
