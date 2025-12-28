import { useNavigate } from "react-router-dom";
import { MapPin, Bell, Flame, Moon, Compass, Sparkles, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GeofenceStatus } from "@/components/mobile/GeofenceStatus";
import { PrayerTimesCard } from "@/components/mobile/PrayerTimesCard";
import { useUserStreaks } from "@/hooks/use-user-streaks";
import { useGeofencing } from "@/hooks/use-geofencing";

export default function MobileHome() {
  const navigate = useNavigate();
  const { streak } = useUserStreaks();
  const { nearbyMosques, currentPosition, calculateDistance } = useGeofencing();

  // Calculate distances for nearby mosques
  const mosquesWithDistance = nearbyMosques.map(mosque => {
    if (currentPosition) {
      const distance = calculateDistance(
        currentPosition.coords.latitude,
        currentPosition.coords.longitude,
        Number(mosque.latitude),
        Number(mosque.longitude)
      );
      const distanceInMiles = (distance / 1609.34).toFixed(1);
      return { ...mosque, distance: `${distanceInMiles} mi` };
    }
    return { ...mosque, distance: 'N/A' };
  }).slice(0, 3);

  const streakPercentage = Math.min((streak.weekly_visits / streak.weekly_goal) * 100, 100);

  return (
    <div className="space-y-5 stagger-children">
      {/* Header with Islamic Branding */}
      <div className="relative text-center py-2">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald/5 to-transparent rounded-2xl" />
        <div className="relative">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="relative">
              <Moon className="h-7 w-7 text-emerald" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-gold animate-pulse-gentle" />
            </div>
            <h1 className="font-serif text-2xl font-bold gradient-text">
              Silent Masjid
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-light tracking-wide">
            Connect to Allah. Disconnect from Dunyah.
          </p>
        </div>
      </div>

      {/* Streak Card - Enhanced */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gold/15 via-gold/10 to-gold/5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-gold-dark shadow-md">
                  <Flame className="h-7 w-7 text-white" />
                </div>
                {streak.current_streak > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">🔥</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gold-dark font-medium mb-0.5">Current Streak</p>
                <p className="font-serif text-3xl font-bold text-foreground leading-none">
                  {streak.current_streak} <span className="text-lg text-muted-foreground">days</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Weekly progress</span>
              <span className="font-semibold text-gold-dark">{streak.weekly_visits}/{streak.weekly_goal} visits</span>
            </div>
            <div className="relative">
              <Progress value={streakPercentage} className="h-2.5 bg-gold/20" />
              {streakPercentage >= 100 && (
                <div className="absolute -right-1 -top-1">
                  <span className="text-xs">✨</span>
                </div>
              )}
            </div>
            {streakPercentage >= 100 ? (
              <p className="text-xs text-emerald font-medium text-center mt-1">Weekly goal achieved! Masha'Allah! 🎉</p>
            ) : (
              <p className="text-xs text-muted-foreground text-center mt-1">
                {streak.weekly_goal - streak.weekly_visits} more {streak.weekly_goal - streak.weekly_visits === 1 ? 'visit' : 'visits'} to reach your goal
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Geofencing Detection Status */}
      <GeofenceStatus />

      {/* Quick Actions - Enhanced Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-auto py-5 flex-col gap-3 border-emerald/20 bg-gradient-to-br from-emerald/5 to-transparent hover:from-emerald/15 hover:to-emerald/5 hover:border-emerald/40 transition-all duration-300 group rounded-xl shadow-sm"
          onClick={() => navigate('/mobile/qibla')}
        >
          <div className="p-2.5 rounded-xl bg-emerald/10 group-hover:bg-emerald/20 transition-colors">
            <Compass className="h-6 w-6 text-emerald" />
          </div>
          <span className="text-sm font-medium text-foreground">Qibla Finder</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-5 flex-col gap-3 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent hover:from-gold/15 hover:to-gold/5 hover:border-gold/40 transition-all duration-300 group rounded-xl shadow-sm"
          onClick={() => navigate('/mobile/donate')}
        >
          <div className="p-2.5 rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors">
            <span className="text-2xl">💝</span>
          </div>
          <span className="text-sm font-medium text-foreground">Donate</span>
        </Button>
      </div>

      {/* Prayer Times - Real API Data */}
      <PrayerTimesCard 
        latitude={currentPosition?.coords.latitude} 
        longitude={currentPosition?.coords.longitude}
        compact
      />

      {/* Nearby Mosques - Enhanced */}
      <Card className="overflow-hidden border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald/10">
                <MapPin className="h-4 w-4 text-emerald" />
              </div>
              <h3 className="font-serif text-lg font-semibold">Nearby Mosques</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-emerald hover:text-emerald-dark hover:bg-emerald/10 gap-1 pr-2"
              onClick={() => navigate('/mobile/mosques')}
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {mosquesWithDistance.length > 0 ? (
              mosquesWithDistance.map((mosque, index) => (
                <div
                  key={mosque.id}
                  className="flex items-center justify-between rounded-xl bg-muted/40 p-3 hover:bg-muted/60 transition-colors cursor-pointer group"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 group-hover:bg-emerald/20 transition-colors">
                      <MapPin className="h-5 w-5 text-emerald" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{mosque.name}</p>
                      <p className="text-xs text-muted-foreground">{mosque.distance}</p>
                    </div>
                  </div>
                  {parseFloat(mosque.distance) < 0.5 && (
                    <Badge variant="approved" className="text-[10px] px-2 py-0.5">
                      Nearby
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Enable location to see nearby mosques</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Reminder - Enhanced */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald via-emerald to-emerald-dark text-white shadow-lg relative">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <CardContent className="p-5 relative">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm flex-shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-serif text-base font-medium leading-relaxed">
                "When you enter the masjid, silence your phone and your heart for Allah."
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/20" />
                <p className="text-xs opacity-70 font-light">Daily Reminder</p>
                <div className="h-px flex-1 bg-white/20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
