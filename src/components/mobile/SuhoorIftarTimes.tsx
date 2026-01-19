import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sun, 
  Moon, 
  Clock, 
  MapPin,
  Utensils,
  Coffee
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { useLanguage } from "@/hooks/use-language";
import { IFTAR_DUA, SUHOOR_INTENTION } from "@/hooks/use-ramadan";

// Default fallback location (Pristina, Kosovo)
const DEFAULT_LOCATION = { lat: 42.6629, lng: 21.1655 };

export function SuhoorIftarTimes() {
  const { t } = useLanguage();
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [targetTime, setTargetTime] = useState<"suhoor" | "iftar">("iftar");
  const [progress, setProgress] = useState(0);

  const { prayerTimes, isLoading } = usePrayerTimes(location.lat, location.lng);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Use default location if denied
        }
      );
    }
  }, []);

  // Calculate countdown
  useEffect(() => {
    if (!prayerTimes) return;

    const calculateCountdown = () => {
      const now = new Date();
      const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      // Suhoor ends at Fajr, Iftar is at Maghrib
      const fajrTime = prayerTimes.timings.Fajr.split(":").map(Number);
      const maghribTime = prayerTimes.timings.Maghrib.split(":").map(Number);

      const fajrSeconds = fajrTime[0] * 3600 + fajrTime[1] * 60;
      const maghribSeconds = maghribTime[0] * 3600 + maghribTime[1] * 60;

      let targetSeconds: number;
      let newTarget: "suhoor" | "iftar";

      if (currentTime < fajrSeconds) {
        // Before Fajr - countdown to Suhoor end
        targetSeconds = fajrSeconds - currentTime;
        newTarget = "suhoor";
      } else if (currentTime < maghribSeconds) {
        // After Fajr, before Maghrib - countdown to Iftar
        targetSeconds = maghribSeconds - currentTime;
        newTarget = "iftar";

        // Calculate fasting progress
        const fastingDuration = maghribSeconds - fajrSeconds;
        const fastingElapsed = currentTime - fajrSeconds;
        setProgress((fastingElapsed / fastingDuration) * 100);
      } else {
        // After Maghrib - countdown to tomorrow's Suhoor
        const secondsUntilMidnight = 86400 - currentTime;
        targetSeconds = secondsUntilMidnight + fajrSeconds;
        newTarget = "suhoor";
      }

      setTargetTime(newTarget);

      const hours = Math.floor(targetSeconds / 3600);
      const minutes = Math.floor((targetSeconds % 3600) / 60);
      const seconds = Math.floor(targetSeconds % 60);

      setCountdown({ hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  if (isLoading || !prayerTimes) {
    return (
      <Card className="border-emerald/20">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-8 w-24 bg-muted rounded mx-auto" />
            <div className="h-12 w-32 bg-muted rounded mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isFasting = targetTime === "iftar";

  return (
    <div className="space-y-4">
      {/* Main Countdown Card */}
      <Card className={cn(
        "border-2 overflow-hidden",
        isFasting 
          ? "border-gold/30 bg-gradient-to-br from-gold/10 to-orange-500/10" 
          : "border-emerald/30 bg-gradient-to-br from-emerald/10 to-teal-500/10"
      )}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {/* Icon */}
            <div className={cn(
              "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
              isFasting ? "bg-gold/20" : "bg-emerald/20"
            )}>
              {isFasting ? (
                <Sun className="h-8 w-8 text-gold" />
              ) : (
                <Moon className="h-8 w-8 text-emerald" />
              )}
            </div>

            {/* Label */}
            <div>
              <Badge 
                variant="outline" 
                className={cn(
                  "mb-2",
                  isFasting 
                    ? "bg-gold/10 text-gold border-gold/30" 
                    : "bg-emerald/10 text-emerald border-emerald/30"
                )}
              >
                {isFasting 
                  ? (t("iftarIn") || "Iftar in") 
                  : (t("suhoorEndsIn") || "Suhoor ends in")
                }
              </Badge>
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-2">
              <div className="text-center">
                <span className="text-4xl font-bold tabular-nums">
                  {String(countdown.hours).padStart(2, "0")}
                </span>
                <p className="text-xs text-muted-foreground">{t("hours") || "hrs"}</p>
              </div>
              <span className="text-3xl font-bold text-muted-foreground">:</span>
              <div className="text-center">
                <span className="text-4xl font-bold tabular-nums">
                  {String(countdown.minutes).padStart(2, "0")}
                </span>
                <p className="text-xs text-muted-foreground">{t("minutes") || "min"}</p>
              </div>
              <span className="text-3xl font-bold text-muted-foreground">:</span>
              <div className="text-center">
                <span className="text-4xl font-bold tabular-nums">
                  {String(countdown.seconds).padStart(2, "0")}
                </span>
                <p className="text-xs text-muted-foreground">{t("seconds") || "sec"}</p>
              </div>
            </div>

            {/* Fasting Progress (only during fasting hours) */}
            {isFasting && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("fastingProgress") || "Fasting Progress"}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Times Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-emerald/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="h-4 w-4 text-emerald" />
              <span className="text-xs font-medium text-muted-foreground">
                {t("suhoor") || "Suhoor"}
              </span>
            </div>
            <p className="text-xl font-bold">{t("before") || "Before"}</p>
            <p className="text-2xl font-bold text-emerald">
              {prayerTimes.timings.Fajr}
            </p>
          </CardContent>
        </Card>

        <Card className="border-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-gold" />
              <span className="text-xs font-medium text-muted-foreground">
                {t("iftar") || "Iftar"}
              </span>
            </div>
            <p className="text-xl font-bold">{t("at") || "At"}</p>
            <p className="text-2xl font-bold text-gold">
              {prayerTimes.timings.Maghrib}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dua Card */}
      <Card className="border-emerald/20 bg-card/50">
        <CardContent className="p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            {isFasting ? (
              <>
                <Utensils className="h-4 w-4 text-gold" />
                {t("iftarDua") || "Dua for Breaking Fast"}
              </>
            ) : (
              <>
                <Coffee className="h-4 w-4 text-emerald" />
                {t("suhoorIntention") || "Intention for Fasting"}
              </>
            )}
          </h4>
          
          <div className="space-y-2">
            <p className="text-xl text-right font-arabic leading-loose" dir="rtl">
              {isFasting ? IFTAR_DUA.arabic : SUHOOR_INTENTION.arabic}
            </p>
            <p className="text-sm text-muted-foreground italic">
              {isFasting ? IFTAR_DUA.transliteration : SUHOOR_INTENTION.transliteration}
            </p>
            <p className="text-sm">
              {isFasting ? IFTAR_DUA.translation : SUHOOR_INTENTION.translation}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Location Info */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>
          {prayerTimes.meta?.timezone || "Local time"}
        </span>
      </div>
    </div>
  );
}
