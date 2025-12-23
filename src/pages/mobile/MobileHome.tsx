import { MapPin, Bell, Flame, Moon, Sun, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock prayer times
const prayerTimes = [
  { name: "Fajr", time: "5:23 AM", passed: true },
  { name: "Sunrise", time: "6:45 AM", passed: true },
  { name: "Dhuhr", time: "12:30 PM", passed: false, next: true },
  { name: "Asr", time: "3:45 PM", passed: false },
  { name: "Maghrib", time: "6:15 PM", passed: false },
  { name: "Isha", time: "7:45 PM", passed: false },
];

const nearbyMosques = [
  { name: "Masjid Al-Noor", distance: "0.3 mi", status: "nearby" },
  { name: "Islamic Center", distance: "1.2 mi", status: "far" },
  { name: "Masjid Al-Huda", distance: "2.5 mi", status: "far" },
];

export default function MobileHome() {
  const currentStreak = 12;
  const weeklyGoal = 21;
  const weeklyProgress = 15;

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
                  {currentStreak} days
                </p>
              </div>
            </div>
            <Badge variant="gold" className="text-xs">
              Keep it up! 🔥
            </Badge>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Weekly goal: {weeklyProgress}/{weeklyGoal}</span>
              <span>{Math.round((weeklyProgress / weeklyGoal) * 100)}%</span>
            </div>
            <Progress value={(weeklyProgress / weeklyGoal) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Detection Status */}
      <Card className="border-emerald/30 bg-gradient-to-br from-emerald/10 to-emerald/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald/20">
                  <MapPin className="h-6 w-6 text-emerald" />
                </div>
                <span className="absolute -right-1 -top-1 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75"></span>
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald"></span>
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mosque Detection</p>
                <p className="font-medium text-emerald">Active</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

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
            <Button variant="ghost" size="sm" className="text-emerald">
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {nearbyMosques.map((mosque) => (
              <div
                key={mosque.name}
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
                {mosque.status === "nearby" && (
                  <Badge variant="approved" className="text-xs">
                    Nearby
                  </Badge>
                )}
              </div>
            ))}
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
