import { useNavigate } from "react-router-dom";
import { MapPin, Bell, Flame, Moon, Sun, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GeofenceStatus } from "@/components/mobile/GeofenceStatus";
import { useUserStreaks } from "@/hooks/use-user-streaks";
import { useGeofencing } from "@/hooks/use-geofencing";

// Mock prayer times
const prayerTimes = [
  { name: "Fajr", time: "5:23 AM", passed: true },
  { name: "Sunrise", time: "6:45 AM", passed: true },
  { name: "Dhuhr", time: "12:30 PM", passed: false, next: true },
  { name: "Asr", time: "3:45 PM", passed: false },
  { name: "Maghrib", time: "6:15 PM", passed: false },
  { name: "Isha", time: "7:45 PM", passed: false },
];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Moon className="h-6 w-6 text-emerald" />
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Silent Masjid
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect to Allah. Disconnect from Dunyah.
        </p>
      </div>

      {/* Streak Card */}
      <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-gold/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                <Flame className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="font-serif text-2xl font-bold text-foreground">
                  {streak.current_streak} days
                </p>
              </div>
            </div>
            <Badge variant="gold" className="text-xs">
              {streak.current_streak > 0 ? 'Keep it up! 🔥' : 'Start today!'}
            </Badge>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Weekly goal: {streak.weekly_visits}/{streak.weekly_goal}</span>
              <span>{Math.round((streak.weekly_visits / streak.weekly_goal) * 100)}%</span>
            </div>
            <Progress value={(streak.weekly_visits / streak.weekly_goal) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Geofencing Detection Status */}
      <GeofenceStatus />

      {/* Prayer Times */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Prayer Times</h3>
            <Badge variant="secondary" className="text-xs">
              <Clock className="mr-1 h-3 w-3" />
              Today
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {prayerTimes.map((prayer) => (
              <div
                key={prayer.name}
                className={`rounded-lg p-3 text-center transition-all ${
                  prayer.next
                    ? "bg-emerald/20 ring-2 ring-emerald/50"
                    : prayer.passed
                    ? "bg-muted/50 opacity-60"
                    : "bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {prayer.name === "Fajr" || prayer.name === "Isha" ? (
                    <Moon className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Sun className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-xs font-medium">{prayer.name}</span>
                </div>
                <p className={`mt-1 text-sm ${prayer.next ? "font-bold text-emerald" : ""}`}>
                  {prayer.time}
                </p>
                {prayer.next && (
                  <Badge variant="approved" className="mt-1 text-[10px]">
                    Next
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nearby Mosques */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Nearby Mosques</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-emerald"
              onClick={() => navigate('/mobile/mosques')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {mosquesWithDistance.length > 0 ? (
              mosquesWithDistance.map((mosque) => (
                <div
                  key={mosque.id}
                  className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10">
                      <MapPin className="h-5 w-5 text-emerald" />
                    </div>
                    <div>
                      <p className="font-medium">{mosque.name}</p>
                      <p className="text-xs text-muted-foreground">{mosque.distance}</p>
                    </div>
                  </div>
                  {parseFloat(mosque.distance) < 0.5 && (
                    <Badge variant="approved" className="text-xs">
                      Nearby
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Enable location to see nearby mosques
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reminder */}
      <Card className="border-none bg-gradient-to-r from-emerald to-emerald-dark text-white">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-serif text-sm font-medium">
                "When you enter the masjid, silence your phone and your heart for Allah."
              </p>
              <p className="mt-1 text-xs opacity-80">Daily Reminder</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
