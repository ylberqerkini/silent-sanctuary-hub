import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Bell, Flame, Moon, Compass, Sparkles, ChevronRight, Sun, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GeofenceStatus } from "@/components/mobile/GeofenceStatus";
import { PrayerTimesCard } from "@/components/mobile/PrayerTimesCard";
import { LanguageSelector } from "@/components/mobile/LanguageSelector";
import { useUserStreaks } from "@/hooks/use-user-streaks";
import { useGeofencing } from "@/hooks/use-geofencing";
import { useLanguage } from "@/hooks/use-language";
import { useRamadan } from "@/hooks/use-ramadan";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { cn } from "@/lib/utils";

export default function MobileHome() {
  const navigate = useNavigate();
  const { streak } = useUserStreaks();
  const { nearbyMosques, currentPosition, calculateDistance } = useGeofencing();
  const { t } = useLanguage();
  const { isRamadan, currentRamadanDay, daysUntilRamadan, progress } = useRamadan();
  const { prayerTimes } = usePrayerTimes(
    currentPosition?.coords.latitude, 
    currentPosition?.coords.longitude
  );
  
  // Countdown state for Ramadan card
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [countdownTarget, setCountdownTarget] = useState<"suhoor" | "iftar">("iftar");

  // Calculate Suhoor/Iftar countdown
  useEffect(() => {
    if (!prayerTimes || !isRamadan) return;

    const calculateCountdown = () => {
      const now = new Date();
      const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      
      const fajrTime = prayerTimes.timings.Fajr.split(":").map(Number);
      const maghribTime = prayerTimes.timings.Maghrib.split(":").map(Number);
      
      const fajrSeconds = fajrTime[0] * 3600 + fajrTime[1] * 60;
      const maghribSeconds = maghribTime[0] * 3600 + maghribTime[1] * 60;

      let targetSeconds: number;
      
      if (currentTime < fajrSeconds) {
        targetSeconds = fajrSeconds - currentTime;
        setCountdownTarget("suhoor");
      } else if (currentTime < maghribSeconds) {
        targetSeconds = maghribSeconds - currentTime;
        setCountdownTarget("iftar");
      } else {
        const secondsUntilMidnight = 86400 - currentTime;
        targetSeconds = secondsUntilMidnight + fajrSeconds;
        setCountdownTarget("suhoor");
      }

      setCountdown({
        hours: Math.floor(targetSeconds / 3600),
        minutes: Math.floor((targetSeconds % 3600) / 60),
        seconds: Math.floor(targetSeconds % 60)
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes, isRamadan]);

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
  const visitsRemaining = streak.weekly_goal - streak.weekly_visits;

  return (
    <div className="space-y-5 stagger-children">
      {/* Header with Islamic Branding */}
      <div className="relative text-center py-2">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald/5 to-transparent rounded-2xl" />
        <div className="absolute top-0 right-0">
          <LanguageSelector />
        </div>
        <div className="relative">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="relative">
              <Moon className="h-7 w-7 text-emerald" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-gold animate-pulse-gentle" />
            </div>
            <h1 className="font-serif text-2xl font-bold gradient-text">
              {t('appName')}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-light tracking-wide">
            {t('tagline')}
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
                <p className="text-xs uppercase tracking-wider text-gold-dark font-medium mb-0.5">{t('currentStreak')}</p>
                <p className="font-serif text-3xl font-bold text-foreground leading-none">
                  {streak.current_streak} <span className="text-lg text-muted-foreground">{t('days')}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t('weeklyProgress')}</span>
              <span className="font-semibold text-gold-dark">{streak.weekly_visits}/{streak.weekly_goal} {t('visits')}</span>
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
              <p className="text-xs text-emerald font-medium text-center mt-1">{t('weeklyGoalAchieved')} 🎉</p>
            ) : (
              <p className="text-xs text-muted-foreground text-center mt-1">
                {visitsRemaining} {t('moreVisitsToGoal')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ramadan Mode Card */}
      <Card 
        className={cn(
          "overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]",
          isRamadan 
            ? "border-gold/40 bg-gradient-to-br from-gold/20 via-emerald/10 to-gold/20" 
            : "border-emerald/30 bg-gradient-to-br from-emerald/15 to-gold/10"
        )}
        onClick={() => navigate('/mobile/ramadan')}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "relative p-3 rounded-2xl",
                isRamadan 
                  ? "bg-gradient-to-br from-gold to-gold-dark" 
                  : "bg-gradient-to-br from-emerald to-emerald-dark"
              )}>
                <Moon className="h-6 w-6 text-white" />
                {isRamadan && (
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-gold animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold">
                    {t("ramadanMode") || "Ramadan Mode"}
                  </h3>
                  {isRamadan && (
                    <Badge variant="gold" className="text-[10px] px-1.5">
                      {t("live") || "LIVE"}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isRamadan 
                    ? `${t("day") || "Day"} ${currentRamadanDay} • ${progress?.totalFasted || 0} ${t("fasted") || "fasted"}`
                    : daysUntilRamadan > 0 
                      ? `${daysUntilRamadan} ${t("daysUntilRamadan") || "days until Ramadan"}`
                      : t("viewRamadanFeatures") || "View Ramadan features"
                  }
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Countdown Timer (only during Ramadan) */}
          {isRamadan && prayerTimes && (
            <div className="mt-4 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {countdownTarget === "iftar" ? (
                    <Sun className="h-4 w-4 text-gold" />
                  ) : (
                    <Clock className="h-4 w-4 text-emerald" />
                  )}
                  <span className="text-xs font-medium text-muted-foreground">
                    {countdownTarget === "iftar" 
                      ? (t("iftarIn") || "Iftar in") 
                      : (t("suhoorEndsIn") || "Suhoor ends in")
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono text-lg font-bold">
                  <span className={countdownTarget === "iftar" ? "text-gold" : "text-emerald"}>
                    {String(countdown.hours).padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground">:</span>
                  <span className={countdownTarget === "iftar" ? "text-gold" : "text-emerald"}>
                    {String(countdown.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground">:</span>
                  <span className={countdownTarget === "iftar" ? "text-gold" : "text-emerald"}>
                    {String(countdown.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Geofencing Detection Status */}
      <GeofenceStatus />

      {/* Quick Actions - Enhanced Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2 border-emerald/20 bg-gradient-to-br from-emerald/5 to-transparent hover:from-emerald/15 hover:to-emerald/5 hover:border-emerald/40 transition-all duration-300 group rounded-xl shadow-sm"
          onClick={() => navigate('/mobile/qibla')}
        >
          <div className="p-2 rounded-xl bg-emerald/10 group-hover:bg-emerald/20 transition-colors">
            <Compass className="h-5 w-5 text-emerald" />
          </div>
          <span className="text-xs font-medium text-foreground">{t('qiblaFinder')}</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/15 hover:to-primary/5 hover:border-primary/40 transition-all duration-300 group rounded-xl shadow-sm"
          onClick={() => navigate('/mobile/umrah')}
        >
          <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <span className="text-xl">🕋</span>
          </div>
          <span className="text-xs font-medium text-foreground">{t('umrahMode')}</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent hover:from-gold/15 hover:to-gold/5 hover:border-gold/40 transition-all duration-300 group rounded-xl shadow-sm"
          onClick={() => navigate('/mobile/donate')}
        >
          <div className="p-2 rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors">
            <span className="text-xl">💝</span>
          </div>
          <span className="text-xs font-medium text-foreground">{t('donate')}</span>
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
              <h3 className="font-serif text-lg font-semibold">{t('nearbyMosques')}</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-emerald hover:text-emerald-dark hover:bg-emerald/10 gap-1 pr-2"
              onClick={() => navigate('/mobile/mosques')}
            >
              {t('viewAll')}
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
                      {t('nearby')}
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{t('enableLocation')}</p>
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
                {t('silenceReminder')}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/20" />
                <p className="text-xs opacity-70 font-light">{t('dailyReminder')}</p>
                <div className="h-px flex-1 bg-white/20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
