import { useState } from "react";
import { MapPin, Search, Navigation, Star, Clock, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mosques = [
  {
    id: 1,
    name: "Masjid Al-Noor",
    address: "123 Islamic Way, City",
    distance: "0.3 mi",
    rating: 4.8,
    visits: 24,
    favorite: true,
    nextPrayer: "Dhuhr at 12:30 PM",
  },
  {
    id: 2,
    name: "Islamic Center Downtown",
    address: "456 Main Street, City",
    distance: "1.2 mi",
    rating: 4.5,
    visits: 12,
    favorite: true,
    nextPrayer: "Dhuhr at 12:25 PM",
  },
  {
    id: 3,
    name: "Masjid Al-Huda",
    address: "789 Peace Road, City",
    distance: "2.5 mi",
    rating: 4.9,
    visits: 5,
    favorite: false,
    nextPrayer: "Dhuhr at 12:35 PM",
  },
  {
    id: 4,
    name: "Community Mosque",
    address: "321 Unity Lane, City",
    distance: "3.1 mi",
    rating: 4.6,
    visits: 8,
    favorite: false,
    nextPrayer: "Dhuhr at 12:28 PM",
  },
];

export default function MobileMosques() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMosques = mosques.filter((mosque) =>
    mosque.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteMosques = filteredMosques.filter((m) => m.favorite);
  const nearbyMosques = [...filteredMosques].sort((a, b) =>
    parseFloat(a.distance) - parseFloat(b.distance)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Mosques
        </h1>
        <p className="text-sm text-muted-foreground">
          Find mosques near you
        </p>
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
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="nearby" className="mt-4 space-y-3">
          {nearbyMosques.map((mosque) => (
            <MosqueCard key={mosque.id} mosque={mosque} />
          ))}
        </TabsContent>

        <TabsContent value="favorites" className="mt-4 space-y-3">
          {favoriteMosques.length > 0 ? (
            favoriteMosques.map((mosque) => (
              <MosqueCard key={mosque.id} mosque={mosque} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Star className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No favorite mosques yet
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
  mosque: typeof mosques[0];
}

function MosqueCard({ mosque }: MosqueCardProps) {
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
                {mosque.favorite && (
                  <Star className="h-4 w-4 fill-gold text-gold" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{mosque.address}</p>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald">
                  <Navigation className="h-3 w-3" />
                  {mosque.distance}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {mosque.nextPrayer}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {mosque.visits} visits
            </Badge>
            <Badge variant="gold" className="text-xs">
              ⭐ {mosque.rating}
            </Badge>
          </div>
          <Button variant="islamic" size="sm">
            Navigate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
